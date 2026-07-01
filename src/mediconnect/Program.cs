using System.Text;
using System.Text.Json.Serialization;
using Mediconnect.Application.DTOs;
using Mediconnect.Application.Interfaces;
using Mediconnect.Application.Services;
using Mediconnect.Domain.Entities;
using Mediconnect.Infrastructure;
using Mediconnect.Infrastructure.Auth;
using Mediconnect.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddControllers()
    .AddJsonOptions(options =>
    {
        // Serialize enums as readable strings (e.g. "Occupied", "Nurse") so the static UI can
        // consume them directly instead of magic numbers.
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "Mediconnect API", Version = "v1" });
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter 'Bearer' followed by a space and the JWT."
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddScoped(typeof(ICrudService<,,>), typeof(CrudService<,,>));
builder.Services.AddScoped<ICrudService<UserAccount, UserAccountReadDto, UserAccountWriteDto>, UserAccountService>();
builder.Services.AddScoped<IAuthService, AuthService>();

var jwtSettings = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>() ?? new JwtSettings();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidateLifetime = true,
            ValidIssuer = jwtSettings.Issuer,
            ValidAudience = jwtSettings.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.SecretKey))
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

var httpsPort = builder.Configuration["ASPNETCORE_HTTPS_PORT"];
if (!string.IsNullOrWhiteSpace(httpsPort))
{
    app.UseHttpsRedirection();
}

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Static UI (wwwroot/index.html) is served by UseDefaultFiles; keep a fallback for when it is absent.
app.MapGet("/", () => Results.Redirect("/index.html"));

using (var scope = app.Services.CreateScope())
{
    var initializer = scope.ServiceProvider.GetRequiredService<DbInitializer>();
    await initializer.SeedAsync();
}

app.Run();
