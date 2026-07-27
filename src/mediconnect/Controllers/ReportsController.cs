using Mediconnect.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Mediconnect.Api.Controllers;

[ApiController]
[Authorize(Roles = "Admin")]
[Route("api/reports")]
public class ReportsController : ControllerBase
{
    private readonly IReportQuery _reports;

    public ReportsController(IReportQuery reports) => _reports = reports;

    /// <summary>Top-level KPI summary for today or this month.</summary>
    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary(
        [FromQuery] string period = "today",
        CancellationToken ct = default)
    {
        if (!new[] { "today", "this-month" }.Contains(period, StringComparer.OrdinalIgnoreCase))
            return BadRequest(new { message = "period must be 'today' or 'this-month'" });

        var result = await _reports.GetSummaryAsync(period, ct);
        return Ok(result);
    }

    /// <summary>Aggregated revenue by time period and department (for bar/line charts).</summary>
    [HttpGet("revenue")]
    public async Task<IActionResult> GetRevenue(
        [FromQuery] DateTime? startDate,
        [FromQuery] DateTime? endDate,
        [FromQuery] string? groupBy = "day",
        [FromQuery] string? department = null,
        CancellationToken ct = default)
    {
        if (startDate.HasValue && endDate.HasValue && startDate > endDate)
            return BadRequest(new { message = "startDate must not be after endDate" });

        if (groupBy is not null &&
            !new[] { "day", "month" }.Contains(groupBy, StringComparer.OrdinalIgnoreCase))
            return BadRequest(new { message = "groupBy must be 'day' or 'month'" });

        var result = await _reports.GetRevenueAsync(startDate, endDate, groupBy, department, ct);
        return Ok(result);
    }

    /// <summary>Inpatient bed utilisation, optionally scoped to one department.</summary>
    [HttpGet("bed-occupancy")]
    public async Task<IActionResult> GetBedOccupancy(
        [FromQuery] string? department = null,
        CancellationToken ct = default)
    {
        var result = await _reports.GetBedOccupancyAsync(department, ct);
        return Ok(result);
    }

    /// <summary>Outpatient visit volume over a date range, grouped by day or month.</summary>
    [HttpGet("outpatient-visits")]
    public async Task<IActionResult> GetOutpatientVisits(
        [FromQuery] DateTime startDate,
        [FromQuery] DateTime endDate,
        [FromQuery] string? groupBy = "day",
        CancellationToken ct = default)
    {
        if (startDate > endDate)
            return BadRequest(new { message = "startDate must not be after endDate" });

        if (groupBy is not null &&
            !new[] { "day", "month" }.Contains(groupBy, StringComparer.OrdinalIgnoreCase))
            return BadRequest(new { message = "groupBy must be 'day' or 'month'" });

        var result = await _reports.GetOutpatientVisitsAsync(startDate, endDate, groupBy, ct);
        return Ok(result);
    }
}
