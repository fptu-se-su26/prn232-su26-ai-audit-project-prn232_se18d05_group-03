using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Mediconnect.Domain.Entities;

public class Payment
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public Guid BillingInvoiceId { get; set; }

    [ForeignKey(nameof(BillingInvoiceId))]
    public BillingInvoice BillingInvoice { get; set; } = null!;

    public PaymentMethod Method { get; set; } = PaymentMethod.Cash;

    public decimal Amount { get; set; }

    public DateTime? PaidAt { get; set; }

    public PaymentStatus Status { get; set; } = PaymentStatus.Pending;

    [MaxLength(100)]
    public string? TransactionRef { get; set; }
}
