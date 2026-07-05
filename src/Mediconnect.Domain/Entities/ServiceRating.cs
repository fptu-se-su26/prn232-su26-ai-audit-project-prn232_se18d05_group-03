using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Mediconnect.Domain.Entities;

public class ServiceRating
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public Guid PatientId { get; set; }

    [ForeignKey(nameof(PatientId))]
    public PatientProfile Patient { get; set; } = null!;

    [Required]
    public Guid DoctorId { get; set; }

    [ForeignKey(nameof(DoctorId))]
    public StaffProfile Doctor { get; set; } = null!;

    [Required]
    public Guid OutpatientVisitId { get; set; }

    [ForeignKey(nameof(OutpatientVisitId))]
    public OutpatientVisit OutpatientVisit { get; set; } = null!;

    [Range(1, 5)]
    public int Score { get; set; }

    [MaxLength(1000)]
    public string? Comment { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
