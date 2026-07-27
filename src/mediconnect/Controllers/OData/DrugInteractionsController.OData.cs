using Mediconnect.Application.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;

namespace Mediconnect.Api.Controllers;

public partial class DrugInteractionsController
{
    // OData: GET api/druginteractions/odata?$filter=Severity eq 'Major'
    [HttpGet("odata")]
    [EnableQuery]
    public IQueryable<DrugInteractionReadDto> GetOData()
    {
        return _repository.Query().Select(di => new DrugInteractionReadDto
        {
            Id = di.Id,
            DrugId = di.DrugId,
            InteractingDrugId = di.InteractingDrugId,
            Severity = di.Severity,
            Description = di.Description
        });
    }
}
