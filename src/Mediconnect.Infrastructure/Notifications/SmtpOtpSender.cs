using MailKit.Net.Smtp;
using MailKit.Security;
using Mediconnect.Application.Interfaces;
using Mediconnect.Domain.Entities;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MimeKit;

namespace Mediconnect.Infrastructure.Notifications;

/// <summary>
/// Sends OTP codes by email over SMTP (Gmail App Password or SendGrid relay).
/// SMS is not supported by this sender — callers fall back to simulated delivery.
/// </summary>
public class SmtpOtpSender : IOtpSender
{
    private readonly OtpEmailOptions _options;
    private readonly ILogger<SmtpOtpSender> _logger;

    public SmtpOtpSender(IOptions<OtpEmailOptions> options, ILogger<SmtpOtpSender> logger)
    {
        _options = options.Value;
        _logger = logger;
    }

    public bool IsConfigured => _options.IsConfigured;

    public async Task<OtpSendResult> SendAsync(
        OtpChannel channel,
        string toEmail,
        string toName,
        string code,
        int expiryMinutes,
        CancellationToken cancellationToken = default)
    {
        if (channel != OtpChannel.Email)
        {
            return new OtpSendResult { Delivered = false, Detail = "Kênh SMS chưa được tích hợp — gửi mô phỏng." };
        }

        if (!_options.IsConfigured)
        {
            return new OtpSendResult { Delivered = false, Detail = "SMTP chưa cấu hình — gửi mô phỏng." };
        }

        if (string.IsNullOrWhiteSpace(toEmail))
        {
            return new OtpSendResult { Delivered = false, Detail = "Tài khoản không có email — gửi mô phỏng." };
        }

        try
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(_options.FromName, _options.FromEmail));
            message.To.Add(MailboxAddress.Parse(toEmail));
            message.Subject = "Mã OTP kích hoạt tài khoản MediConnect";
            message.Body = new BodyBuilder
            {
                HtmlBody =
                    $"<div style='font-family:Segoe UI,Arial,sans-serif'>" +
                    $"<p>Xin chào {System.Net.WebUtility.HtmlEncode(toName)},</p>" +
                    $"<p>Mã OTP kích hoạt tài khoản MediConnect của bạn là:</p>" +
                    $"<p style='font-size:28px;font-weight:bold;letter-spacing:6px'>{code}</p>" +
                    $"<p>Mã có hiệu lực trong {expiryMinutes} phút. Vui lòng không chia sẻ mã này cho bất kỳ ai.</p>" +
                    $"</div>",
                TextBody = $"Mã OTP MediConnect: {code} (hiệu lực {expiryMinutes} phút).",
            }.ToMessageBody();

            using var client = new SmtpClient();
            // Port 465 → implicit SSL; otherwise STARTTLS (587).
            var secureOption = _options.SmtpPort == 465
                ? SecureSocketOptions.SslOnConnect
                : SecureSocketOptions.StartTls;

            await client.ConnectAsync(_options.SmtpHost, _options.SmtpPort, secureOption, cancellationToken);
            await client.AuthenticateAsync(_options.Username, _options.Password, cancellationToken);
            await client.SendAsync(message, cancellationToken);
            await client.DisconnectAsync(true, cancellationToken);

            return new OtpSendResult { Delivered = true, Detail = $"Đã gửi mã tới {toEmail}." };
        }
        catch (Exception ex)
        {
            // Never block the issue flow on a transport error — fall back to simulated.
            _logger.LogError(ex, "Failed to send OTP email to {Email}", toEmail);
            return new OtpSendResult { Delivered = false, Detail = $"Gửi email thất bại ({ex.Message}) — hiển thị mã mô phỏng." };
        }
    }
}
