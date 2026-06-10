using Mediconnect.Application.DTOs;

namespace Mediconnect.Application.Interfaces;

public interface IStaffScheduleQuery
{
    Task<IReadOnlyList<ScheduleFlatReadDto>> GetAllFlatAsync(CancellationToken cancellationToken = default);

    Task<ScheduleFlatReadDto?> GetFlatByIdAsync(Guid id, CancellationToken cancellationToken = default);

    Task<PagedResult<ScheduleFlatReadDto>> FilterFlatAsync(
        ScheduleFilterQuery query,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<StaffDirectoryDto>> GetStaffDirectoryAsync(CancellationToken cancellationToken = default);
}
