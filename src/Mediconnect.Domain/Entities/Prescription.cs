using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Mediconnect.Domain.Entities;

public class Prescription
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public Guid OutpatientVisitId { get; set; }

    [ForeignKey(nameof(OutpatientVisitId))]
    public OutpatientVisit OutpatientVisit { get; set; } = null!;

    [Required]
    public Guid DoctorId { get; set; }

    [ForeignKey(nameof(DoctorId))]
    public StaffProfile Doctor { get; set; } = null!;

    public DateTime IssuedAt { get; set; } = DateTime.UtcNow;

    [MaxLength(1000)]
    public string? Notes { get; set; }
}
