using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Mediconnect.Models;

public class CareOrder
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public Guid AdmissionId { get; set; }

    [ForeignKey(nameof(AdmissionId))]
    public InpatientAdmission Admission { get; set; } = null!;

    [Required]
    public Guid OrderedById { get; set; }

    [ForeignKey(nameof(OrderedById))]
    public StaffProfile OrderedBy { get; set; } = null!;

    public CareOrderType OrderType { get; set; } = CareOrderType.Other;

    [Required, MaxLength(1000)]
    public string Description { get; set; } = string.Empty;

    public DateTime OrderedAt { get; set; } = DateTime.UtcNow;

    public bool IsCompleted { get; set; }

    public DateTime? CompletedAt { get; set; }
}
