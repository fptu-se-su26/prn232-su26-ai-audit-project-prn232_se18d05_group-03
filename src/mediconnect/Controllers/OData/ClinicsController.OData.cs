using Mediconnect.Application.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;

namespace Mediconnect.Api.Controllers;

public partial class ClinicsController
{
    // OData: GET api/clinics/odata?$filter=IsActive eq true&$orderby=Name
    [HttpGet("odata")]
    [EnableQuery]
    public IQueryable<ClinicReadDto> GetOData()
    {
        return _clinicRepository.Query().Select(c => new ClinicReadDto
        {
            Id = c.Id,
            DepartmentId = c.DepartmentId,
            Name = c.Name,
            RoomNumber = c.RoomNumber,
            IsActive = c.IsActive
        });
    }
}
