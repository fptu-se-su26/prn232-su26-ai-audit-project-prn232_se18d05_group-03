using Mediconnect.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Mediconnect.Application.DTOs;

namespace Mediconnect.Modules.SmartClinic;
[ApiController]
[Authorize]
[Route("api/medical-records")]
public class OutpatientRecordController : ControllerBase
{
    private readonly IMedicalRecordService _medicalRecordService;
    
    private readonly IQueueService _queueService;

    public OutpatientRecordController(IMedicalRecordService medicalRecordService, IQueueService queueService)
    {
        _medicalRecordService = medicalRecordService;
        _queueService = queueService;
    }

    [HttpPost("diagnose")]
    public async Task<IActionResult> SaveDiagnosis([FromBody] MedicalRecordDtos dto)
    {
       
        await _medicalRecordService.SaveMedicalRecordAsync(dto);
        return Ok(new { message = "Lưu bệnh án thành công" });
    }

    //[HttpGet("icd10/search")]
    //public async Task<IActionResult> SearchICD10([FromQuery] string query)
    //{
    //    var results = await _medicalRecordService.SearchICD10Async(query);
    //    return Ok(results);
    //}
}