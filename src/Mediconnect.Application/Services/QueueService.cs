using Mediconnect.Application.DTOs;
using Mediconnect.Application.Interfaces;
using Mediconnect.Domain.Entities;

namespace Mediconnect.Application.Services;

public class QueueService : IQueueService
{
    private readonly IRepository<QueueTicket> _ticketRepository;
    private readonly IRepository<Clinic> _clinicRepository;
    private readonly IRepository<Appointment> _appointmentRepository;
    private readonly IRepository<PatientProfile> _patientProfileRepository;
    private readonly IRepository<UserAccount> _userAccountRepository;
    private readonly IPasswordHasher _passwordHasher;

    public QueueService(
        IRepository<QueueTicket> ticketRepository,
        IRepository<Clinic> clinicRepository,
        IRepository<Appointment> appointmentRepository,
        IRepository<PatientProfile> patientProfileRepository,
        IRepository<UserAccount> userAccountRepository,
        IPasswordHasher passwordHasher)
    {
        _ticketRepository = ticketRepository;
        _clinicRepository = clinicRepository;
        _appointmentRepository = appointmentRepository;
        _patientProfileRepository = patientProfileRepository;
        _userAccountRepository = userAccountRepository;
        _passwordHasher = passwordHasher;
    }

    public async Task<QueueTicketDetailDto> CheckInAsync(CheckInRequestDto dto, CancellationToken cancellationToken = default)
    {
        var clinic = await _clinicRepository.GetByIdAsync(dto.ClinicId, cancellationToken)
            ?? throw new InvalidOperationException("Clinic not found.");

        if (!clinic.IsActive)
            throw new InvalidOperationException("Clinic is not currently active.");

        var ticket = await CreateTicketAsync(clinic, dto.AppointmentId, cancellationToken);
        var patientName = await ResolvePatientNameAsync(dto.AppointmentId, cancellationToken);

        return MapToDetail(ticket, clinic, null, patientName);
    }

    public async Task<QueueTicketDetailDto> WalkInCheckInAsync(WalkInCheckInRequestDto dto, CancellationToken cancellationToken = default)
    {
        var clinic = await _clinicRepository.GetByIdAsync(dto.ClinicId, cancellationToken)
            ?? throw new InvalidOperationException("Clinic not found.");

        if (!clinic.IsActive)
            throw new InvalidOperationException("Clinic is not currently active.");

        var ticket = await CreateTicketAsync(clinic, dto.AppointmentId, cancellationToken);

        // Walk-in: nếu không có appointment thì dùng tên do lễ tân nhập
        var patientName = dto.AppointmentId.HasValue
            ? await ResolvePatientNameAsync(dto.AppointmentId, cancellationToken)
            : dto.PatientName;

        Guid? patientId = dto.AppointmentId.HasValue
            ? await ResolvePatientIdAsync(dto.AppointmentId, cancellationToken)
            : null;

        // Vãng lai có tên + email: tạo (hoặc tái sử dụng) tài khoản Patient thật, y hệt cách
        // Admin tạo user thủ công, để có PatientId hợp lệ cho toàn bộ luồng khám/kê đơn phía sau.
        if (!dto.AppointmentId.HasValue && !string.IsNullOrWhiteSpace(dto.PatientName) && !string.IsNullOrWhiteSpace(dto.PatientEmail))
        {
            var profile = await GetOrCreateWalkInPatientProfileAsync(dto.PatientName, dto.PatientEmail, dto.PatientPhone, cancellationToken);
            patientId = profile.Id;

            ticket.PatientId = profile.Id;
            ticket.PatientName = dto.PatientName;
            _ticketRepository.Update(ticket);
            await _ticketRepository.SaveChangesAsync(cancellationToken);
        }

        return MapToDetail(ticket, clinic, patientId, patientName);
    }

    public async Task<ClinicQueueDto> GetClinicQueueAsync(Guid clinicId, CancellationToken cancellationToken = default)
    {
        var clinic = await _clinicRepository.GetByIdAsync(clinicId, cancellationToken)
            ?? throw new InvalidOperationException("Clinic not found.");

        var (todayStart, todayEnd) = GetTodayRange();

        var activeTickets = await _ticketRepository.ListAsync(
            t => t.ClinicId == clinicId
                 && t.IssuedAt >= todayStart && t.IssuedAt < todayEnd
                 && (t.Status == QueueStatus.Waiting || t.Status == QueueStatus.InProgress),
            cancellationToken);

        var sorted = activeTickets.OrderBy(t => t.Number).ToList();
        var inProgress = sorted.FirstOrDefault(t => t.Status == QueueStatus.InProgress);

        // Batch-resolve patient names (đã bao gồm fallback cho ticket vãng lai có PatientName snapshot)
        var nameMap = await BuildPatientNameMapAsync(sorted, cancellationToken);
        var patientIdMap = await BuildPatientIdMapAsync(sorted, cancellationToken);

        return new ClinicQueueDto
        {
            ClinicId = clinic.Id,
            ClinicName = clinic.Name,
            RoomNumber = clinic.RoomNumber,
            WaitingCount = sorted.Count(t => t.Status == QueueStatus.Waiting),
            CurrentNumber = inProgress?.Number,
            Tickets = sorted.Select(t =>
            {
                nameMap.TryGetValue(t.Id, out var name);
                patientIdMap.TryGetValue(t.Id, out var pid);
                return MapToDetail(t, clinic, pid == Guid.Empty ? null : pid, name);
            }).ToList()
        };
    }

