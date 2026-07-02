using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Mediconnect.Domain.Entities;

public class InpatientAdmission
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public Guid PatientId { get; set; }

    [ForeignKey(nameof(PatientId))]
    public PatientProfile Patient { get; set; } = null!;

    public Guid? FromOutpatientVisitId { get; set; }

    [ForeignKey(nameof(FromOutpatientVisitId))]
    public OutpatientVisit? FromOutpatientVisit { get; set; }

    [Required]
    public Guid DepartmentId { get; set; }

    [ForeignKey(nameof(DepartmentId))]
    public Department Department { get; set; } = null!;

    public DateTime AdmissionDate { get; set; } = DateTime.UtcNow;

    public AdmissionStatus Status { get; set; } = AdmissionStatus.Active;
}
