using Mediconnect.Domain.Entities;

namespace Mediconnect.Application.Interfaces;

public class OtpSendResult
{
    public bool Delivered { get; set; }
    public string Detail { get; set; } = string.Empty;
}

/// <summary>
/// Delivers a one-time-password to the recipient over a real channel.
/// Implementations should never throw on transport failure — return a failed
/// <see cref="OtpSendResult"/> so the caller can fall back to simulated mode.
/// </summary>
public interface IOtpSender
{
    /// <summary>True when the sender has enough configuration to actually deliver.</summary>
    bool IsConfigured { get; }

    Task<OtpSendResult> SendAsync(
        OtpChannel channel,
        string toEmail,
        string toName,
        string code,
        int expiryMinutes,
        CancellationToken cancellationToken = default);
}
