using System.Net.Http.Json;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json.Serialization;
using Mediconnect.Application.DTOs;
using Mediconnect.Application.Interfaces;
using Mediconnect.Domain.Entities;
using Microsoft.Extensions.Options;

namespace Mediconnect.Infrastructure.Payments;

/// <summary>
/// Tích hợp cổng thanh toán VNPay (theo chuẩn sandbox VNPay: sort tham số, ký HMACSHA512)
/// và Momo v2 (POST tạo giao dịch lên gateway, lấy payUrl từ response, ký HMACSHA256).
/// </summary>
public class PaymentGatewayService : IPaymentGatewayService
{
    private readonly VnPaySettings _vnPaySettings;
    private readonly MomoSettings _momoSettings;
    private readonly HttpClient _httpClient;

    public PaymentGatewayService(
        IOptions<VnPaySettings> vnPayOptions,
        IOptions<MomoSettings> momoOptions,
        HttpClient httpClient)
    {
        _vnPaySettings = vnPayOptions.Value;
        _momoSettings = momoOptions.Value;
        _httpClient = httpClient;
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

    /// <summary>
    /// Tạo giao dịch Momo: POST payload đã ký lên gateway rồi lấy payUrl từ response.
    /// BaseUrl là API tạo giao dịch (chỉ nhận POST + JSON) chứ không phải trang thanh toán,
    /// nên không được redirect trình duyệt thẳng vào đó.
    /// </summary>
    public async Task<string> CreateMomoUrlAsync(Payment payment, CancellationToken cancellationToken = default)
    {
        var amount = (long)payment.Amount;
        var orderId = payment.Id.ToString("N");
        var requestId = Guid.NewGuid().ToString("N");
        const string orderInfo = "Thanh toan hoa don kham chua benh";
        const string requestType = "captureWallet";
        const string extraData = "";

        // Momo yêu cầu raw data ký theo đúng thứ tự alphabet dưới đây, không phải thứ tự trong body.
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

        var request = new MomoCreateRequest
        {
            PartnerCode = _momoSettings.PartnerCode,
            PartnerName = "MediConnect",
            StoreId = "MediConnect",
            RequestId = requestId,
            Amount = amount,
            OrderId = orderId,
            OrderInfo = orderInfo,
            RedirectUrl = _momoSettings.ReturnUrl,
            IpnUrl = _momoSettings.NotifyUrl,
            Lang = "vi",
            RequestType = requestType,
            AutoCapture = true,
            ExtraData = extraData,
            Signature = ComputeHmacSha256(_momoSettings.SecretKey, rawData),
        };

        var response = await _httpClient.PostAsJsonAsync(_momoSettings.BaseUrl, request, cancellationToken);
        var result = await response.Content.ReadFromJsonAsync<MomoCreateResponse>(cancellationToken);

        if (result is null || result.ResultCode != 0 || string.IsNullOrWhiteSpace(result.PayUrl))
        {
            throw new InvalidOperationException(
                $"Momo từ chối tạo giao dịch (resultCode={result?.ResultCode}): {result?.Message}");
        }

        return result.PayUrl;
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

    public PaymentGatewayReturnResult ValidateMomoReturn(IReadOnlyDictionary<string, string> queryParams)
    {
        if (!queryParams.TryGetValue("signature", out var receivedSignature) || string.IsNullOrWhiteSpace(receivedSignature))
        {
            return new PaymentGatewayReturnResult { IsValidSignature = false, Message = "Missing signature" };
        }

        string Get(string key) => queryParams.TryGetValue(key, out var value) ? value : string.Empty;

        // Thứ tự field khi ký callback khác với lúc tạo giao dịch — theo đúng tài liệu Momo v2.
        var rawData = "accessKey=" + _momoSettings.AccessKey +
                      "&amount=" + Get("amount") +
                      "&extraData=" + Get("extraData") +
                      "&message=" + Get("message") +
                      "&orderId=" + Get("orderId") +
                      "&orderInfo=" + Get("orderInfo") +
                      "&orderType=" + Get("orderType") +
                      "&partnerCode=" + Get("partnerCode") +
                      "&payType=" + Get("payType") +
                      "&requestId=" + Get("requestId") +
                      "&responseTime=" + Get("responseTime") +
                      "&resultCode=" + Get("resultCode") +
                      "&transId=" + Get("transId");

        var computedSignature = ComputeHmacSha256(_momoSettings.SecretKey, rawData);
        var isValid = string.Equals(computedSignature, receivedSignature, StringComparison.OrdinalIgnoreCase);
        var isSuccess = isValid && Get("resultCode") == "0";

        return new PaymentGatewayReturnResult
        {
            IsValidSignature = isValid,
            IsSuccess = isSuccess,
            TxnRef = Get("orderId"),
            TransactionNo = Get("transId"),
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

    private class MomoCreateRequest
    {
        [JsonPropertyName("partnerCode")] public string PartnerCode { get; set; } = string.Empty;
        [JsonPropertyName("partnerName")] public string PartnerName { get; set; } = string.Empty;
        [JsonPropertyName("storeId")] public string StoreId { get; set; } = string.Empty;
        [JsonPropertyName("requestId")] public string RequestId { get; set; } = string.Empty;
        [JsonPropertyName("amount")] public long Amount { get; set; }
        [JsonPropertyName("orderId")] public string OrderId { get; set; } = string.Empty;
        [JsonPropertyName("orderInfo")] public string OrderInfo { get; set; } = string.Empty;
        [JsonPropertyName("redirectUrl")] public string RedirectUrl { get; set; } = string.Empty;
        [JsonPropertyName("ipnUrl")] public string IpnUrl { get; set; } = string.Empty;
        [JsonPropertyName("lang")] public string Lang { get; set; } = "vi";
        [JsonPropertyName("requestType")] public string RequestType { get; set; } = string.Empty;
        [JsonPropertyName("autoCapture")] public bool AutoCapture { get; set; }
        [JsonPropertyName("extraData")] public string ExtraData { get; set; } = string.Empty;
        [JsonPropertyName("signature")] public string Signature { get; set; } = string.Empty;
    }

    private class MomoCreateResponse
    {
        [JsonPropertyName("resultCode")] public int ResultCode { get; set; }
        [JsonPropertyName("message")] public string? Message { get; set; }
        [JsonPropertyName("payUrl")] public string? PayUrl { get; set; }
    }
}
