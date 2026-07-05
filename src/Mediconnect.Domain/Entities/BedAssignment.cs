using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Mediconnect.Domain.Entities;

public class BedAssignment
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public Guid AdmissionId { get; set; }

    [ForeignKey(nameof(AdmissionId))]
    public InpatientAdmission Admission { get; set; } = null!;

    [Required]
    public Guid BedId { get; set; }

    [ForeignKey(nameof(BedId))]
    public Bed Bed { get; set; } = null!;

    public DateTime AssignedAt { get; set; } = DateTime.UtcNow;

    public DateTime? ReleasedAt { get; set; }
}
