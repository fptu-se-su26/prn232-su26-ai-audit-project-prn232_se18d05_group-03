using Mediconnect.Application.DTOs;

namespace Mediconnect.Application.Interfaces;

public interface IStaffScheduleService
{
    Task<ScheduleFlatReadDto> CreateAsync(ScheduleWriteDto dto, CancellationToken cancellationToken = default);

    Task<ScheduleFlatReadDto?> UpdateAsync(Guid id, ScheduleWriteDto dto, CancellationToken cancellationToken = default);

    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<ScheduleFlatReadDto>> GetAllAsync(CancellationToken cancellationToken = default);

    Task<PagedResult<ScheduleFlatReadDto>> FilterAsync(
        ScheduleFilterQuery query,
        CancellationToken cancellationToken = default);
}
