using Mediconnect.Application.DTOs;
using Mediconnect.Application.Interfaces;
using Mediconnect.Application.Mapping;
using Mediconnect.Domain.Entities;

namespace Mediconnect.Application.Services;

public class UserAccountService : ICrudService<UserAccount, UserAccountReadDto, UserAccountWriteDto>
{
    private readonly IRepository<UserAccount> _repository;
    private readonly IPasswordHasher _passwordHasher;

    public UserAccountService(IRepository<UserAccount> repository, IPasswordHasher passwordHasher)
    {
        _repository = repository;
        _passwordHasher = passwordHasher;
    }

    public async Task<IReadOnlyList<UserAccountReadDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var users = await _repository.GetAllAsync(cancellationToken);
        return users.Select(user => SimpleMapper.Map<UserAccount, UserAccountReadDto>(user)).ToList();
    }

    public async Task<UserAccountReadDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var user = await _repository.GetByIdAsync(id, cancellationToken);
        return user is null ? null : SimpleMapper.Map<UserAccount, UserAccountReadDto>(user);
    }

    public async Task<UserAccountReadDto> CreateAsync(UserAccountWriteDto dto, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(dto.Password))
        {
            throw new InvalidOperationException("Password is required for new accounts.");
        }

        var user = new UserAccount
        {
            FullName = dto.FullName,
            Email = dto.Email,
            PhoneNumber = dto.PhoneNumber,
            Role = dto.Role,
            IsActive = dto.IsActive,
            PasswordHash = _passwordHasher.Hash(dto.Password)
        };

        await _repository.AddAsync(user, cancellationToken);
        await _repository.SaveChangesAsync(cancellationToken);

        return SimpleMapper.Map<UserAccount, UserAccountReadDto>(user);
    }

    public async Task<bool> UpdateAsync(Guid id, UserAccountWriteDto dto, CancellationToken cancellationToken = default)
    {
        var user = await _repository.GetByIdAsync(id, cancellationToken);
        if (user is null)
        {
            return false;
        }

        user.FullName = dto.FullName;
        user.Email = dto.Email;
        user.PhoneNumber = dto.PhoneNumber;
        user.Role = dto.Role;
        user.IsActive = dto.IsActive;

        if (!string.IsNullOrWhiteSpace(dto.Password))
        {
            user.PasswordHash = _passwordHasher.Hash(dto.Password);
        }

        _repository.Update(user);
        await _repository.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var user = await _repository.GetByIdAsync(id, cancellationToken);
        if (user is null)
        {
            return false;
        }

        _repository.Remove(user);
        await _repository.SaveChangesAsync(cancellationToken);
        return true;
    }
}
