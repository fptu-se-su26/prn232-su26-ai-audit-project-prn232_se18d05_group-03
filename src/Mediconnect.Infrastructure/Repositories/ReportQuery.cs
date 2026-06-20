using Mediconnect.Application.DTOs;
using Mediconnect.Application.Interfaces;
using Mediconnect.Domain.Entities;
using Mediconnect.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Mediconnect.Infrastructure.Repositories;

public class ReportQuery : IReportQuery
{
    private readonly AppDbContext _db;

    public ReportQuery(AppDbContext db) => _db = db;

    // ── 1. Summary ──────────────────────────────────────────────────────────

    public async Task<SummaryReportDto> GetSummaryAsync(string period, CancellationToken ct = default)
    {
        var (start, end) = ResolvePeriod(period);

        var totalRevenue = await _db.BillingInvoices
            .AsNoTracking()
            .Where(b => b.Status == InvoiceStatus.Paid
                     && b.CreatedAt >= start && b.CreatedAt <= end)
            .SumAsync(b => (decimal?)b.TotalAmount, ct) ?? 0m;

        var totalBeds    = await _db.Beds.AsNoTracking().CountAsync(ct);
        var occupiedBeds = await _db.Beds.AsNoTracking()
            .CountAsync(b => b.Status == BedStatus.Occupied, ct);

        var bedRate = totalBeds > 0
            ? Math.Round((double)occupiedBeds / totalBeds * 100, 1)
            : 0d;

        var outpatientVisits = await _db.OutpatientVisits
            .AsNoTracking()
            .CountAsync(v => v.VisitDate >= start && v.VisitDate <= end, ct);

        var activeInpatients = await _db.InpatientAdmissions
            .AsNoTracking()
            .CountAsync(a => a.Status == AdmissionStatus.Active, ct);

        return new SummaryReportDto
        {
            TotalRevenue          = totalRevenue,
            BedOccupancyRate      = bedRate,
            TotalOutpatientVisits = outpatientVisits,
            ActiveInpatients      = activeInpatients,
        };
    }

    // ── 2. Revenue ───────────────────────────────────────────────────────────

    public async Task<IReadOnlyList<RevenueItemDto>> GetRevenueAsync(
        DateTime? startDate, DateTime? endDate,
        string? groupBy, string? department,
        CancellationToken ct = default)
    {
        var groupByMonth = string.Equals(groupBy, "month", StringComparison.OrdinalIgnoreCase);

        // Base invoice query (only paid invoices count as revenue)
        IQueryable<BillingInvoice> invoiceQuery = _db.BillingInvoices
            .AsNoTracking()
            .Where(b => b.Status == InvoiceStatus.Paid);

        if (startDate.HasValue) invoiceQuery = invoiceQuery.Where(b => b.CreatedAt >= startDate.Value.Date);
        // Treat endDate as inclusive of the whole day (callers pass a date, not a timestamp).
        if (endDate.HasValue)
        {
            var endInclusive = endDate.Value.Date.AddDays(1).AddTicks(-1);
            invoiceQuery = invoiceQuery.Where(b => b.CreatedAt <= endInclusive);
        }

        // If filtering by department, restrict to patients admitted to that department
        if (!string.IsNullOrWhiteSpace(department))
        {
            var patientIds = _db.InpatientAdmissions
                .AsNoTracking()
                .Where(a => a.Department.Name == department)
                .Select(a => a.PatientId)
                .Distinct();

            invoiceQuery = invoiceQuery.Where(b => patientIds.Contains(b.PatientId));
        }

        // Pull minimal columns into memory to allow flexible in-memory grouping
        var invoices = await invoiceQuery
            .Select(b => new { b.CreatedAt, b.TotalAmount, b.PatientId })
            .ToListAsync(ct);

        if (invoices.Count == 0)
            return [];

        // Resolve department name for each unique patient via latest InpatientAdmission
        var patientIdList = invoices.Select(b => b.PatientId).Distinct().ToList();

        var deptByPatient = await _db.InpatientAdmissions
            .AsNoTracking()
            .Where(a => patientIdList.Contains(a.PatientId))
            .OrderByDescending(a => a.AdmissionDate)   // most-recent admission wins
            .Select(a => new { a.PatientId, DeptName = a.Department.Name })
            .ToListAsync(ct);

        // Keep most-recent admission's department per patient
        var deptLookup = deptByPatient
            .GroupBy(x => x.PatientId)
            .ToDictionary(g => g.Key, g => g.First().DeptName);

        // Group in memory by time period + department
        var result = invoices
            .Select(b => new
            {
                b.CreatedAt,
                b.TotalAmount,
                DeptName = deptLookup.TryGetValue(b.PatientId, out var d) ? d : "General",
            })
            .GroupBy(x => new
            {
                Period = groupByMonth
                    ? new DateTime(x.CreatedAt.Year, x.CreatedAt.Month, 1)
                    : x.CreatedAt.Date,
                x.DeptName,
            })
            .OrderBy(g => g.Key.Period).ThenBy(g => g.Key.DeptName)
            .Select(g => new RevenueItemDto
            {
                TimePeriod = groupByMonth
                    ? g.Key.Period.ToString("yyyy-MM")
                    : g.Key.Period.ToString("yyyy-MM-dd"),
                Department = g.Key.DeptName,
                Revenue    = g.Sum(x => x.TotalAmount),
            })
            .ToList();

        return result;
    }

