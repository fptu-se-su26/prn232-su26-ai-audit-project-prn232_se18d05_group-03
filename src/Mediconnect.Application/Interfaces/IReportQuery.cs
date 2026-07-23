    namespace Mediconnect.Application.Interfaces;

using Mediconnect.Application.DTOs;

public interface IReportQuery
{
    Task<SummaryReportDto> GetSummaryAsync(
        string period,
        CancellationToken ct = default);

    Task<IReadOnlyList<RevenueItemDto>> GetRevenueAsync(
        DateTime? startDate,
        DateTime? endDate,
        string? groupBy,
        string? department,
        CancellationToken ct = default);

    Task<BedOccupancyReportDto> GetBedOccupancyAsync(
        string? department,
        CancellationToken ct = default);

    Task<IReadOnlyList<OutpatientVisitItemDto>> GetOutpatientVisitsAsync(
        DateTime startDate,
        DateTime endDate,
        string? groupBy,
        CancellationToken ct = default);
}
