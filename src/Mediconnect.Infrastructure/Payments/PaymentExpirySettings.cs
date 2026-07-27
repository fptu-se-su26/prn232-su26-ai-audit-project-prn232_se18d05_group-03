namespace Mediconnect.Infrastructure.Payments;

/// <summary>How long a VNPay/Momo payment may sit unconfirmed before it's auto-cancelled.</summary>
public class PaymentExpirySettings
{
    public int PendingTimeoutMinutes { get; set; } = 15;
}
