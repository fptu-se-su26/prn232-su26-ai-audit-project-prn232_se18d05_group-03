using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Mediconnect.Domain.Entities;

public class PrescriptionItem
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public Guid PrescriptionId { get; set; }

    [ForeignKey(nameof(PrescriptionId))]
    public Prescription Prescription { get; set; } = null!;

    [Required]
    public Guid DrugId { get; set; }

    [ForeignKey(nameof(DrugId))]
    public Drug Drug { get; set; } = null!;

    [MaxLength(100)]
    public string? Dose { get; set; }

    [MaxLength(100)]
    public string? Frequency { get; set; }

    public int DurationDays { get; set; }

    public int Quantity { get; set; }
}
