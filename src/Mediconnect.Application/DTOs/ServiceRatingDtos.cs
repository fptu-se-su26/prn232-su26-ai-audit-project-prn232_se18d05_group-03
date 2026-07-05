using System.ComponentModel.DataAnnotations;

namespace Mediconnect.Application.DTOs;

public class ServiceRatingReadDto
{
    public Guid Id { get; set; }
    public Guid PatientId { get; set; }
    public Guid DoctorId { get; set; }
    public Guid OutpatientVisitId { get; set; }
    public int Score { get; set; }
    public string? Comment { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class ServiceRatingWriteDto
{
    public Guid PatientId { get; set; }
    public Guid DoctorId { get; set; }
    public Guid OutpatientVisitId { get; set; }

    [Range(1, 5)]
    public int Score { get; set; }

    public string? Comment { get; set; }
}

/// <summary>Tổng hợp điểm đánh giá trung bình của một bác sĩ.</summary>
public class DoctorRatingSummaryDto
{
    public Guid DoctorId { get; set; }
    public double AverageScore { get; set; }
    public int TotalRatings { get; set; }
}
