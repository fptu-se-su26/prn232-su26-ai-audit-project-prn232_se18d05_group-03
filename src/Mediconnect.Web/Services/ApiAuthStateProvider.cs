using System.Security.Claims;
using Mediconnect.Application.DTOs;
using Microsoft.AspNetCore.Components.Authorization;
using Microsoft.AspNetCore.Components.Server.ProtectedBrowserStorage;

namespace Mediconnect.Web.Services;

// Builds the ClaimsPrincipal from TokenState so <AuthorizeView> / role checks work in the UI.
// Also mirrors the token into ProtectedLocalStorage so a browser refresh (F5) restores the session
// instead of forcing a re-login (TokenState alone is in-memory and dies with the SignalR circuit).
public class ApiAuthStateProvider : AuthenticationStateProvider
{
    private const string StorageKey = "mediconnect.auth";

    private readonly TokenState _state;
    private readonly ProtectedLocalStorage _storage;
    private bool _hydrated;

    public ApiAuthStateProvider(TokenState state, ProtectedLocalStorage storage)
    {
        _state = state;
        _storage = storage;
    }

    public override async Task<AuthenticationState> GetAuthenticationStateAsync()
    {
        if (!_hydrated)
        {
            _hydrated = true;
            await TryRestoreFromStorageAsync();
        }

        ClaimsIdentity identity;
        if (_state.IsAuthenticated && _state.User is not null)
        {
            identity = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, _state.User.Id.ToString()),
                new Claim(ClaimTypes.Name, _state.User.FullName),
                new Claim(ClaimTypes.Email, _state.User.Email),
                new Claim(ClaimTypes.Role, _state.User.Role.ToString())
            }, authenticationType: "jwt");
        }
        else
        {
            identity = new ClaimsIdentity();
        }

        return new AuthenticationState(new ClaimsPrincipal(identity));
    }

    // Called by ApiClient after a successful login — persists the token and pushes the new auth state.
    public async Task PersistAsync(AuthResponseDto auth)
    {
        _state.Set(auth);
        _hydrated = true;
        try { await _storage.SetAsync(StorageKey, new PersistedAuth(auth.AccessToken, auth.User, auth.ExpiresAt)); }
        catch (InvalidOperationException) { /* JS interop unavailable (e.g. prerender) — in-memory state still works */ }
        NotifyChanged();
    }

    // Called by ApiClient on logout — clears both the in-memory state and localStorage.
    public async Task ClearAsync()
    {
        _state.Clear();
        _hydrated = true;
        try { await _storage.DeleteAsync(StorageKey); }
        catch (InvalidOperationException) { }
        NotifyChanged();
    }

    public void NotifyChanged() => NotifyAuthenticationStateChanged(GetAuthenticationStateAsync());

    private async Task TryRestoreFromStorageAsync()
    {
        if (_state.IsAuthenticated) return;
        try
        {
            var result = await _storage.GetAsync<PersistedAuth>(StorageKey);
            if (!result.Success || result.Value is null) return;

            var persisted = result.Value;
            if (persisted.ExpiresAt is not null && persisted.ExpiresAt <= DateTime.UtcNow)
            {
                await _storage.DeleteAsync(StorageKey);
                return;
            }

            _state.Restore(persisted.Token, persisted.User, persisted.ExpiresAt);
        }
        catch (InvalidOperationException)
        {
            // JS interop not available yet (prerender) — the user will need to log in for this circuit.
        }
    }

    private sealed record PersistedAuth(string Token, UserAccountReadDto User, DateTime? ExpiresAt);
}
