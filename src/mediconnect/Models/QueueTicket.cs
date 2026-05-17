using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Mediconnect.Models;

public class QueueTicket
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public Guid ClinicId { get; set; }

    [ForeignKey(nameof(ClinicId))]
    public Clinic Clinic { get; set; } = null!;

    public Guid? AppointmentId { get; set; }

    [ForeignKey(nameof(AppointmentId))]
    public Appointment? Appointment { get; set; }

    public int Number { get; set; }

    public DateTime IssuedAt { get; set; } = DateTime.UtcNow;

    public QueueStatus Status { get; set; } = QueueStatus.Waiting;
}
