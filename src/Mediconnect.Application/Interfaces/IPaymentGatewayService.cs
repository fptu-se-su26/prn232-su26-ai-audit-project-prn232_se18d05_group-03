using Mediconnect.Application.DTOs;
using Mediconnect.Domain.Entities;

namespace Mediconnect.Application.Interfaces;

public interface IPaymentGatewayService
{
    string CreateVnPayUrl(Payment payment, string clientIpAddress);

    Task<string> CreateMomoUrlAsync(Payment payment, CancellationToken cancellationToken = default);

    PaymentGatewayReturnResult ValidateVnPayReturn(IReadOnlyDictionary<string, string> queryParams);

    PaymentGatewayReturnResult ValidateMomoReturn(IReadOnlyDictionary<string, string> queryParams);
}
