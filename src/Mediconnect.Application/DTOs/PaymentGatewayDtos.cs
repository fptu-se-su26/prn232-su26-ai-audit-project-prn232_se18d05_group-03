namespace Mediconnect.Application.DTOs;

/// <summary>Kết quả tạo link thanh toán trực tuyến (VNPay/Momo) cho một Payment đã tồn tại.</summary>
public class PaymentUrlResultDto
{
    public Guid PaymentId { get; set; }
    public string PaymentUrl { get; set; } = string.Empty;
}

/// <summary>Kết quả xác thực callback trả về từ cổng thanh toán.</summary>
public class PaymentGatewayReturnResult
{
    public bool IsValidSignature { get; set; }
    public bool IsSuccess { get; set; }
    public string? TxnRef { get; set; }
    public string? TransactionNo { get; set; }
    public string? Message { get; set; }
}
