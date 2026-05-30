using Mediconnect.Application.Interfaces;
using Mediconnect.Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace Mediconnect.Infrastructure.Auth;

public class PasswordHasherService : IPasswordHasher
{
    private readonly PasswordHasher<UserAccount> _hasher = new();

    public string Hash(string password)
    {
        return _hasher.HashPassword(new UserAccount(), password);
    }

    public bool Verify(string hashedPassword, string providedPassword)
    {
        var result = _hasher.VerifyHashedPassword(new UserAccount(), hashedPassword, providedPassword);
        return result == PasswordVerificationResult.Success;
    }
}
