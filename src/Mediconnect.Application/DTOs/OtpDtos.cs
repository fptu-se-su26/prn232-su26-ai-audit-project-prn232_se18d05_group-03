using Mediconnect.Domain.Entities;

namespace Mediconnect.Application.DTOs;

public class OtpSettingDto
{
    public bool IsEnabled { get; set; }
    public OtpChannel Channel { get; set; }
    public int CodeLength { get; set; }
    public int ExpiryMinutes { get; set; }
    public int MaxAttempts { get; set; }
    public DateTime UpdatedAt { get; set; }
    // True when a real SMTP sender is configured (so the UI stops showing raw codes).
    public bool EmailConfigured { get; set; }
}

public class OtpSettingWriteDto
{
    public bool IsEnabled { get; set; }
    public OtpChannel Channel { get; set; }
    public int CodeLength { get; set; }
    public int ExpiryMinutes { get; set; }
    public int MaxAttempts { get; set; }
}

public class OtpIssueRequestDto
{
    public Guid UserAccountId { get; set; }
    public string Purpose { get; set; } = "AccountActivation";
}

public class OtpVerifyRequestDto
{
    public Guid UserAccountId { get; set; }
    public string Code { get; set; } = string.Empty;
}

public class OtpVerifyResponseDto
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
}

public class OtpCodeDto
{
    public Guid Id { get; set; }
    public Guid UserAccountId { get; set; }
    public string UserFullName { get; set; } = string.Empty;
    public string UserEmail { get; set; } = string.Empty;
    // Delivery is simulated, so the raw code is exposed to the admin console.
    public string Code { get; set; } = string.Empty;
    public OtpChannel Channel { get; set; }
    public string Purpose { get; set; } = string.Empty;
    public OtpStatus Status { get; set; }
    public int AttemptCount { get; set; }
    public bool Delivered { get; set; }
    public string DeliveryDetail { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime ExpiresAt { get; set; }
    public DateTime? ConsumedAt { get; set; }
}
