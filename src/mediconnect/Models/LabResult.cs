using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Mediconnect.Models;

public class LabResult
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public Guid LabOrderId { get; set; }

    [ForeignKey(nameof(LabOrderId))]
    public LabOrder LabOrder { get; set; } = null!;

    [MaxLength(4000)]
    public string? ResultText { get; set; }

    [MaxLength(500)]
    public string? ResultFileUrl { get; set; }

    public DateTime? ResultedAt { get; set; }
}
