using Mediconnect.Application.DTOs;
using Mediconnect.Application.Interfaces;
using Mediconnect.Application.Mapping;
using Mediconnect.Domain.Entities;

namespace Mediconnect.Application.Services;

public class AuthService : IAuthService
{
    private readonly IRepository<UserAccount> _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ITokenService _tokenService;

    public AuthService(
        IRepository<UserAccount> userRepository,
        IPasswordHasher passwordHasher,
        ITokenService tokenService)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _tokenService = tokenService;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request, CancellationToken cancellationToken = default)
    {
        var existingUser = await _userRepository.FirstOrDefaultAsync(u => u.Email == request.Email, cancellationToken);
        if (existingUser is not null)
        {
            throw new InvalidOperationException("Email is already registered.");
        }

        var user = new UserAccount
        {
            FullName = request.FullName,
            Email = request.Email,
            PhoneNumber = request.PhoneNumber,
            Role = request.Role,
            IsActive = true,
            PasswordHash = _passwordHasher.Hash(request.Password)
        };

        await _userRepository.AddAsync(user, cancellationToken);
        await _userRepository.SaveChangesAsync(cancellationToken);

        var (token, expiresAt) = _tokenService.CreateToken(user);
        var userDto = SimpleMapper.Map<UserAccount, UserAccountReadDto>(user);

        return new AuthResponseDto
        {
            AccessToken = token,
            ExpiresAt = expiresAt,
            User = userDto
        };
    }

    public async Task<AuthResponseDto?> LoginAsync(LoginRequestDto request, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.FirstOrDefaultAsync(u => u.Email == request.Email && u.IsActive, cancellationToken);
        if (user is null)
        {
            return null;
        }

        if (!_passwordHasher.Verify(user.PasswordHash, request.Password))
        {
            return null;
        }

        var (token, expiresAt) = _tokenService.CreateToken(user);
        var userDto = SimpleMapper.Map<UserAccount, UserAccountReadDto>(user);

        return new AuthResponseDto
        {
            AccessToken = token,
            ExpiresAt = expiresAt,
            User = userDto
        };
    }
}
