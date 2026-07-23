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
    private readonly IRepository<Drug> _drugRepository;
    private readonly IRepository<PatientProfile> _patientRepository;

    public CdssController(
        IRepository<DrugInteraction> interactionRepository,
        IRepository<Drug> drugRepository,
        IRepository<PatientProfile> patientRepository)
    {
        _interactionRepository = interactionRepository;
        _drugRepository = drugRepository;
        _patientRepository = patientRepository;
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

    /// <summary>
    /// Screen 2.2 — Overdose warning. Compares the entered dose against a
    /// recommended maximum derived from the patient's body weight (per-kg
    /// threshold) or the drug's absolute daily-dose threshold.
    /// </summary>
    [HttpPost("dose-check")]
    public async Task<ActionResult<DoseCheckResponseDto>> DoseCheck(
        DoseCheckRequestDto request,
        CancellationToken cancellationToken)
    {
        var drug = await _drugRepository.GetByIdAsync(request.DrugId, cancellationToken);
        if (drug is null)
        {
            return NotFound(new { message = "Drug not found." });
        }

        var patient = await _patientRepository.GetByIdAsync(request.PatientId, cancellationToken);
        if (patient is null)
        {
            return NotFound(new { message = "Patient not found." });
        }

        var response = new DoseCheckResponseDto
        {
            DrugName = drug.Name,
            Unit = drug.Unit,
            EnteredDose = request.DoseAmount,
            PatientWeightKg = patient.WeightKg,
        };

        if (request.DoseAmount is null)
        {
            response.Message = "Chưa nhập liều lượng để kiểm tra.";
            return Ok(response);
        }

        // Prefer the weight-based threshold when both the drug rule and the
        // patient's weight are available; otherwise fall back to the absolute rule.
        decimal? recommendedMax = null;
        if (drug.MaxDosePerKg is > 0 && patient.WeightKg is > 0)
        {
            recommendedMax = drug.MaxDosePerKg.Value * patient.WeightKg.Value;
            response.ThresholdBasis = "per-kg";
        }
        else if (drug.MaxDailyDose is > 0)
        {
            recommendedMax = drug.MaxDailyDose.Value;
            response.ThresholdBasis = "absolute";
        }

        response.RecommendedMaxDose = recommendedMax;

        if (recommendedMax is null)
        {
            response.Message =
                $"Chưa thiết lập ngưỡng liều an toàn cho \"{drug.Name}\". " +
                "Vào Danh mục thuốc để nhập liều tối đa/ngày hoặc liều tối đa/kg.";
            return Ok(response);
        }

        if (request.DoseAmount.Value > recommendedMax.Value)
        {
            response.IsOverDose = true;
            var basis = response.ThresholdBasis == "per-kg"
                ? $" (theo {drug.MaxDosePerKg} {drug.Unit}/kg × {patient.WeightKg} kg)"
                : "";
            response.Message =
                $"CẢNH BÁO QUÁ LIỀU: liều {request.DoseAmount} {drug.Unit} vượt ngưỡng " +
                $"khuyến nghị {recommendedMax} {drug.Unit}{basis}. Vui lòng điều chỉnh trước khi ký duyệt.";
        }
        else
        {
            response.Message =
                $"Liều {request.DoseAmount} {drug.Unit} nằm trong ngưỡng an toàn " +
                $"(tối đa {recommendedMax} {drug.Unit}).";
        }

        return Ok(response);
    }
}
