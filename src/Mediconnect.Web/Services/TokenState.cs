using Mediconnect.Application.DTOs;

namespace Mediconnect.Web.Services;

// Per-circuit holder for the signed-in user's JWT and profile.
// Persisted to the browser's localStorage by ApiAuthStateProvider so a page refresh (F5) keeps the user logged in.
public class TokenState
{
    public string? Token { get; private set; }
    public UserAccountReadDto? User { get; private set; }
    public DateTime? ExpiresAt { get; private set; }

    public bool IsAuthenticated => Token is not null && (ExpiresAt is null || ExpiresAt > DateTime.UtcNow);

    public void Set(AuthResponseDto auth)
    {
        Token = auth.AccessToken;
        User = auth.User;
        ExpiresAt = auth.ExpiresAt;
    }

    public void Restore(string token, UserAccountReadDto user, DateTime? expiresAt)
    {
        Token = token;
        User = user;
        ExpiresAt = expiresAt;
    }

    public void Clear()
    {
        Token = null;
        User = null;
        ExpiresAt = null;
    }
}
