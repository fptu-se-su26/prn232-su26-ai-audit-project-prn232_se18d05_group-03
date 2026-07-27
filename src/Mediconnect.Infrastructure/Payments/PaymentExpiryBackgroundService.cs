using Mediconnect.Application.Interfaces;
using Mediconnect.Domain.Entities;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Mediconnect.Infrastructure.Payments;

/// <summary>
/// A VNPay/Momo payment that never comes back (user closes the tab, abandons the QR code)
/// would otherwise sit "Đang xử lý" forever. This periodically cancels Payments still Pending
/// past the configured timeout — the parent invoice stays unpaid so the patient can retry.
/// </summary>
public class PaymentExpiryBackgroundService : BackgroundService
{
    private static readonly TimeSpan PollInterval = TimeSpan.FromMinutes(1);

    private readonly IServiceScopeFactory _scopeFactory;
    private readonly PaymentExpirySettings _settings;
    private readonly ILogger<PaymentExpiryBackgroundService> _logger;

    public PaymentExpiryBackgroundService(
        IServiceScopeFactory scopeFactory,
        IOptions<PaymentExpirySettings> settings,
        ILogger<PaymentExpiryBackgroundService> logger)
    {
        _scopeFactory = scopeFactory;
        _settings = settings.Value;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        using var timer = new PeriodicTimer(PollInterval);
        try
        {
            do
            {
                try
                {
                    await ExpireStalePaymentsAsync(stoppingToken);
                }
                catch (Exception ex) when (ex is not OperationCanceledException)
                {
                    _logger.LogError(ex, "Payment expiry sweep failed.");
                }
            }
            while (await timer.WaitForNextTickAsync(stoppingToken));
        }
        catch (OperationCanceledException)
        {
            // Normal shutdown — stoppingToken was cancelled while awaiting the next tick.
        }
    }

    private async Task ExpireStalePaymentsAsync(CancellationToken cancellationToken)
    {
        using var scope = _scopeFactory.CreateScope();
        var paymentRepository = scope.ServiceProvider.GetRequiredService<IRepository<Payment>>();

        var cutoff = DateTime.UtcNow.AddMinutes(-_settings.PendingTimeoutMinutes);
        var stale = await paymentRepository.ListAsync(
            p => p.Status == PaymentStatus.Pending && p.CreatedAt < cutoff,
            cancellationToken);

        if (stale.Count == 0)
        {
            return;
        }

        foreach (var payment in stale)
        {
            payment.Status = PaymentStatus.Cancelled;
            paymentRepository.Update(payment);
        }

        await paymentRepository.SaveChangesAsync(cancellationToken);
        _logger.LogInformation("Cancelled {Count} payment(s) pending past {Minutes} minutes.", stale.Count, _settings.PendingTimeoutMinutes);
    }
}
