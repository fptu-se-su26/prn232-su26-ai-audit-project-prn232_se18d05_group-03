namespace Mediconnect.Application.DTOs;

public class SummaryReportDto
{
    public decimal TotalRevenue { get; set; }
    public double BedOccupancyRate { get; set; }
    public int TotalOutpatientVisits { get; set; }
    public int ActiveInpatients { get; set; }
}

public class RevenueItemDto
{
    public string TimePeriod { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public decimal Revenue { get; set; }
}

public class BedOccupancyReportDto
{
    public int TotalBeds { get; set; }
    public int OccupiedBeds { get; set; }
    public int AvailableBeds { get; set; }
    public double OccupancyPercentage { get; set; }
    public IReadOnlyList<BedOccupancyByDepartmentDto> ByDepartmentBreakdown { get; set; } = [];
}

public class BedOccupancyByDepartmentDto
{
    public string Department { get; set; } = string.Empty;
    public int Total { get; set; }
    public int Occupied { get; set; }
    public double Percentage { get; set; }
}

public class OutpatientVisitItemDto
{
    public string TimePeriod { get; set; } = string.Empty;
    public int VisitCount { get; set; }
}