    // ── 3. Bed Occupancy ─────────────────────────────────────────────────────

    public async Task<BedOccupancyReportDto> GetBedOccupancyAsync(
        string? department, CancellationToken ct = default)
    {
        IQueryable<Bed> bedQuery = _db.Beds.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(department))
            bedQuery = bedQuery.Where(b => b.Department.Name == department);

        // Server-side grouping: counts land in SQL as SUM(CASE WHEN ...)
        var byDept = await bedQuery
            .GroupBy(b => b.Department.Name)
            .Select(g => new
            {
                Department = g.Key,
                Total      = g.Count(),
                Occupied   = g.Count(b => b.Status == BedStatus.Occupied),
            })
            .ToListAsync(ct);

        var totalBeds    = byDept.Sum(x => x.Total);
        var occupiedBeds = byDept.Sum(x => x.Occupied);

        var breakdown = byDept
            .OrderBy(x => x.Department)
            .Select(x => new BedOccupancyByDepartmentDto
            {
                Department = x.Department,
                Total      = x.Total,
                Occupied   = x.Occupied,
                Percentage = x.Total > 0
                    ? Math.Round((double)x.Occupied / x.Total * 100, 1)
                    : 0d,
            })
            .ToList();

        return new BedOccupancyReportDto
        {
            TotalBeds            = totalBeds,
            OccupiedBeds         = occupiedBeds,
            AvailableBeds        = totalBeds - occupiedBeds,
            OccupancyPercentage  = totalBeds > 0
                ? Math.Round((double)occupiedBeds / totalBeds * 100, 1)
                : 0d,
            ByDepartmentBreakdown = breakdown,
        };
    }

    // ── 4. Outpatient Visits ─────────────────────────────────────────────────

    public async Task<IReadOnlyList<OutpatientVisitItemDto>> GetOutpatientVisitsAsync(
        DateTime startDate, DateTime endDate,
        string? groupBy,
        CancellationToken ct = default)
    {
        var groupByMonth = string.Equals(groupBy, "month", StringComparison.OrdinalIgnoreCase);

        // Treat endDate as inclusive of the whole day (callers pass a date, not a timestamp).
        var start = startDate.Date;
        var endInclusive = endDate.Date.AddDays(1).AddTicks(-1);

        // Pull only VisitDate column — avoids loading full entities
        var dates = await _db.OutpatientVisits
            .AsNoTracking()
            .Where(v => v.VisitDate >= start && v.VisitDate <= endInclusive)
            .Select(v => v.VisitDate)
            .ToListAsync(ct);

        var result = dates
            .GroupBy(d => groupByMonth
                ? new DateTime(d.Year, d.Month, 1)
                : d.Date)
            .OrderBy(g => g.Key)
            .Select(g => new OutpatientVisitItemDto
            {
                TimePeriod = groupByMonth
                    ? g.Key.ToString("yyyy-MM")
                    : g.Key.ToString("yyyy-MM-dd"),
                VisitCount = g.Count(),
            })
            .ToList();

        return result;
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private static (DateTime start, DateTime end) ResolvePeriod(string period)
    {
        var now = DateTime.UtcNow;

        if (string.Equals(period, "today", StringComparison.OrdinalIgnoreCase))
            return (now.Date, now.Date.AddDays(1).AddTicks(-1));

        // "this-month"
        var start = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);
        return (start, start.AddMonths(1).AddTicks(-1));
    }
}
