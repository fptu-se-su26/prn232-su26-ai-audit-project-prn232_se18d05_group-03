using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Mediconnect.Domain.Entities;

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

    /// <summary>Bệnh nhân gắn với vé (kể cả vãng lai, được resolve/tạo lúc check-in).</summary>
    public Guid? PatientId { get; set; }

    [ForeignKey(nameof(PatientId))]
    public PatientProfile? Patient { get; set; }

    /// <summary>Snapshot tên bệnh nhân tại thời điểm check-in — tránh phải resolve lại qua Appointment.</summary>
    public string? PatientName { get; set; }
}
