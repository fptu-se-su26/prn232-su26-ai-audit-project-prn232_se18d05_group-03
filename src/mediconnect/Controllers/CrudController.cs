using Mediconnect.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Mediconnect.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public abstract class CrudController<TEntity, TReadDto, TWriteDto> : ControllerBase
    where TEntity : class
{
    private readonly ICrudService<TEntity, TReadDto, TWriteDto> _service;

    protected CrudController(ICrudService<TEntity, TReadDto, TWriteDto> service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<TReadDto>>> GetAll(CancellationToken cancellationToken)
    {
        var items = await _service.GetAllAsync(cancellationToken);
        return Ok(items);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<TReadDto>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var item = await _service.GetByIdAsync(id, cancellationToken);
        return item is null ? NotFound() : Ok(item);
    }

    [HttpPost]
    public async Task<ActionResult<TReadDto>> Create([FromBody] TWriteDto dto, CancellationToken cancellationToken)
    {
        var created = await _service.CreateAsync(dto, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = GetId(created) }, created);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] TWriteDto dto, CancellationToken cancellationToken)
    {
        var updated = await _service.UpdateAsync(id, dto, cancellationToken);
        return updated ? NoContent() : NotFound();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await _service.DeleteAsync(id, cancellationToken);
        return deleted ? NoContent() : NotFound();
    }

    private static Guid GetId(TReadDto dto)
    {
        var idProperty = typeof(TReadDto).GetProperty("Id");
        if (idProperty?.GetValue(dto) is Guid id)
        {
            return id;
        }

        return Guid.Empty;
    }
}
