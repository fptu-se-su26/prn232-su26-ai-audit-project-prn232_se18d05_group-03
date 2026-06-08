using Mediconnect.Application.DTOs;
using Mediconnect.Application.Interfaces;
using Mediconnect.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Mediconnect.Infrastructure.Repositories;

public class StaffScheduleQuery : IStaffScheduleQuery
{
    private readonly AppDbContext _context;

    public StaffScheduleQuery(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyList<ScheduleFlatReadDto>> GetAllFlatAsync(CancellationToken cancellationToken = default)
    {
        return await BuildFlatQuery()
            .OrderBy(s => s.Date)
            .ThenBy(s => s.ShiftType)
            .ToListAsync(cancellationToken);
    }

    public async Task<ScheduleFlatReadDto?> GetFlatByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await BuildFlatQuery()
            .FirstOrDefaultAsync(s => s.Id == id, cancellationToken);
    }

    public async Task<PagedResult<ScheduleFlatReadDto>> FilterFlatAsync(
        ScheduleFilterQuery query,
        CancellationToken cancellationToken = default)
    {
        var flatQuery = BuildFlatQuery();

        if (query.StartDate.HasValue)
            flatQuery = flatQuery.Where(s => s.Date >= query.StartDate.Value);

        if (query.EndDate.HasValue)
            flatQuery = flatQuery.Where(s => s.Date <= query.EndDate.Value);

        if (query.DepartmentId.HasValue)
            flatQuery = flatQuery.Where(s => s.DepartmentId == query.DepartmentId.Value);

        var totalCount = await flatQuery.CountAsync(cancellationToken);

        var items = await flatQuery
            .OrderBy(s => s.Date)
            .ThenBy(s => s.ShiftType)
            .ThenBy(s => s.Name)
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync(cancellationToken);

        return new PagedResult<ScheduleFlatReadDto>
        {
            Items = items,
            Page = query.Page,
            PageSize = query.PageSize,
            TotalCount = totalCount,
            TotalPages = totalCount == 0 ? 0 : (int)Math.Ceiling(totalCount / (double)query.PageSize)
        };
    }

    private IQueryable<ScheduleFlatReadDto> BuildFlatQuery()
    {
        return _context.StaffSchedules
            .AsNoTracking()
            .Select(s => new ScheduleFlatReadDto
            {
                Id = s.Id,
                StaffId = s.StaffId,
                Date = s.ShiftDate,
                Shift = s.ShiftType == Mediconnect.Domain.Entities.ShiftType.Morning ? "Ca Sáng"
                      : s.ShiftType == Mediconnect.Domain.Entities.ShiftType.Afternoon ? "Ca Chiều"
                      : "Ca Tối",
                ShiftType = s.ShiftType,
                StartTime = s.StartTime,
                EndTime = s.EndTime,
                WorkRoom = s.WorkRoom,
                UserId = s.Staff.UserAccountId,
                Name = s.Staff.UserAccount.FullName,
                Email = s.Staff.UserAccount.Email,
                Specialty = s.Staff.Specialty,
                YearsExperience = s.Staff.YearsExperience,
                Degree = s.Staff.Degree,
                DepartmentId = s.Staff.DepartmentId,
                Department = s.Staff.Department.Name,
                StaffType = s.Staff.StaffType
            });
    }
}