    public async Task<QueueTicketDetailDto?> CallNextAsync(Guid clinicId, CancellationToken cancellationToken = default)
    {
        var clinic = await _clinicRepository.GetByIdAsync(clinicId, cancellationToken)
            ?? throw new InvalidOperationException("Clinic not found.");

        var (todayStart, todayEnd) = GetTodayRange();

        var inProgressTickets = await _ticketRepository.ListAsync(
            t => t.ClinicId == clinicId
                 && t.IssuedAt >= todayStart && t.IssuedAt < todayEnd
                 && t.Status == QueueStatus.InProgress,
            cancellationToken);

        foreach (var current in inProgressTickets)
        {
            current.Status = QueueStatus.Completed;
            _ticketRepository.Update(current);
        }

        var waitingTickets = await _ticketRepository.ListAsync(
            t => t.ClinicId == clinicId
                 && t.IssuedAt >= todayStart && t.IssuedAt < todayEnd
                 && t.Status == QueueStatus.Waiting,
            cancellationToken);

        var next = waitingTickets.OrderBy(t => t.Number).FirstOrDefault();

        if (next is null)
        {
            await _ticketRepository.SaveChangesAsync(cancellationToken);
            return null;
        }

        next.Status = QueueStatus.InProgress;
        _ticketRepository.Update(next);
        await _ticketRepository.SaveChangesAsync(cancellationToken);

        var patientName = await ResolveNameWithWalkInFallback(next, cancellationToken);
        var patientId = await ResolveIdWithWalkInFallback(next, cancellationToken);

        return MapToDetail(next, clinic, patientId, patientName);
    }

    public async Task<IReadOnlyList<ClinicQueueSummaryDto>> GetAllClinicsQueueSummaryAsync(CancellationToken cancellationToken = default)
    {
        var clinics = await _clinicRepository.GetAllAsync(cancellationToken);
        var (todayStart, todayEnd) = GetTodayRange();

        var result = new List<ClinicQueueSummaryDto>();

        foreach (var clinic in clinics.OrderBy(c => c.Name))
        {
            var activeTickets = await _ticketRepository.ListAsync(
                t => t.ClinicId == clinic.Id
                     && t.IssuedAt >= todayStart && t.IssuedAt < todayEnd
                     && (t.Status == QueueStatus.Waiting || t.Status == QueueStatus.InProgress),
                cancellationToken);

            var inProgress = activeTickets.FirstOrDefault(t => t.Status == QueueStatus.InProgress);
            string? currentPatientName = null;
            if (inProgress is not null)
                currentPatientName = await ResolveNameWithWalkInFallback(inProgress, cancellationToken);

            result.Add(new ClinicQueueSummaryDto
            {
                ClinicId = clinic.Id,
                ClinicName = clinic.Name,
                RoomNumber = clinic.RoomNumber,
                IsActive = clinic.IsActive,
                WaitingCount = activeTickets.Count(t => t.Status == QueueStatus.Waiting),
                InProgressCount = activeTickets.Count(t => t.Status == QueueStatus.InProgress),
                CurrentNumber = inProgress?.Number,
                CurrentPatientName = currentPatientName
            });
        }

        return result;
    }

    public async Task<QueueTicketDetailDto?> TransferTicketAsync(Guid ticketId, Guid targetClinicId, CancellationToken cancellationToken = default)
    {
        var ticket = await _ticketRepository.GetByIdAsync(ticketId, cancellationToken);
        if (ticket is null) return null;

        var targetClinic = await _clinicRepository.GetByIdAsync(targetClinicId, cancellationToken)
            ?? throw new InvalidOperationException("Target clinic not found.");

        if (!targetClinic.IsActive)
            throw new InvalidOperationException("Target clinic is not currently active.");

        // Tính số thứ tự mới ở phòng đích
        var (todayStart, todayEnd) = GetTodayRange();
        var targetTickets = await _ticketRepository.ListAsync(
            t => t.ClinicId == targetClinicId && t.IssuedAt >= todayStart && t.IssuedAt < todayEnd,
            cancellationToken);
        var newNumber = targetTickets.Count > 0 ? targetTickets.Max(t => t.Number) + 1 : 1;

        ticket.ClinicId = targetClinicId;
        ticket.Number = newNumber;
        ticket.Status = QueueStatus.Waiting;
        _ticketRepository.Update(ticket);
        await _ticketRepository.SaveChangesAsync(cancellationToken);

        var patientName = await ResolveNameWithWalkInFallback(ticket, cancellationToken);
        var patientId = await ResolveIdWithWalkInFallback(ticket, cancellationToken);

        return MapToDetail(ticket, targetClinic, patientId, patientName);
    }

