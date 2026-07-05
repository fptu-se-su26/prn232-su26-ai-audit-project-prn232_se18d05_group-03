using Mediconnect.Application.DTOs;

namespace Mediconnect.Application.Interfaces;

public interface IBillingService
{
    Task<BillingInvoiceDetailDto> GenerateInvoiceAsync(GenerateInvoiceRequestDto dto, CancellationToken cancellationToken = default);

    Task<BillingInvoiceDetailDto> CalculateInsuranceAsync(Guid invoiceId, string? insuranceNumber, CancellationToken cancellationToken = default);
}
