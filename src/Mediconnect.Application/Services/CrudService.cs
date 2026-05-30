using Mediconnect.Application.Interfaces;
using Mediconnect.Application.Mapping;

namespace Mediconnect.Application.Services;

public class CrudService<TEntity, TReadDto, TWriteDto> : ICrudService<TEntity, TReadDto, TWriteDto>
    where TEntity : class, new()
    where TReadDto : new()
{
    private readonly IRepository<TEntity> _repository;

    public CrudService(IRepository<TEntity> repository)
    {
        _repository = repository;
    }

    public async Task<IReadOnlyList<TReadDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var entities = await _repository.GetAllAsync(cancellationToken);
        return entities.Select(entity => SimpleMapper.Map<TEntity, TReadDto>(entity)).ToList();
    }

    public async Task<TReadDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await _repository.GetByIdAsync(id, cancellationToken);
        return entity is null ? default : SimpleMapper.Map<TEntity, TReadDto>(entity);
    }

    public async Task<TReadDto> CreateAsync(TWriteDto dto, CancellationToken cancellationToken = default)
    {
        var entity = SimpleMapper.Map<TWriteDto, TEntity>(dto);
        await _repository.AddAsync(entity, cancellationToken);
        await _repository.SaveChangesAsync(cancellationToken);
        return SimpleMapper.Map<TEntity, TReadDto>(entity);
    }

    public async Task<bool> UpdateAsync(Guid id, TWriteDto dto, CancellationToken cancellationToken = default)
    {
        var entity = await _repository.GetByIdAsync(id, cancellationToken);
        if (entity is null)
        {
            return false;
        }

        SimpleMapper.MapTo(dto, entity, "Id");
        _repository.Update(entity);
        await _repository.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await _repository.GetByIdAsync(id, cancellationToken);
        if (entity is null)
        {
            return false;
        }

        _repository.Remove(entity);
        await _repository.SaveChangesAsync(cancellationToken);
        return true;
    }
}