    // ─── Private Helpers ──────────────────────────────────────────────────────

    private async Task<QueueTicket> CreateTicketAsync(Clinic clinic, Guid? appointmentId, CancellationToken cancellationToken)
    {
        var (todayStart, todayEnd) = GetTodayRange();
        var todayTickets = await _ticketRepository.ListAsync(
            t => t.ClinicId == clinic.Id && t.IssuedAt >= todayStart && t.IssuedAt < todayEnd,
            cancellationToken);

        var nextNumber = todayTickets.Count > 0 ? todayTickets.Max(t => t.Number) + 1 : 1;

        var ticket = new QueueTicket
        {
            Id = Guid.NewGuid(),
            ClinicId = clinic.Id,
            AppointmentId = appointmentId,
            Number = nextNumber,
            IssuedAt = DateTime.UtcNow,
            Status = QueueStatus.Waiting
        };

        await _ticketRepository.AddAsync(ticket, cancellationToken);
        await _ticketRepository.SaveChangesAsync(cancellationToken);
        return ticket;
    }

    /// <summary>
    /// Tạo tài khoản Patient + PatientProfile cho khách vãng lai (giống Admin tạo user thủ công),
    /// hoặc tái sử dụng tài khoản đã có nếu email trùng với bệnh nhân từng đăng ký/khám trước đó.
    /// </summary>
    private async Task<PatientProfile> GetOrCreateWalkInPatientProfileAsync(
        string patientName, string patientEmail, string? patientPhone, CancellationToken cancellationToken)
    {
        var existingUser = await _userAccountRepository.FirstOrDefaultAsync(u => u.Email == patientEmail, cancellationToken);

        UserAccount user;
        if (existingUser is not null)
        {
            user = existingUser;
        }
        else
        {
            user = new UserAccount
            {
                Id = Guid.NewGuid(),
                FullName = patientName,
                Email = patientEmail,
                PhoneNumber = patientPhone,
                Role = UserRole.Patient,
                IsActive = true,
                PasswordHash = _passwordHasher.Hash(Guid.NewGuid().ToString("N"))
            };
            await _userAccountRepository.AddAsync(user, cancellationToken);
            await _userAccountRepository.SaveChangesAsync(cancellationToken);
        }

        var existingProfile = await _patientProfileRepository.FirstOrDefaultAsync(p => p.UserAccountId == user.Id, cancellationToken);
        if (existingProfile is not null)
        {
            return existingProfile;
        }

        var profile = new PatientProfile
        {
            Id = Guid.NewGuid(),
            UserAccountId = user.Id
        };
        await _patientProfileRepository.AddAsync(profile, cancellationToken);
        await _patientProfileRepository.SaveChangesAsync(cancellationToken);
        return profile;
    }

    /// <summary>Ưu tiên đọc tên đã snapshot trên ticket (vãng lai); fallback resolve qua Appointment như cũ.</summary>
    private async Task<string?> ResolveNameWithWalkInFallback(QueueTicket ticket, CancellationToken cancellationToken) =>
        !string.IsNullOrEmpty(ticket.PatientName)
            ? ticket.PatientName
            : await ResolvePatientNameAsync(ticket.AppointmentId, cancellationToken);

    /// <summary>Ưu tiên đọc PatientId đã lưu trên ticket (vãng lai); fallback resolve qua Appointment như cũ.</summary>
    private async Task<Guid?> ResolveIdWithWalkInFallback(QueueTicket ticket, CancellationToken cancellationToken) =>
        ticket.PatientId ?? await ResolvePatientIdAsync(ticket.AppointmentId, cancellationToken);

    private async Task<string?> ResolvePatientNameAsync(Guid? appointmentId, CancellationToken cancellationToken)
    {
        if (!appointmentId.HasValue) return null;

        var appointment = await _appointmentRepository.GetByIdAsync(appointmentId.Value, cancellationToken);
        if (appointment is null) return null;

        var profile = await _patientProfileRepository.GetByIdAsync(appointment.PatientId, cancellationToken);
        if (profile is null) return null;

        var user = await _userAccountRepository.GetByIdAsync(profile.UserAccountId, cancellationToken);
        return user?.FullName;
    }

