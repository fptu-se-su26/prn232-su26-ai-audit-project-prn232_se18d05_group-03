namespace Mediconnect.Infrastructure.Notifications;

/// <summary>
/// SMTP settings for delivering OTP emails. Works with any SMTP relay:
///   • Gmail (App Password): Host=smtp.gmail.com, Port=587, Username=&lt;your gmail&gt;,
///     Password=&lt;16-char app password&gt;
///   • SendGrid: Host=smtp.sendgrid.net, Port=587, Username="apikey",
///     Password=&lt;SendGrid API key&gt;
/// Bound from the "OtpEmail" configuration section.
/// </summary>
public class OtpEmailOptions
{
    public const string SectionName = "OtpEmail";

    public bool Enabled { get; set; }
    public string SmtpHost { get; set; } = string.Empty;
    public int SmtpPort { get; set; } = 587;
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string FromEmail { get; set; } = string.Empty;
    public string FromName { get; set; } = "MediConnect";

    public bool IsConfigured =>
        Enabled
        && !string.IsNullOrWhiteSpace(SmtpHost)
        && !string.IsNullOrWhiteSpace(Username)
        && !string.IsNullOrWhiteSpace(Password)
        && !string.IsNullOrWhiteSpace(FromEmail);
}
