using Mediconnect.Application.Interfaces;
using Mediconnect.Infrastructure.Auth;
using Mediconnect.Infrastructure.Payments;
using Mediconnect.Infrastructure.Persistence;
using Mediconnect.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Mediconnect.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<AppDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        services.AddScoped<DbInitializer>();
        services.AddScoped(typeof(IRepository<>), typeof(EfRepository<>));
        services.AddScoped<IPasswordHasher, PasswordHasherService>();
        services.AddScoped<ITokenService, JwtTokenService>();

        services.Configure<VnPaySettings>(configuration.GetSection("VnPaySettings"));
        services.Configure<MomoSettings>(configuration.GetSection("MomoSettings"));
        services.AddScoped<IPaymentGatewayService, PaymentGatewayService>();

        return services;
    }
}
