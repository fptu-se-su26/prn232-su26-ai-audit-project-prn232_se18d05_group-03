using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Mediconnect.Models;

public class DischargeSummary
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public Guid AdmissionId { get; set; }

    [ForeignKey(nameof(AdmissionId))]
    public InpatientAdmission Admission { get; set; } = null!;

    public DateTime DischargeDate { get; set; } = DateTime.UtcNow;

    [MaxLength(2000)]
    public string? Summary { get; set; }

    public decimal? TotalCost { get; set; }
}
