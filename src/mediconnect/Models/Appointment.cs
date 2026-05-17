using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Mediconnect.Models;

public class Appointment
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

    public DateTime AppointmentTime { get; set; }

    public AppointmentStatus Status { get; set; } = AppointmentStatus.Requested;

    [MaxLength(500)]
    public string? Reason { get; set; }

    [MaxLength(1000)]
    public string? Notes { get; set; }
}
