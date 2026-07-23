using Mediconnect.Application.DTOs;
using Mediconnect.Application.Exceptions;
using Mediconnect.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Mediconnect.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/schedules")]
public class ScheduleController : ControllerBase
{
    private readonly IStaffScheduleService _scheduleService;

    public ScheduleController(IStaffScheduleService scheduleService)
    {
        _scheduleService = scheduleService;
    }

    /// <summary>POST /api/schedules — Tạo mới ca trực với validation ràng buộc nghiệp vụ.</summary>
    [HttpPost]
    public async Task<ActionResult<ScheduleFlatReadDto>> Create(
        [FromBody] ScheduleWriteDto dto,
        CancellationToken cancellationToken)
    {
        try
        {
            var created = await _scheduleService.CreateAsync(dto, cancellationToken);
            return CreatedAtAction(nameof(GetAll), new { id = created.Id }, created);
        }
        catch (ScheduleValidationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>PUT /api/schedules/{id} — Cập nhật ca trực, kiểm tra ràng buộc trùng lịch.</summary>
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ScheduleFlatReadDto>> Update(
        Guid id,
        [FromBody] ScheduleWriteDto dto,
        CancellationToken cancellationToken)
    {
        try
        {
            var updated = await _scheduleService.UpdateAsync(id, dto, cancellationToken);
            return updated is null
                ? NotFound(new { message = "Schedule not found." })
                : Ok(updated);
        }
        catch (ScheduleValidationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>DELETE /api/schedules/{id} — Xóa ca trực.</summary>
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await _scheduleService.DeleteAsync(id, cancellationToken);
        return deleted ? NoContent() : NotFound(new { message = "Schedule not found." });
    }

    /// <summary>GET /api/schedules/all — Toàn bộ lịch trực, không phân trang.</summary>
    [HttpGet("all")]
    public async Task<ActionResult<IReadOnlyList<ScheduleFlatReadDto>>> GetAll(CancellationToken cancellationToken)
    {
        var schedules = await _scheduleService.GetAllAsync(cancellationToken);
        return Ok(schedules);
    }

    /// <summary>
    /// GET /api/schedules — Danh sách lịch trực nâng cao (có phân trang + bộ lọc LINQ).
    /// Query params: startDate, endDate, currentWeek, departmentId, page, pageSize.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<PagedResult<ScheduleFlatReadDto>>> Filter(
        [FromQuery] ScheduleFilterQuery query,
        CancellationToken cancellationToken)
    {
        var result = await _scheduleService.FilterAsync(query, cancellationToken);
        return Ok(result);
    }
}
