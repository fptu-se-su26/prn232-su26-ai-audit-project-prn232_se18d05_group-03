using System.Security.Claims;
using Mediconnect.Application.DTOs;
using Mediconnect.Application.Interfaces;
using Mediconnect.Application.Mapping;
using Mediconnect.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Mediconnect.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/users")]
public class UsersController : ControllerBase
{
    private readonly ICrudService<UserAccount, UserAccountReadDto, UserAccountWriteDto> _crudService;
    private readonly IRepository<UserAccount> _repository;

    public UsersController(
        ICrudService<UserAccount, UserAccountReadDto, UserAccountWriteDto> crudService,
        IRepository<UserAccount> repository)
    {
        _crudService = crudService;
        _repository = repository;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<UserAccountReadDto>>> GetAll(CancellationToken cancellationToken)
    {
        var users = await _crudService.GetAllAsync(cancellationToken);
        return Ok(users);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<UserAccountReadDto>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var user = await _crudService.GetByIdAsync(id, cancellationToken);
        return user is null ? NotFound() : Ok(user);
    }

    [HttpPost]
    public async Task<ActionResult<UserAccountReadDto>> Create(UserAccountWriteDto dto, CancellationToken cancellationToken)
    {
        var created = await _crudService.CreateAsync(dto, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, UserAccountWriteDto dto, CancellationToken cancellationToken)
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

    [HttpGet("me")]
    public async Task<ActionResult<UserAccountReadDto>> GetMe(CancellationToken cancellationToken)
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdValue, out var userId))
        {
            return Unauthorized();
        }

        var user = await _repository.GetByIdAsync(userId, cancellationToken);
        if (user is null)
        {
            return NotFound();
        }

        return Ok(SimpleMapper.Map<UserAccount, UserAccountReadDto>(user));
    }

    [HttpPatch("{id:guid}/status")]
    public async Task<IActionResult> UpdateStatus(Guid id, UserStatusUpdateDto dto, CancellationToken cancellationToken)
    {
        var user = await _repository.GetByIdAsync(id, cancellationToken);
        if (user is null)
        {
            return NotFound();
        }

        user.IsActive = dto.IsActive;
        _repository.Update(user);
        await _repository.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    [HttpPatch("{id:guid}/role")]
    public async Task<IActionResult> UpdateRole(Guid id, RoleUpdateDto dto, CancellationToken cancellationToken)
    {
        var user = await _repository.GetByIdAsync(id, cancellationToken);
        if (user is null)
        {
            return NotFound();
        }

        user.Role = dto.Role;
        _repository.Update(user);
        await _repository.SaveChangesAsync(cancellationToken);
        return NoContent();
    }
}
