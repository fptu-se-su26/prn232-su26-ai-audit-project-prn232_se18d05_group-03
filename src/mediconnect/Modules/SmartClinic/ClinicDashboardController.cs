using Mediconnect.Application.DTOs;
using Mediconnect.Application.Interfaces;
using Mediconnect.Application.Mapping;
using Mediconnect.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Mediconnect.Api.Modules.SmartClinic;

/// <summary>
/// Clinic Dashboard — Quản lý hàng đợi phòng khám theo thời gian thực.
/// Route: /api/clinic-dashboard
/// </summary>
[ApiController]
[Authorize]
[Route("api/clinic-dashboard")]
[Tags("Smart Clinic — Dashboard")]
public class ClinicDashboardController : ControllerBase
{
    private readonly IQueueService _queueService;

    public ClinicDashboardController(IQueueService queueService)
    {
        _queueService = queueService;
    }

    /// <summary>
    /// Lấy tổng quan hàng đợi tất cả phòng khám trong ngày hôm nay.
    /// Dùng cho màn hình tổng (overview) của lễ tân / y tá.
    /// </summary>
    [HttpGet("overview")]
    public async Task<ActionResult<IReadOnlyList<ClinicQueueSummaryDto>>> GetOverview(
        CancellationToken cancellationToken)
    {
        var result = await _queueService.GetAllClinicsQueueSummaryAsync(cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Lấy chi tiết hàng đợi (kèm tên bệnh nhân) của một phòng khám.
    /// </summary>
    [HttpGet("clinics/{clinicId:guid}/queue")]
    public async Task<ActionResult<ClinicQueueDto>> GetQueue(
        Guid clinicId,
        CancellationToken cancellationToken)
    {
        try
        {
            var result = await _queueService.GetClinicQueueAsync(clinicId, cancellationToken);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Tiếp nhận bệnh nhân vãng lai (không cần appointment) hoặc bệnh nhân có appointment.
    /// Tự động phát số thứ tự và phân luồng vào phòng khám.
    /// </summary>
    [HttpPost("check-in")]
    public async Task<ActionResult<QueueTicketDetailDto>> CheckIn(
        [FromBody] WalkInCheckInRequestDto dto,
        CancellationToken cancellationToken)
    {
        try
        {
            var result = await _queueService.WalkInCheckInAsync(dto, cancellationToken);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Bác sĩ / y tá gọi bệnh nhân tiếp theo vào khám.
    /// Tự động hoàn tất số đang khám và kích hoạt số tiếp theo.
    /// </summary>
    [HttpPost("clinics/{clinicId:guid}/call-next")]
    public async Task<ActionResult<QueueTicketDetailDto>> CallNext(
        Guid clinicId,
        CancellationToken cancellationToken)
    {
        try
        {
            var result = await _queueService.CallNextAsync(clinicId, cancellationToken);
            if (result is null)
                return Ok(new { message = "Không còn bệnh nhân đang chờ.", ticket = (object?)null });
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Chuyển vé số của bệnh nhân sang phòng khám khác (phân luồng lại).
    /// </summary>
    [HttpPatch("tickets/{ticketId:guid}/transfer")]
    public async Task<ActionResult<QueueTicketDetailDto>> TransferTicket(
        Guid ticketId,
        [FromBody] TransferTicketDto dto,
        CancellationToken cancellationToken)
    {
        try
        {
            var result = await _queueService.TransferTicketAsync(ticketId, dto.TargetClinicId, cancellationToken);
            if (result is null)
                return NotFound(new { message = "Không tìm thấy vé số." });
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
