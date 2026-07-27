using System.Security.Claims;
using Mediconnect.Application.DTOs;
using Mediconnect.Application.Interfaces;
using Mediconnect.Application.Mapping;
using Mediconnect.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Mediconnect.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/patients")]
public class PatientsController : ControllerBase
{
    private readonly ICrudService<PatientProfile, PatientProfileReadDto, PatientProfileWriteDto> _crudService;
    private readonly IRepository<PatientProfile> _patientRepository;
    private readonly IRepository<OutpatientVisit> _visitRepository;
    private readonly IRepository<LabOrder> _labOrderRepository;
    private readonly IRepository<LabResult> _labResultRepository;
    private readonly IRepository<Prescription> _prescriptionRepository;

    public PatientsController(
        ICrudService<PatientProfile, PatientProfileReadDto, PatientProfileWriteDto> crudService,
        IRepository<PatientProfile> patientRepository,
        IRepository<OutpatientVisit> visitRepository,
        IRepository<LabOrder> labOrderRepository,
        IRepository<LabResult> labResultRepository,
        IRepository<Prescription> prescriptionRepository)
    {
        _crudService = crudService;
        _patientRepository = patientRepository;
        _visitRepository = visitRepository;
        _labOrderRepository = labOrderRepository;
        _labResultRepository = labResultRepository;
        _prescriptionRepository = prescriptionRepository;
    }

    [HttpGet]
    [Authorize(Roles = "Admin,Doctor,Nurse")]
    public async Task<ActionResult<IReadOnlyList<PatientProfileReadDto>>> GetAll(CancellationToken cancellationToken)
    {
        var patients = await _crudService.GetAllAsync(cancellationToken);
        return Ok(patients);
    }

    [HttpGet("me")]
    public async Task<ActionResult<PatientProfileReadDto>> GetMe(CancellationToken cancellationToken)
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdValue, out var userId))
        {
            return Unauthorized();
        }

        var profile = await _patientRepository.FirstOrDefaultAsync(p => p.UserAccountId == userId, cancellationToken);
        if (profile is null)
        {
            return NotFound();
        }

        return Ok(SimpleMapper.Map<PatientProfile, PatientProfileReadDto>(profile));
    }

    /// <summary>
    /// Mở cho mọi role: bệnh nhân tự tạo hồ sơ của chính mình khi đặt lịch/ghi danh lần đầu
    /// (UserAccountId phải là chính họ), nhân viên tạo hồ sơ thay bệnh nhân vãng lai.
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<PatientProfileReadDto>> Create(PatientProfileWriteDto dto, CancellationToken cancellationToken)
    {
        if (User.IsInRole("Patient"))
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            if (dto.UserAccountId != userId)
            {
                return Forbid();
            }
        }

        var created = await _crudService.CreateAsync(dto, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpGet("{id:guid}")]
    [Authorize(Roles = "Admin,Doctor,Nurse")]
    public async Task<ActionResult<PatientProfileReadDto>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var profile = await _crudService.GetByIdAsync(id, cancellationToken);
        return profile is null ? NotFound() : Ok(profile);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin,Doctor,Nurse")]
    public async Task<IActionResult> Update(Guid id, PatientProfileWriteDto dto, CancellationToken cancellationToken)
    {
        var updated = await _crudService.UpdateAsync(id, dto, cancellationToken);
        return updated ? NoContent() : NotFound();
    }

    /// <summary>Bệnh nhân chỉ xem được lịch sử của chính mình; nhân viên xem được của bất kỳ ai.</summary>
    [HttpGet("{id:guid}/history")]
    public async Task<ActionResult<PatientHistoryDto>> GetHistory(Guid id, CancellationToken cancellationToken)
    {
        if (!await CanAccessPatientAsync(id, cancellationToken))
        {
            return Forbid();
        }

        var visits = await _visitRepository.ListAsync(v => v.PatientId == id, cancellationToken);
        var visitIds = visits.Select(v => v.Id).ToList();

        var labOrders = visitIds.Count == 0
            ? Array.Empty<LabOrder>()
            : await _labOrderRepository.ListAsync(o => visitIds.Contains(o.OutpatientVisitId), cancellationToken);
        var labOrderIds = labOrders.Select(o => o.Id).ToList();

        var labResults = labOrderIds.Count == 0
            ? Array.Empty<LabResult>()
            : await _labResultRepository.ListAsync(r => labOrderIds.Contains(r.LabOrderId), cancellationToken);

        var prescriptions = visitIds.Count == 0
            ? Array.Empty<Prescription>()
            : await _prescriptionRepository.ListAsync(p => visitIds.Contains(p.OutpatientVisitId), cancellationToken);

        var history = new PatientHistoryDto
        {
            Visits = visits.Select(SimpleMapper.Map<OutpatientVisit, OutpatientVisitReadDto>).ToList(),
            LabResults = labResults.Select(SimpleMapper.Map<LabResult, LabResultReadDto>).ToList(),
            Prescriptions = prescriptions.Select(SimpleMapper.Map<Prescription, PrescriptionReadDto>).ToList()
        };

        return Ok(history);
    }

    [HttpGet("{id:guid}/lab-results")]
    public async Task<ActionResult<IReadOnlyList<LabResultReadDto>>> GetLabResults(Guid id, CancellationToken cancellationToken)
    {
        if (!await CanAccessPatientAsync(id, cancellationToken))
        {
            return Forbid();
        }

        var visits = await _visitRepository.ListAsync(v => v.PatientId == id, cancellationToken);
        var visitIds = visits.Select(v => v.Id).ToList();

        var labOrders = visitIds.Count == 0
            ? Array.Empty<LabOrder>()
            : await _labOrderRepository.ListAsync(o => visitIds.Contains(o.OutpatientVisitId), cancellationToken);
        var labOrderIds = labOrders.Select(o => o.Id).ToList();

        var labResults = labOrderIds.Count == 0
            ? Array.Empty<LabResult>()
            : await _labResultRepository.ListAsync(r => labOrderIds.Contains(r.LabOrderId), cancellationToken);

        var result = labResults.Select(SimpleMapper.Map<LabResult, LabResultReadDto>).ToList();
        return Ok(result);
    }

    [HttpGet("{id:guid}/prescriptions")]
    public async Task<ActionResult<IReadOnlyList<PrescriptionReadDto>>> GetPrescriptions(Guid id, CancellationToken cancellationToken)
    {
        if (!await CanAccessPatientAsync(id, cancellationToken))
        {
            return Forbid();
        }

        var visits = await _visitRepository.ListAsync(v => v.PatientId == id, cancellationToken);
        var visitIds = visits.Select(v => v.Id).ToList();

        var prescriptions = visitIds.Count == 0
            ? Array.Empty<Prescription>()
            : await _prescriptionRepository.ListAsync(p => visitIds.Contains(p.OutpatientVisitId), cancellationToken);

        var result = prescriptions.Select(SimpleMapper.Map<Prescription, PrescriptionReadDto>).ToList();
        return Ok(result);
    }

    /// <summary>Staff (Admin/Doctor/Nurse/Lab) may access any patient; a Patient may only access their own record.</summary>
    private async Task<bool> CanAccessPatientAsync(Guid patientId, CancellationToken cancellationToken)
    {
        if (!User.IsInRole("Patient"))
        {
            return true;
        }

        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var myProfile = await _patientRepository.FirstOrDefaultAsync(p => p.UserAccountId == userId, cancellationToken);
        return myProfile is not null && myProfile.Id == patientId;
    }
}
