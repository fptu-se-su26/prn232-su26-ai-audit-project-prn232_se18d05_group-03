namespace Mediconnect.Application.Interfaces;

public interface ICrudService<TEntity, TReadDto, TWriteDto>
    where TEntity : class
{
    Task<IReadOnlyList<TReadDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<TReadDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<TReadDto> CreateAsync(TWriteDto dto, CancellationToken cancellationToken = default);
    Task<bool> UpdateAsync(Guid id, TWriteDto dto, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
