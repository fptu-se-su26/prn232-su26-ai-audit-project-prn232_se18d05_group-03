using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Mediconnect.Domain.Entities;

public class OutpatientVisit
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
    public Guid ClinicId { get; set; }

    [ForeignKey(nameof(ClinicId))]
    public Clinic Clinic { get; set; } = null!;

    public Guid? QueueTicketId { get; set; }

    [ForeignKey(nameof(QueueTicketId))]
    public QueueTicket? QueueTicket { get; set; }

    public DateTime VisitDate { get; set; } = DateTime.UtcNow;

    [MaxLength(1000)]
    public string? ChiefComplaint { get; set; }

    [MaxLength(20)]
    public string? DiagnosisCode { get; set; }

    [MaxLength(1000)]
    public string? DiagnosisDescription { get; set; }

    public VisitStatus Status { get; set; } = VisitStatus.Waiting;

    [MaxLength(2000)]
    public string? Notes { get; set; }
}
