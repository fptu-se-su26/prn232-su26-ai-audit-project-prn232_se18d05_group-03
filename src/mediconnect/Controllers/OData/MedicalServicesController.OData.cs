using Mediconnect.Application.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;

namespace Mediconnect.Api.Controllers;

public partial class MedicalServicesController
{
    // OData: GET api/medicalservices/odata?$filter=Price lt 200000&$orderby=Price
    [HttpGet("odata")]
    [EnableQuery]
    public IQueryable<MedicalServiceReadDto> GetOData()
    {
        return _serviceRepository.Query().Select(s => new MedicalServiceReadDto
        {
            Id = s.Id,
            DepartmentId = s.DepartmentId,
            Name = s.Name,
            Code = s.Code,
            Price = s.Price,
            IsActive = s.IsActive
        });
    }
}
