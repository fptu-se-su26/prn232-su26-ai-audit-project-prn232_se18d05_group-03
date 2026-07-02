using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Components.Authorization;
using Mediconnect.Web.Components;
using Mediconnect.Web.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();

// Auth state driven by JWT obtained from the API (held in-memory per SignalR circuit).
builder.Services.AddScoped<TokenState>();
builder.Services.AddScoped<ApiAuthStateProvider>();
builder.Services.AddScoped<AuthenticationStateProvider>(sp => sp.GetRequiredService<ApiAuthStateProvider>());

// Cookie scheme satisfies the ASP.NET Core challenge requirement at the HTTP level.
// Actual auth state inside the Blazor circuit comes from ApiAuthStateProvider.
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(o => { o.LoginPath = "/login"; o.AccessDeniedPath = "/login"; });

builder.Services.AddAuthorization();
builder.Services.AddCascadingAuthenticationState();

var apiBaseUrl = builder.Configuration["ApiBaseUrl"] ?? "http://localhost:5079/";
builder.Services.AddHttpClient<ApiClient>(client => client.BaseAddress = new Uri(apiBaseUrl));

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseAntiforgery();
app.UseAuthentication();
app.UseAuthorization();

// AllowAnonymous at HTTP level — AuthorizeRouteView inside the Blazor circuit handles
// all redirects to /login and role checks via ApiAuthStateProvider.
app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode()
    .AllowAnonymous();

app.Run();
