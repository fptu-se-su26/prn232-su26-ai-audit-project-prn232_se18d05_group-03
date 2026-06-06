using Mediconnect.Application.DTOs;
using Mediconnect.Application.Interfaces;
using Mediconnect.Domain.Entities;

namespace Mediconnect.Application.Services;

public class QueueService : IQueueService
{
    private readonly IRepository<QueueTicket> _ticketRepository;
    private readonly IRepository<Clinic> _clinicRepository;

    public QueueService(IRepository<QueueTicket> ticketRepository, IRepository<Clinic> clinicRepository)
    {
        _ticketRepository = ticketRepository;
        _clinicRepository = clinicRepository;
    }

    public async Task<QueueTicketDetailDto> CheckInAsync(CheckInRequestDto dto, CancellationToken cancellationToken = default)
    {
        var clinic = await _clinicRepository.GetByIdAsync(dto.ClinicId, cancellationToken)
            ?? throw new InvalidOperationException("Clinic not found.");

        if (!clinic.IsActive)
            throw new InvalidOperationException("Clinic is not currently active.");

        var todayStart = DateTime.UtcNow.Date;
        var todayEnd = todayStart.AddDays(1);

        var todayTickets = await _ticketRepository.ListAsync(
            t => t.ClinicId == dto.ClinicId && t.IssuedAt >= todayStart && t.IssuedAt < todayEnd,
            cancellationToken);

        var nextNumber = todayTickets.Count > 0 ? todayTickets.Max(t => t.Number) + 1 : 1;

        var ticket = new QueueTicket
        {
            Id = Guid.NewGuid(),
            ClinicId = dto.ClinicId,
            AppointmentId = dto.AppointmentId,
            Number = nextNumber,
            IssuedAt = DateTime.UtcNow,
            Status = QueueStatus.Waiting
        };

        await _ticketRepository.AddAsync(ticket, cancellationToken);
        await _ticketRepository.SaveChangesAsync(cancellationToken);

        return MapToDetail(ticket, clinic);
    }

    public async Task<ClinicQueueDto> GetClinicQueueAsync(Guid clinicId, CancellationToken cancellationToken = default)
    {
        var clinic = await _clinicRepository.GetByIdAsync(clinicId, cancellationToken)
            ?? throw new InvalidOperationException("Clinic not found.");

        var todayStart = DateTime.UtcNow.Date;
        var todayEnd = todayStart.AddDays(1);

        var activeTickets = await _ticketRepository.ListAsync(
            t => t.ClinicId == clinicId
                 && t.IssuedAt >= todayStart && t.IssuedAt < todayEnd
                 && (t.Status == QueueStatus.Waiting || t.Status == QueueStatus.InProgress),
            cancellationToken);

        var sorted = activeTickets.OrderBy(t => t.Number).ToList();
        var inProgress = sorted.FirstOrDefault(t => t.Status == QueueStatus.InProgress);

        return new ClinicQueueDto
        {
            ClinicId = clinic.Id,
            ClinicName = clinic.Name,
            RoomNumber = clinic.RoomNumber,
            WaitingCount = sorted.Count(t => t.Status == QueueStatus.Waiting),
            CurrentNumber = inProgress?.Number,
            Tickets = sorted.Select(t => MapToDetail(t, clinic)).ToList()
        };
    }

    public async Task<QueueTicketDetailDto?> CallNextAsync(Guid clinicId, CancellationToken cancellationToken = default)
    {
        var clinic = await _clinicRepository.GetByIdAsync(clinicId, cancellationToken)
            ?? throw new InvalidOperationException("Clinic not found.");

        var todayStart = DateTime.UtcNow.Date;
        var todayEnd = todayStart.AddDays(1);

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

        return MapToDetail(next, clinic);
    }

    private static QueueTicketDetailDto MapToDetail(QueueTicket ticket, Clinic clinic) => new()
    {
        Id = ticket.Id,
        ClinicId = clinic.Id,
        ClinicName = clinic.Name,
        ClinicRoomNumber = clinic.RoomNumber,
        AppointmentId = ticket.AppointmentId,
        Number = ticket.Number,
        IssuedAt = ticket.IssuedAt,
        Status = ticket.Status
    };
}