    private async Task<Guid?> ResolvePatientIdAsync(Guid? appointmentId, CancellationToken cancellationToken)
    {
        if (!appointmentId.HasValue) return null;

        var appointment = await _appointmentRepository.GetByIdAsync(appointmentId.Value, cancellationToken);
        return appointment?.PatientId;
    }

    private async Task<Dictionary<Guid, string?>> BuildPatientNameMapAsync(
        IEnumerable<QueueTicket> tickets,
        CancellationToken cancellationToken)
    {
        var result = new Dictionary<Guid, string?>();
        var ticketList = tickets.ToList();
        var appointmentIds = ticketList
            .Where(t => t.AppointmentId.HasValue)
            .Select(t => t.AppointmentId!.Value)
            .Distinct()
            .ToList();

        if (appointmentIds.Count == 0)
        {
            // Không có ticket nào gắn appointment — vẫn cần điền tên vãng lai đã snapshot trên ticket.
            foreach (var t in ticketList)
                result[t.Id] = t.PatientName;
            return result;
        }

        var appointments = await _appointmentRepository.ListAsync(
            a => appointmentIds.Contains(a.Id), cancellationToken);

        var patientIds = appointments.Select(a => a.PatientId).Distinct().ToList();
        var profiles = await _patientProfileRepository.ListAsync(
            p => patientIds.Contains(p.Id), cancellationToken);

        var userIds = profiles.Select(p => p.UserAccountId).Distinct().ToList();
        var users = await _userAccountRepository.ListAsync(
            u => userIds.Contains(u.Id), cancellationToken);

        var profileByPatientId = profiles.ToDictionary(p => p.Id);
        var userByAccountId = users.ToDictionary(u => u.Id);
        var appointmentById = appointments.ToDictionary(a => a.Id);

        foreach (var ticket in ticketList)
        {
            if (!ticket.AppointmentId.HasValue)
            {
                // Vãng lai: dùng tên đã snapshot trên ticket lúc check-in (nếu có).
                result[ticket.Id] = ticket.PatientName;
                continue;
            }
            if (!appointmentById.TryGetValue(ticket.AppointmentId.Value, out var appt))
            {
                result[ticket.Id] = null;
                continue;
            }
            if (!profileByPatientId.TryGetValue(appt.PatientId, out var profile))
            {
                result[ticket.Id] = null;
                continue;
            }
            result[ticket.Id] = userByAccountId.TryGetValue(profile.UserAccountId, out var u) ? u.FullName : null;
        }

        return result;
    }

    private async Task<Dictionary<Guid, Guid>> BuildPatientIdMapAsync(
        IEnumerable<QueueTicket> tickets,
        CancellationToken cancellationToken)
    {
        var result = new Dictionary<Guid, Guid>();
        var ticketList = tickets.ToList();
        var appointmentIds = ticketList
            .Where(t => t.AppointmentId.HasValue)
            .Select(t => t.AppointmentId!.Value)
            .Distinct()
            .ToList();

        if (appointmentIds.Count == 0)
        {
            // Không có ticket nào gắn appointment — vẫn cần điền PatientId vãng lai đã lưu trên ticket.
            foreach (var t in ticketList)
            {
                if (t.PatientId.HasValue) result[t.Id] = t.PatientId.Value;
            }
            return result;
        }

        var appointments = await _appointmentRepository.ListAsync(
            a => appointmentIds.Contains(a.Id), cancellationToken);

        var appointmentById = appointments.ToDictionary(a => a.Id);

        foreach (var ticket in ticketList)
        {
            if (ticket.AppointmentId.HasValue && appointmentById.TryGetValue(ticket.AppointmentId.Value, out var appt))
                result[ticket.Id] = appt.PatientId;
            else if (ticket.PatientId.HasValue)
                result[ticket.Id] = ticket.PatientId.Value;
        }

        return result;
    }

    private static (DateTime start, DateTime end) GetTodayRange()
    {
        var start = DateTime.UtcNow.Date;
        return (start, start.AddDays(1));
    }

    private static QueueTicketDetailDto MapToDetail(
        QueueTicket ticket,
        Clinic clinic,
        Guid? patientId,
        string? patientName) => new()
    {
        Id = ticket.Id,
        ClinicId = clinic.Id,
        ClinicName = clinic.Name,
        ClinicRoomNumber = clinic.RoomNumber,
        AppointmentId = ticket.AppointmentId,
        PatientId = patientId,
        PatientName = patientName,
        Number = ticket.Number,
        IssuedAt = ticket.IssuedAt,
        Status = ticket.Status
    };
}
