using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Mediconnect.Models;

public class BillingInvoice
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public Guid PatientId { get; set; }

    [ForeignKey(nameof(PatientId))]
    public PatientProfile Patient { get; set; } = null!;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public InvoiceStatus Status { get; set; } = InvoiceStatus.Draft;

    public decimal Subtotal { get; set; }

    public decimal InsuranceDeduction { get; set; }

    public decimal TotalAmount { get; set; }

    [MaxLength(50)]
    public string? InsuranceNumber { get; set; }
}
