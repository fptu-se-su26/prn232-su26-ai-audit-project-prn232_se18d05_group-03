using System.Security.Claims;
using Microsoft.AspNetCore.Components.Authorization;

namespace Mediconnect.Web.Services;

// Builds the ClaimsPrincipal from TokenState so <AuthorizeView> / role checks work in the UI.
public class ApiAuthStateProvider : AuthenticationStateProvider
{
    private readonly TokenState _state;

    public ApiAuthStateProvider(TokenState state) => _state = state;

    public override Task<AuthenticationState> GetAuthenticationStateAsync()
    {
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

        return Task.FromResult(new AuthenticationState(new ClaimsPrincipal(identity)));
    }

    public void NotifyChanged() => NotifyAuthenticationStateChanged(GetAuthenticationStateAsync());
}
