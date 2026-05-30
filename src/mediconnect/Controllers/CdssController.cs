using Mediconnect.Application.DTOs;
using Mediconnect.Application.Interfaces;
using Mediconnect.Application.Mapping;
using Mediconnect.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Mediconnect.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/cdss")]
public class CdssController : ControllerBase
{
    private readonly IRepository<DrugInteraction> _interactionRepository;

    public CdssController(IRepository<DrugInteraction> interactionRepository)
    {
        _interactionRepository = interactionRepository;
    }

    [HttpPost("drug-interactions/check")]
    public async Task<ActionResult<DrugInteractionCheckResponseDto>> CheckInteractions(
        DrugInteractionCheckRequestDto request,
        CancellationToken cancellationToken)
    {
        if (request.DrugIds.Count == 0)
        {
            return Ok(new DrugInteractionCheckResponseDto());
        }

        var interactions = await _interactionRepository.ListAsync(
            di => request.DrugIds.Contains(di.DrugId) && request.DrugIds.Contains(di.InteractingDrugId),
            cancellationToken);

        var response = new DrugInteractionCheckResponseDto
        {
            Interactions = interactions.Select(SimpleMapper.Map<DrugInteraction, DrugInteractionReadDto>).ToList()
        };

        return Ok(response);
    }

    [HttpPost("dose-check")]
    public ActionResult<DoseCheckResponseDto> DoseCheck(DoseCheckRequestDto request)
    {
        var response = new DoseCheckResponseDto
        {
            IsOverDose = false,
            Message = "Dose check is not configured."
        };

        return Ok(response);
    }
}
