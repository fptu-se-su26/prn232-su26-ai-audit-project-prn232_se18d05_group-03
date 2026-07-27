namespace Mediconnect.Infrastructure.Payments;

/// <summary>Base URL of the web app the browser should land on after a payment gateway redirect.</summary>
public class FrontendSettings
{
    public string BaseUrl { get; set; } = "http://localhost:5104";
}
