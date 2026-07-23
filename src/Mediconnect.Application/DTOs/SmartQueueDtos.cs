using Mediconnect.Domain.Entities;

namespace Mediconnect.Application.DTOs;

public class CheckInRequestDto
{
    public Guid ClinicId { get; set; }
    public Guid? AppointmentId { get; set; }
}

public class QueueTicketDetailDto
{
    public Guid Id { get; set; }
    public Guid ClinicId { get; set; }
    public string ClinicName { get; set; } = string.Empty;
    public string? ClinicRoomNumber { get; set; }
    public Guid? AppointmentId { get; set; }
    public Guid? PatientId { get; set; }
    public string? PatientName { get; set; }
    public int Number { get; set; }
    public DateTime IssuedAt { get; set; }
    public QueueStatus Status { get; set; }
}

public class ClinicQueueDto
{
    public Guid ClinicId { get; set; }
    public string ClinicName { get; set; } = string.Empty;
    public string? RoomNumber { get; set; }
    public int WaitingCount { get; set; }
    public int? CurrentNumber { get; set; }
    public List<QueueTicketDetailDto> Tickets { get; set; } = new();
}

public class ClinicWithServicesDto
{
    public Guid Id { get; set; }
    public Guid DepartmentId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? RoomNumber { get; set; }
    public bool IsActive { get; set; }
    public List<MedicalServiceReadDto> Services { get; set; } = new();
}

public class PriceUpdateDto
{
    public decimal Price { get; set; }
}

/// <summary>
/// Tóm tắt trạng thái hàng đợi của một phòng khám, dùng cho trang Clinic Dashboard.
/// </summary>
public class ClinicQueueSummaryDto
{
    public Guid ClinicId { get; set; }
    public string ClinicName { get; set; } = string.Empty;
    public string? RoomNumber { get; set; }
    public bool IsActive { get; set; }
    public int WaitingCount { get; set; }
    public int InProgressCount { get; set; }
    public int? CurrentNumber { get; set; }
    public string? CurrentPatientName { get; set; }
}

/// <summary>
/// Yêu cầu chuyển vé số sang phòng khám khác.
/// </summary>
public class TransferTicketDto
{
    public Guid TargetClinicId { get; set; }
}

/// <summary>
/// Yêu cầu check-in mở rộng: hỗ trợ cả bệnh nhân vãng lai (không có appointment).
/// </summary>
public class WalkInCheckInRequestDto
{
    public Guid ClinicId { get; set; }
    public Guid? AppointmentId { get; set; }
    /// <summary>Tên bệnh nhân vãng lai (khi không có AppointmentId).</summary>
    public string? PatientName { get; set; }
    /// <summary>Email thật của bệnh nhân vãng lai — dùng để tạo/tái sử dụng tài khoản Patient.</summary>
    public string? PatientEmail { get; set; }
    /// <summary>SĐT bệnh nhân vãng lai (tùy chọn).</summary>
    public string? PatientPhone { get; set; }
}
