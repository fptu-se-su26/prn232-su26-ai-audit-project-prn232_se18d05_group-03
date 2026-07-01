using System.ComponentModel.DataAnnotations;

namespace Mediconnect.Domain.Entities;

/// <summary>
/// A single issued one-time-password (Screen 4.2). Delivery is simulated in this
/// project (no live Email/SMS provider is configured), so the generated code is
/// surfaced to the admin console for demonstration and verification.
/// </summary>
public class OtpCode
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public Guid UserAccountId { get; set; }

    [Required, MaxLength(12)]
    public string Code { get; set; } = string.Empty;

    public OtpChannel Channel { get; set; } = OtpChannel.Email;

    [MaxLength(100)]
    public string Purpose { get; set; } = "AccountActivation";

    public OtpStatus Status { get; set; } = OtpStatus.Pending;

    // True when actually delivered over a real channel (SMTP); false = simulated.
    public bool Delivered { get; set; }

    public int AttemptCount { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime ExpiresAt { get; set; }

    public DateTime? ConsumedAt { get; set; }
}
