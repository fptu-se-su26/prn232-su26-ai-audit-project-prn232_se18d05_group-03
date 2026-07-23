using System.Security.Cryptography;
using System.Text;
using Mediconnect.Application.DTOs;
using Mediconnect.Application.Interfaces;
using Mediconnect.Domain.Entities;
using Microsoft.Extensions.Options;

namespace Mediconnect.Infrastructure.Payments;

/// <summary>
/// Tích hợp cổng thanh toán VNPay (theo chuẩn sandbox VNPay: sort tham số, ký HMACSHA512)
/// và mô phỏng luồng tạo link Momo (dựng URL redirect ký HMACSHA256 theo cùng nguyên lý,
/// đơn giản hóa vì phạm vi đồ án không gọi API tạo giao dịch thật của Momo).
/// </summary>
public class PaymentGatewayService : IPaymentGatewayService
{
    private readonly VnPaySettings _vnPaySettings;
    private readonly MomoSettings _momoSettings;

    public PaymentGatewayService(IOptions<VnPaySettings> vnPayOptions, IOptions<MomoSettings> momoOptions)
    {
        _vnPaySettings = vnPayOptions.Value;
        _momoSettings = momoOptions.Value;
    }

    public string CreateVnPayUrl(Payment payment, string clientIpAddress)
    {
        var vnpParams = new SortedDictionary<string, string>(StringComparer.Ordinal)
        {
            ["vnp_Version"] = "2.1.0",
            ["vnp_Command"] = "pay",
            ["vnp_TmnCode"] = _vnPaySettings.TmnCode,
            ["vnp_Amount"] = ((long)(payment.Amount * 100)).ToString(),
            ["vnp_CurrCode"] = "VND",
            ["vnp_TxnRef"] = payment.Id.ToString("N"),
            ["vnp_OrderInfo"] = $"Thanh toan hoa don {payment.BillingInvoiceId:N}",
            ["vnp_OrderType"] = "billpayment",
            ["vnp_Locale"] = "vn",
            ["vnp_ReturnUrl"] = _vnPaySettings.ReturnUrl,
            ["vnp_IpAddr"] = string.IsNullOrWhiteSpace(clientIpAddress) ? "127.0.0.1" : clientIpAddress,
            ["vnp_CreateDate"] = DateTime.UtcNow.AddHours(7).ToString("yyyyMMddHHmmss")
        };

        var query = BuildSignedQuery(vnpParams);
        var secureHash = ComputeHmacSha512(_vnPaySettings.HashSecret, query);
        return $"{_vnPaySettings.BaseUrl}?{query}&vnp_SecureHash={secureHash}";
    }

    public string CreateMomoUrl(Payment payment)
    {
        var amount = ((long)payment.Amount).ToString();
        var orderId = payment.Id.ToString("N");
        var requestId = Guid.NewGuid().ToString("N");
        const string orderInfo = "Thanh toan hoa don kham chua benh";
        const string requestType = "captureWallet";
        const string extraData = "";

        var rawData = "accessKey=" + _momoSettings.AccessKey +
                      "&amount=" + amount +
                      "&extraData=" + extraData +
                      "&ipnUrl=" + _momoSettings.NotifyUrl +
                      "&orderId=" + orderId +
                      "&orderInfo=" + orderInfo +
                      "&partnerCode=" + _momoSettings.PartnerCode +
                      "&redirectUrl=" + _momoSettings.ReturnUrl +
                      "&requestId=" + requestId +
                      "&requestType=" + requestType;

        var signature = ComputeHmacSha256(_momoSettings.SecretKey, rawData);

        // Mô phỏng payUrl trả về từ Momo (thực tế cần POST rawData lên _momoSettings.BaseUrl
        // và lấy payUrl từ response JSON; đơn giản hóa cho phạm vi đồ án).
        return $"{_momoSettings.BaseUrl}?partnerCode={_momoSettings.PartnerCode}&orderId={orderId}" +
               $"&requestId={requestId}&amount={amount}&signature={signature}";
    }

    public PaymentGatewayReturnResult ValidateVnPayReturn(IReadOnlyDictionary<string, string> queryParams)
    {
        if (!queryParams.TryGetValue("vnp_SecureHash", out var receivedHash) || string.IsNullOrWhiteSpace(receivedHash))
        {
            return new PaymentGatewayReturnResult { IsValidSignature = false, Message = "Missing vnp_SecureHash" };
        }

        var dataParams = new SortedDictionary<string, string>(StringComparer.Ordinal);
        foreach (var kv in queryParams)
        {
            if (kv.Key is "vnp_SecureHash" or "vnp_SecureHashType")
            {
                continue;
            }
            dataParams[kv.Key] = kv.Value;
        }

        var query = BuildSignedQuery(dataParams);
        var computedHash = ComputeHmacSha512(_vnPaySettings.HashSecret, query);

        var isValid = string.Equals(computedHash, receivedHash, StringComparison.OrdinalIgnoreCase);
        var isSuccess = isValid && queryParams.TryGetValue("vnp_ResponseCode", out var code) && code == "00";

        queryParams.TryGetValue("vnp_TxnRef", out var txnRef);
        queryParams.TryGetValue("vnp_TransactionNo", out var transactionNo);

        return new PaymentGatewayReturnResult
        {
            IsValidSignature = isValid,
            IsSuccess = isSuccess,
            TxnRef = txnRef,
            TransactionNo = transactionNo,
            Message = isValid ? (isSuccess ? "Payment success" : "Payment failed") : "Invalid signature"
        };
    }

    private static string BuildSignedQuery(SortedDictionary<string, string> sortedParams) =>
        string.Join("&", sortedParams.Select(kv => $"{kv.Key}={Uri.EscapeDataString(kv.Value)}"));

    private static string ComputeHmacSha512(string secret, string data)
    {
        using var hmac = new HMACSHA512(Encoding.UTF8.GetBytes(secret));
        var hashBytes = hmac.ComputeHash(Encoding.UTF8.GetBytes(data));
        return Convert.ToHexString(hashBytes).ToLowerInvariant();
    }

    private static string ComputeHmacSha256(string secret, string data)
    {
        using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(secret));
        var hashBytes = hmac.ComputeHash(Encoding.UTF8.GetBytes(data));
        return Convert.ToHexString(hashBytes).ToLowerInvariant();
    }
}
