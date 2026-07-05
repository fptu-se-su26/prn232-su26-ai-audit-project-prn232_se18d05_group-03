using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Mediconnect.Domain.Entities;

public class TelemedicineSession
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public Guid AppointmentId { get; set; }

    [ForeignKey(nameof(AppointmentId))]
    public Appointment Appointment { get; set; } = null!;

    [Required]
    public Guid DoctorId { get; set; }

    [ForeignKey(nameof(DoctorId))]
    public StaffProfile Doctor { get; set; } = null!;

    [Required]
    public Guid PatientId { get; set; }

    [ForeignKey(nameof(PatientId))]
    public PatientProfile Patient { get; set; } = null!;

    public DateTime? StartedAt { get; set; }

    public DateTime? EndedAt { get; set; }

    [MaxLength(500)]
    public string? VideoCallUrl { get; set; }

    [MaxLength(2000)]
    public string? Notes { get; set; }
}
