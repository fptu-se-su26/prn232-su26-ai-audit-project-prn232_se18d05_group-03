using Mediconnect.Application.DTOs;
using Mediconnect.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Mediconnect.Modules.SmartClinic;

[ApiController]
[Authorize]
[Route("api/medical-records")]
public class OutpatientRecordController : ControllerBase
{
    private readonly IMedicalRecordService _medicalRecordService;

    public OutpatientRecordController(IMedicalRecordService medicalRecordService)
    {
        _medicalRecordService = medicalRecordService;
    }

    [HttpPost("diagnose")]
    public async Task<IActionResult> SaveDiagnosis([FromBody] MedicalRecordDtos dto, CancellationToken cancellationToken)
    {
        try
        {
            await _medicalRecordService.SaveMedicalRecordAsync(dto, cancellationToken);
            return Ok(new { message = "Lưu bệnh án thành công" });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("icd10/search")]
    public async Task<ActionResult<IReadOnlyList<ICD10ResultDto>>> SearchICD10(
        [FromQuery] string query,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(query))
            return Ok(Array.Empty<ICD10ResultDto>());

        var results = await _medicalRecordService.SearchICD10Async(query, cancellationToken);
        return Ok(results);
    }

    [HttpGet("patients/{patientId:guid}/diagnosis-history")]
    public async Task<ActionResult<IReadOnlyList<PatientDiagnosisHistoryDto>>> GetDiagnosisHistory(
        Guid patientId,
        CancellationToken cancellationToken)
    {
        var history = await _medicalRecordService.GetPatientDiagnosisHistoryAsync(patientId, cancellationToken);
        return Ok(history);
    }
}
