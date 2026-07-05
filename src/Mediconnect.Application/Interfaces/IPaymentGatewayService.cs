using Mediconnect.Application.DTOs;
using Mediconnect.Domain.Entities;

namespace Mediconnect.Application.Interfaces;

public interface IPaymentGatewayService
{
    string CreateVnPayUrl(Payment payment, string clientIpAddress);

    string CreateMomoUrl(Payment payment);

    PaymentGatewayReturnResult ValidateVnPayReturn(IReadOnlyDictionary<string, string> queryParams);
}
