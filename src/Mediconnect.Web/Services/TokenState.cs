using Mediconnect.Application.DTOs;

namespace Mediconnect.Web.Services;

// Per-circuit holder for the signed-in user's JWT and profile.
// (In-memory: survives Blazor SPA navigation; a full browser refresh requires re-login.)
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

    public void Clear()
    {
        Token = null;
        User = null;
        ExpiresAt = null;
    }
}
