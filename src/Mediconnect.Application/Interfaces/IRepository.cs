namespace Mediconnect.Application.Interfaces;

public interface IRepository<TEntity> where TEntity : class
{
    Task<IReadOnlyList<TEntity>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<TEntity?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<TEntity?> FirstOrDefaultAsync(System.Linq.Expressions.Expression<Func<TEntity, bool>> predicate,
        CancellationToken cancellationToken = default);
    Task<IReadOnlyList<TEntity>> ListAsync(System.Linq.Expressions.Expression<Func<TEntity, bool>> predicate,
        CancellationToken cancellationToken = default);
    Task AddAsync(TEntity entity, CancellationToken cancellationToken = default);
    void Update(TEntity entity);
    void Remove(TEntity entity);
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
