using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Mediconnect.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/reports")]
public class ReportsController : ControllerBase
{
    [HttpGet("revenue")]
    public IActionResult Revenue()
    {
        return Ok(new { total = 0m, byDepartment = Array.Empty<object>() });
    }

    [HttpGet("bed-occupancy")]
    public IActionResult BedOccupancy()
    {
        return Ok(new { occupied = 0, available = 0 });
    }

    [HttpGet("outpatient-volume")]
    public IActionResult OutpatientVolume()
    {
        return Ok(new { totalVisits = 0 });
    }
}
