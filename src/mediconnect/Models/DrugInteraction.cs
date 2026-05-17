using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Mediconnect.Models;

public class DrugInteraction
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public Guid DrugId { get; set; }

    [ForeignKey(nameof(DrugId))]
    public Drug Drug { get; set; } = null!;

    [Required]
    public Guid InteractingDrugId { get; set; }

    [ForeignKey(nameof(InteractingDrugId))]
    public Drug InteractingDrug { get; set; } = null!;

    [MaxLength(50)]
    public string? Severity { get; set; }

    [MaxLength(1000)]
    public string? Description { get; set; }
}
