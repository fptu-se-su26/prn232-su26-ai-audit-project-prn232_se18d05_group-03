using Mediconnect.Application.DTOs;
using Mediconnect.Application.Exceptions;
using Mediconnect.Application.Helpers;
using Mediconnect.Application.Interfaces;
using Mediconnect.Application.Options;
using Mediconnect.Domain.Entities;

namespace Mediconnect.Application.Services;

public class StaffScheduleService : IStaffScheduleService
{
    private readonly IRepository<StaffSchedule> _scheduleRepository;
    private readonly IRepository<StaffProfile> _staffRepository;
    private readonly IStaffScheduleQuery _scheduleQuery;
    private readonly ScheduleSettings _settings;

    public StaffScheduleService(
        IRepository<StaffSchedule> scheduleRepository,
        IRepository<StaffProfile> staffRepository,
        IStaffScheduleQuery scheduleQuery,
        ScheduleSettings settings)
    {
        _scheduleRepository = scheduleRepository;
        _staffRepository = staffRepository;
        _scheduleQuery = scheduleQuery;
        _settings = settings;
    }

    public async Task<ScheduleFlatReadDto> CreateAsync(ScheduleWriteDto dto, CancellationToken cancellationToken = default)
    {
        ValidateWriteDto(dto);
        await EnsureStaffExistsAsync(dto.StaffId, cancellationToken);
        await ValidateBusinessRulesAsync(dto.StaffId, dto.ShiftDate, dto.ShiftType, excludeScheduleId: null, cancellationToken);

        var (start, end) = ShiftTimeHelper.GetTimes(dto.ShiftType);
        var schedule = new StaffSchedule
        {
            Id = Guid.NewGuid(),
            StaffId = dto.StaffId,
            ShiftDate = dto.ShiftDate,
            ShiftType = dto.ShiftType,
            StartTime = start,
            EndTime = end,
            WorkRoom = dto.WorkRoom
        };

        await _scheduleRepository.AddAsync(schedule, cancellationToken);
        await _scheduleRepository.SaveChangesAsync(cancellationToken);

        return await _scheduleQuery.GetFlatByIdAsync(schedule.Id, cancellationToken)
            ?? throw new InvalidOperationException("Failed to load created schedule.");
    }

    public async Task<ScheduleFlatReadDto?> UpdateAsync(Guid id, ScheduleWriteDto dto, CancellationToken cancellationToken = default)
    {
        ValidateWriteDto(dto);

        var schedule = await _scheduleRepository.GetByIdAsync(id, cancellationToken);
        if (schedule is null)
            return null;

        await EnsureStaffExistsAsync(dto.StaffId, cancellationToken);
        await ValidateBusinessRulesAsync(dto.StaffId, dto.ShiftDate, dto.ShiftType, excludeScheduleId: id, cancellationToken);

        var (start, end) = ShiftTimeHelper.GetTimes(dto.ShiftType);
        schedule.StaffId = dto.StaffId;
        schedule.ShiftDate = dto.ShiftDate;
        schedule.ShiftType = dto.ShiftType;
        schedule.StartTime = start;
        schedule.EndTime = end;
        schedule.WorkRoom = dto.WorkRoom;

        _scheduleRepository.Update(schedule);
        await _scheduleRepository.SaveChangesAsync(cancellationToken);

        return await _scheduleQuery.GetFlatByIdAsync(id, cancellationToken);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var schedule = await _scheduleRepository.GetByIdAsync(id, cancellationToken);
        if (schedule is null)
            return false;

        _scheduleRepository.Remove(schedule);
        await _scheduleRepository.SaveChangesAsync(cancellationToken);
        return true;
    }

    public Task<IReadOnlyList<ScheduleFlatReadDto>> GetAllAsync(CancellationToken cancellationToken = default)
        => _scheduleQuery.GetAllFlatAsync(cancellationToken);

    public Task<PagedResult<ScheduleFlatReadDto>> FilterAsync(
        ScheduleFilterQuery query,
        CancellationToken cancellationToken = default)
        => _scheduleQuery.FilterFlatAsync(NormalizeFilter(query), cancellationToken);

    private static void ValidateWriteDto(ScheduleWriteDto dto)
    {
        if (dto.StaffId == Guid.Empty)
            throw new ScheduleValidationException("StaffId is required.");

        if (!Enum.IsDefined(typeof(ShiftType), dto.ShiftType))
            throw new ScheduleValidationException("Invalid shift type. Allowed values: Morning, Afternoon, Evening.");
    }

    private async Task EnsureStaffExistsAsync(Guid staffId, CancellationToken cancellationToken)
    {
        var staff = await _staffRepository.GetByIdAsync(staffId, cancellationToken);
        if (staff is null)
            throw new ScheduleValidationException("Staff profile not found.");
    }

    private async Task ValidateBusinessRulesAsync(
        Guid staffId,
        DateOnly shiftDate,
        ShiftType shiftType,
        Guid? excludeScheduleId,
        CancellationToken cancellationToken)
    {
        var existing = await _scheduleRepository.ListAsync(
            s => s.StaffId == staffId && s.ShiftDate == shiftDate,
            cancellationToken);

        var relevant = excludeScheduleId.HasValue
            ? existing.Where(s => s.Id != excludeScheduleId.Value).ToList()
            : existing.ToList();

        if (relevant.Any(s => s.ShiftType == shiftType))
        {
            throw new ScheduleValidationException(
                $"Staff already has a {ShiftTimeHelper.GetDisplayName(shiftType)} shift on {shiftDate:yyyy-MM-dd}.");
        }

        if (relevant.Count >= _settings.MaxShiftsPerDay)
        {
            throw new ScheduleValidationException(
                $"Staff cannot exceed {_settings.MaxShiftsPerDay} shift(s) per day (date: {shiftDate:yyyy-MM-dd}).");
        }
    }

    private static ScheduleFilterQuery NormalizeFilter(ScheduleFilterQuery query)
    {
        var page = query.Page < 1 ? 1 : query.Page;
        var pageSize = query.PageSize < 1 ? 20 : Math.Min(query.PageSize, 100);

        if (query.CurrentWeek)
        {
            var today = DateOnly.FromDateTime(DateTime.Today);
            var dayOfWeek = (int)today.DayOfWeek;
            var mondayOffset = dayOfWeek == 0 ? -6 : 1 - dayOfWeek;
            var weekStart = today.AddDays(mondayOffset);
            var weekEnd = weekStart.AddDays(6);

            return new ScheduleFilterQuery
            {
                StartDate = weekStart,
                EndDate = weekEnd,
                CurrentWeek = true,
                DepartmentId = query.DepartmentId,
                Page = page,
                PageSize = pageSize
            };
        }

        return new ScheduleFilterQuery
        {
            StartDate = query.StartDate,
            EndDate = query.EndDate,
            CurrentWeek = false,
            DepartmentId = query.DepartmentId,
            Page = page,
            PageSize = pageSize
        };
    }
}
