using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Mediconnect.Domain.Entities;

public class LabOrder
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public Guid OutpatientVisitId { get; set; }

    [ForeignKey(nameof(OutpatientVisitId))]
    public OutpatientVisit OutpatientVisit { get; set; } = null!;

    [Required]
    public Guid OrderedById { get; set; }

    [ForeignKey(nameof(OrderedById))]
    public StaffProfile OrderedBy { get; set; } = null!;

    [Required, MaxLength(200)]
    public string TestName { get; set; } = string.Empty;

    public LabOrderStatus Status { get; set; } = LabOrderStatus.Ordered;

    public DateTime OrderedAt { get; set; } = DateTime.UtcNow;

    [MaxLength(1000)]
    public string? Notes { get; set; }
}
