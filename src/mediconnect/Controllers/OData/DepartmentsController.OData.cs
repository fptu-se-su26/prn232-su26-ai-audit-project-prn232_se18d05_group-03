using Mediconnect.Application.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;

namespace Mediconnect.Api.Controllers;

public partial class DepartmentsController
{
    // OData: GET api/departments/odata?$filter=contains(Name,'Nội')&$orderby=Name
    [HttpGet("odata")]
    [EnableQuery]
    public IQueryable<DepartmentReadDto> GetOData()
    {
        return _repository.Query().Select(d => new DepartmentReadDto
        {
            Id = d.Id,
            Name = d.Name,
            Code = d.Code,
            Description = d.Description
        });
    }
}
