using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Mediconnect.Domain.Entities;

public class BillingItem
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public Guid BillingInvoiceId { get; set; }

    [ForeignKey(nameof(BillingInvoiceId))]
    public BillingInvoice BillingInvoice { get; set; } = null!;

    public BillingItemType ItemType { get; set; } = BillingItemType.Other;

    [Required, MaxLength(200)]
    public string Description { get; set; } = string.Empty;

    public int Quantity { get; set; } = 1;

    public decimal UnitPrice { get; set; }

    public decimal Amount { get; set; }
}
