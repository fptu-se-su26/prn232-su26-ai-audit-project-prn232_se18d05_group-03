using Mediconnect.Application.DTOs;
using Mediconnect.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Mediconnect.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/queue")]
public class SmartQueueController : ControllerBase
{
    private readonly IQueueService _queueService;

    public SmartQueueController(IQueueService queueService)
    {
        _queueService = queueService;
    }

    /// <summary>
    /// Tiếp nhận bệnh nhân và phát số thứ tự tự động, phân luồng vào phòng khám.
    /// </summary>
    [HttpPost("check-in")]
    public async Task<ActionResult<QueueTicketDetailDto>> CheckIn(
        [FromBody] CheckInRequestDto dto,
        CancellationToken cancellationToken)
    {
        try
        {
            var result = await _queueService.CheckInAsync(dto, cancellationToken);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Xem danh sách hàng đợi hiện tại của một phòng khám trong ngày.
    /// </summary>
    [HttpGet("clinics/{clinicId:guid}")]
    public async Task<ActionResult<ClinicQueueDto>> GetClinicQueue(
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
    /// Bác sĩ gọi bệnh nhân tiếp theo vào khám. Tự động hoàn tất số đang khám và chuyển sang số tiếp theo.
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
                return Ok(new { message = "No more patients waiting.", ticket = (object?)null });
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}
