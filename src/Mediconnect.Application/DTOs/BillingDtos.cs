using Mediconnect.Domain.Entities;

namespace Mediconnect.Application.DTOs;

/// <summary>
/// Yêu cầu tạo phiếu thu tổng cho một lần khám, tự động gom chi phí khám + xét nghiệm + thuốc.
/// </summary>
public class GenerateInvoiceRequestDto
{
    public Guid OutpatientVisitId { get; set; }

    /// <summary>Dịch vụ khám dùng để tính phí khám (tùy chọn).</summary>
    public Guid? ExamServiceId { get; set; }

    /// <summary>Mã thẻ BHYT, nếu không nhập sẽ lấy từ hồ sơ bệnh nhân.</summary>
    public string? InsuranceNumber { get; set; }
}

/// <summary>Yêu cầu tính lại mức khấu trừ bảo hiểm cho phiếu thu đã có.</summary>
public class InsuranceCalculationRequestDto
{
    public string? InsuranceNumber { get; set; }
}

/// <summary>Phiếu thu tổng kèm danh sách chi tiết từng khoản chi phí.</summary>
public class BillingInvoiceDetailDto
{
    public Guid Id { get; set; }
    public Guid PatientId { get; set; }
    public DateTime CreatedAt { get; set; }
    public InvoiceStatus Status { get; set; }
    public decimal Subtotal { get; set; }
    public decimal InsuranceDeduction { get; set; }
    public decimal TotalAmount { get; set; }
    public string? InsuranceNumber { get; set; }
    public List<BillingItemReadDto> Items { get; set; } = new();
}
