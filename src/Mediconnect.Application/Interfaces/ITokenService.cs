using Mediconnect.Domain.Entities;

namespace Mediconnect.Application.Interfaces;

public interface ITokenService
{
    (string Token, DateTime ExpiresAt) CreateToken(UserAccount user);
}
