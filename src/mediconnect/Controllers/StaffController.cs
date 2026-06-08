using Mediconnect.Application.DTOs;
using Mediconnect.Application.Exceptions;
using Mediconnect.Application.Interfaces;
using Mediconnect.Application.Mapping;
using Mediconnect.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Mediconnect.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/staff")]
public class StaffController : ControllerBase
{
    private readonly ICrudService<StaffProfile, StaffProfileReadDto, StaffProfileWriteDto> _crudService;
    private readonly IRepository<StaffSchedule> _scheduleRepository;
    private readonly IStaffScheduleService _scheduleService;

    public StaffController(
        ICrudService<StaffProfile, StaffProfileReadDto, StaffProfileWriteDto> crudService,
        IRepository<StaffSchedule> scheduleRepository,
        IStaffScheduleService scheduleService)
    {
        _crudService = crudService;
        _scheduleRepository = scheduleRepository;
        _scheduleService = scheduleService;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<StaffProfileReadDto>>> GetAll(CancellationToken cancellationToken)
    {
        var staff = await _crudService.GetAllAsync(cancellationToken);
        return Ok(staff);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<StaffProfileReadDto>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var staff = await _crudService.GetByIdAsync(id, cancellationToken);
        return staff is null ? NotFound() : Ok(staff);
    }

    [HttpPost]
    public async Task<ActionResult<StaffProfileReadDto>> Create(StaffProfileWriteDto dto, CancellationToken cancellationToken)
    {
        var created = await _crudService.CreateAsync(dto, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, StaffProfileWriteDto dto, CancellationToken cancellationToken)
    {
        var updated = await _crudService.UpdateAsync(id, dto, cancellationToken);
        return updated ? NoContent() : NotFound();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await _crudService.DeleteAsync(id, cancellationToken);
        return deleted ? NoContent() : NotFound();
    }

    [HttpGet("{id:guid}/schedules")]
    public async Task<ActionResult<IReadOnlyList<StaffScheduleReadDto>>> GetSchedules(
        Guid id,
        CancellationToken cancellationToken)
    {
        var schedules = await _scheduleRepository.ListAsync(s => s.StaffId == id, cancellationToken);
        var result = schedules.Select(SimpleMapper.Map<StaffSchedule, StaffScheduleReadDto>).ToList();
        return Ok(result);
    }

    [HttpPost("{id:guid}/schedules")]
    public async Task<ActionResult<ScheduleFlatReadDto>> CreateSchedule(
        Guid id,
        StaffScheduleWriteDto dto,
        CancellationToken cancellationToken)
    {
        dto.StaffId = id;
        try
        {
            var writeDto = new ScheduleWriteDto
            {
                StaffId = dto.StaffId,
                ShiftDate = dto.ShiftDate,
                ShiftType = dto.ShiftType,
                WorkRoom = dto.WorkRoom
            };
            var created = await _scheduleService.CreateAsync(writeDto, cancellationToken);
            return CreatedAtAction(nameof(GetSchedules), new { id }, created);
        }
        catch (ScheduleValidationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
