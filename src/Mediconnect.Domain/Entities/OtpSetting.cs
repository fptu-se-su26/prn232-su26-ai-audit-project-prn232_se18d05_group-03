using System.ComponentModel.DataAnnotations;

namespace Mediconnect.Domain.Entities;

/// <summary>
/// System-wide OTP policy (Screen 4.2). A single configuration row governs how
/// activation OTPs are generated and delivered.
/// </summary>
public class OtpSetting
{
    [Key]
    public Guid Id { get; set; }

    public bool IsEnabled { get; set; } = true;

    public OtpChannel Channel { get; set; } = OtpChannel.Email;

    public int CodeLength { get; set; } = 6;

    public int ExpiryMinutes { get; set; } = 5;

    public int MaxAttempts { get; set; } = 5;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
