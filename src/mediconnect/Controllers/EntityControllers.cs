using Mediconnect.Application.DTOs;
using Mediconnect.Application.Interfaces;
using Mediconnect.Application.Mapping;
using Mediconnect.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Mediconnect.Api.Controllers;

public class AppointmentsController : CrudController<Appointment, AppointmentReadDto, AppointmentWriteDto>
{
    private readonly IRepository<Appointment> _repository;

    public AppointmentsController(
        ICrudService<Appointment, AppointmentReadDto, AppointmentWriteDto> service,
        IRepository<Appointment> repository)
        : base(service)
    {
        _repository = repository;
    }

    [HttpPatch("{id:guid}/status")]
    public async Task<IActionResult> UpdateStatus(
        Guid id,
        StatusUpdateDto<AppointmentStatus> dto,
        CancellationToken cancellationToken)
    {
        var appointment = await _repository.GetByIdAsync(id, cancellationToken);
        if (appointment is null)
        {
            return NotFound();
        }

        appointment.Status = dto.Status;
        _repository.Update(appointment);
        await _repository.SaveChangesAsync(cancellationToken);
        return NoContent();
    }
}

public class BedsController : CrudController<Bed, BedReadDto, BedWriteDto>
{
    private readonly IRepository<Bed> _repository;

    public BedsController(ICrudService<Bed, BedReadDto, BedWriteDto> service, IRepository<Bed> repository)
        : base(service)
    {
        _repository = repository;
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public override Task<ActionResult<BedReadDto>> Create([FromBody] BedWriteDto dto, CancellationToken cancellationToken)
        => base.Create(dto, cancellationToken);

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public override Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
        => base.Delete(id, cancellationToken);

    [HttpPatch("{id:guid}/status")]
    [Authorize(Roles = "Admin,Nurse")]
    public async Task<IActionResult> UpdateStatus(Guid id, StatusUpdateDto<BedStatus> dto, CancellationToken cancellationToken)
    {
        var bed = await _repository.GetByIdAsync(id, cancellationToken);
        if (bed is null)
        {
            return NotFound();
        }

        bed.Status = dto.Status;
        _repository.Update(bed);
        await _repository.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    [HttpPatch("{id:guid}/position")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdatePosition(Guid id, [FromBody] BedPositionDto dto, CancellationToken cancellationToken)
    {
        var bed = await _repository.GetByIdAsync(id, cancellationToken);
        if (bed is null) return NotFound();
        bed.Floor = dto.Floor;
        bed.PositionX = dto.PositionX;
        bed.PositionY = dto.PositionY;
        _repository.Update(bed);
        await _repository.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    [HttpGet("map")]
    public async Task<ActionResult<IList<BedMapGroupDto>>> GetMap(
        [FromQuery] Guid? departmentId,
        CancellationToken cancellationToken)
    {
        var beds = departmentId.HasValue
            ? await _repository.ListAsync(b => b.DepartmentId == departmentId.Value, cancellationToken)
            : await _repository.GetAllAsync(cancellationToken);

        var groups = beds
            .GroupBy(b => b.Status)
            .Select(g => new BedMapGroupDto
            {
                Status = g.Key,
                Count = g.Count(),
                Beds = g.Select(SimpleMapper.Map<Bed, BedReadDto>).ToList()
            })
            .OrderBy(g => g.Status)
            .ToList();

        return Ok(groups);
    }
}

public class BedAssignmentsController : CrudController<BedAssignment, BedAssignmentReadDto, BedAssignmentWriteDto>
{
    private readonly IRepository<BedAssignment> _repository;
    private readonly IRepository<Bed> _bedRepository;

    public BedAssignmentsController(
        ICrudService<BedAssignment, BedAssignmentReadDto, BedAssignmentWriteDto> service,
        IRepository<BedAssignment> repository,
        IRepository<Bed> bedRepository)
        : base(service)
    {
        _repository = repository;
        _bedRepository = bedRepository;
    }

    // Assigning a patient to a bed must keep the F1 bed map accurate: the target bed has to be
    // available and is flipped to Occupied once the assignment is created.
    [HttpPost]
    [Authorize(Roles = "Nurse,Doctor,Admin")]
    public override async Task<ActionResult<BedAssignmentReadDto>> Create(
        [FromBody] BedAssignmentWriteDto dto,
        CancellationToken cancellationToken)
    {
        var bed = await _bedRepository.GetByIdAsync(dto.BedId, cancellationToken);
        if (bed is null)
        {
            return NotFound(new { message = "Bed not found." });
        }

        if (bed.Status != BedStatus.Available)
        {
            return BadRequest(new { message = $"Bed is not available (current status: {bed.Status})." });
        }

        var created = await base.Create(dto, cancellationToken);

        bed.Status = BedStatus.Occupied;
        _bedRepository.Update(bed);
        await _bedRepository.SaveChangesAsync(cancellationToken);

        return created;
    }

    [HttpPatch("{id:guid}/release")]
    [Authorize(Roles = "Nurse,Doctor,Admin")]
    public async Task<IActionResult> Release(Guid id, CancellationToken cancellationToken)
    {
        var assignment = await _repository.GetByIdAsync(id, cancellationToken);
        if (assignment is null)
        {
            return NotFound();
        }

        assignment.ReleasedAt = DateTime.UtcNow;
        _repository.Update(assignment);

        // Free the bed and flag it for cleaning so the bed map reflects the release.
        var bed = await _bedRepository.GetByIdAsync(assignment.BedId, cancellationToken);
        if (bed is not null)
        {
            bed.Status = BedStatus.Cleaning;
            _bedRepository.Update(bed);
        }

        await _repository.SaveChangesAsync(cancellationToken);
        return NoContent();
    }
}

public class BillingInvoicesController : CrudController<BillingInvoice, BillingInvoiceReadDto, BillingInvoiceWriteDto>
{
    private readonly IRepository<BillingInvoice> _invoiceRepository;
    private readonly IRepository<BillingItem> _billingItemRepository;

    public BillingInvoicesController(
        ICrudService<BillingInvoice, BillingInvoiceReadDto, BillingInvoiceWriteDto> service,
        IRepository<BillingInvoice> invoiceRepository,
        IRepository<BillingItem> billingItemRepository)
        : base(service)
    {
        _invoiceRepository = invoiceRepository;
        _billingItemRepository = billingItemRepository;
    }

    [HttpGet("{id:guid}/items")]
    public async Task<ActionResult<IReadOnlyList<BillingItemReadDto>>> GetItems(
        Guid id,
        CancellationToken cancellationToken)
    {
        var items = await _billingItemRepository.ListAsync(i => i.BillingInvoiceId == id, cancellationToken);
        var result = items.Select(SimpleMapper.Map<BillingItem, BillingItemReadDto>).ToList();
        return Ok(result);
    }

    [HttpPost("{id:guid}/items")]
    public async Task<ActionResult<BillingItemReadDto>> AddItem(
        Guid id,
        BillingItemWriteDto dto,
        CancellationToken cancellationToken)
    {
        dto.BillingInvoiceId = id;
        var item = SimpleMapper.Map<BillingItemWriteDto, BillingItem>(dto);
        await _billingItemRepository.AddAsync(item, cancellationToken);
        await _billingItemRepository.SaveChangesAsync(cancellationToken);
        var result = SimpleMapper.Map<BillingItem, BillingItemReadDto>(item);
        return CreatedAtAction(nameof(GetItems), new { id }, result);
    }

    [HttpPost("{id:guid}/calculate-insurance")]
    public async Task<ActionResult<BillingInvoiceReadDto>> CalculateInsurance(
        Guid id,
        CancellationToken cancellationToken)
    {
        var invoice = await _invoiceRepository.GetByIdAsync(id, cancellationToken);
        if (invoice is null)
        {
            return NotFound();
        }

        invoice.InsuranceDeduction = 0m;
        invoice.TotalAmount = invoice.Subtotal - invoice.InsuranceDeduction;
        _invoiceRepository.Update(invoice);
        await _invoiceRepository.SaveChangesAsync(cancellationToken);

        return Ok(SimpleMapper.Map<BillingInvoice, BillingInvoiceReadDto>(invoice));
    }
}

public class BillingItemsController : CrudController<BillingItem, BillingItemReadDto, BillingItemWriteDto>
{
    public BillingItemsController(ICrudService<BillingItem, BillingItemReadDto, BillingItemWriteDto> service)
        : base(service)
    {
    }
}

public class CareOrdersController : CrudController<CareOrder, CareOrderReadDto, CareOrderWriteDto>
{
    private readonly IRepository<CareOrder> _repository;

    public CareOrdersController(
        ICrudService<CareOrder, CareOrderReadDto, CareOrderWriteDto> service,
        IRepository<CareOrder> repository)
        : base(service)
    {
        _repository = repository;
    }

    // F2: doctors (Bác sĩ) issue the daily care orders (medication, infusion, diet, procedure).
    [HttpPost]
    [Authorize(Roles = "Doctor,Admin")]
    public override Task<ActionResult<CareOrderReadDto>> Create(
        [FromBody] CareOrderWriteDto dto,
        CancellationToken cancellationToken)
        => base.Create(dto, cancellationToken);

    // Nurses (or doctors) mark an order as carried out at the bedside.
    [HttpPatch("{id:guid}/complete")]
    [Authorize(Roles = "Nurse,Doctor,Admin")]
    public async Task<IActionResult> Complete(Guid id, CancellationToken cancellationToken)
    {
        var order = await _repository.GetByIdAsync(id, cancellationToken);
        if (order is null)
        {
            return NotFound();
        }

        order.IsCompleted = true;
        order.CompletedAt = DateTime.UtcNow;
        _repository.Update(order);
        await _repository.SaveChangesAsync(cancellationToken);
        return NoContent();
    }
}

public class ClinicsController : CrudController<Clinic, ClinicReadDto, ClinicWriteDto>
{
    private readonly IRepository<Clinic> _clinicRepository;
    private readonly IRepository<MedicalService> _serviceRepository;

    public ClinicsController(
        ICrudService<Clinic, ClinicReadDto, ClinicWriteDto> service,
        IRepository<Clinic> clinicRepository,
        IRepository<MedicalService> serviceRepository)
        : base(service)
    {
        _clinicRepository = clinicRepository;
        _serviceRepository = serviceRepository;
    }

    /// <summary>
    /// Lấy danh sách phòng khám đang hoạt động.
    /// </summary>
    [HttpGet("active")]
    public async Task<ActionResult<IReadOnlyList<ClinicReadDto>>> GetActive(CancellationToken cancellationToken)
    {
        var clinics = await _clinicRepository.ListAsync(c => c.IsActive, cancellationToken);
        var result = clinics.Select(SimpleMapper.Map<Clinic, ClinicReadDto>).ToList();
        return Ok(result);
    }

    /// <summary>
    /// Lấy danh sách dịch vụ thuộc phòng khám (theo khoa của phòng khám).
    /// </summary>
    [HttpGet("{id:guid}/services")]
    public async Task<ActionResult<ClinicWithServicesDto>> GetServices(
        Guid id,
        CancellationToken cancellationToken)
    {
        var clinic = await _clinicRepository.GetByIdAsync(id, cancellationToken);
        if (clinic is null)
            return NotFound();

        var services = await _serviceRepository.ListAsync(
            s => s.DepartmentId == clinic.DepartmentId && s.IsActive,
            cancellationToken);

        var result = new ClinicWithServicesDto
        {
            Id = clinic.Id,
            DepartmentId = clinic.DepartmentId,
            Name = clinic.Name,
            RoomNumber = clinic.RoomNumber,
            IsActive = clinic.IsActive,
            Services = services.Select(SimpleMapper.Map<MedicalService, MedicalServiceReadDto>).ToList()
        };

        return Ok(result);
    }
}

public class DepartmentsController : CrudController<Department, DepartmentReadDto, DepartmentWriteDto>
{
    public DepartmentsController(ICrudService<Department, DepartmentReadDto, DepartmentWriteDto> service)
        : base(service)
    {
    }
}

public class DischargeSummariesController : CrudController<DischargeSummary, DischargeSummaryReadDto, DischargeSummaryWriteDto>
{
    public DischargeSummariesController(ICrudService<DischargeSummary, DischargeSummaryReadDto, DischargeSummaryWriteDto> service)
        : base(service)
    {
    }
}

public class DrugsController : CrudController<Drug, DrugReadDto, DrugWriteDto>
{
    public DrugsController(ICrudService<Drug, DrugReadDto, DrugWriteDto> service)
        : base(service)
    {
    }
}

public class DrugInteractionsController : CrudController<DrugInteraction, DrugInteractionReadDto, DrugInteractionWriteDto>
{
    public DrugInteractionsController(ICrudService<DrugInteraction, DrugInteractionReadDto, DrugInteractionWriteDto> service)
        : base(service)
    {
    }
}

public class InpatientAdmissionsController : CrudController<InpatientAdmission, InpatientAdmissionReadDto, InpatientAdmissionWriteDto>
{
    // Daily bed charge used when aggregating the discharge invoice (beds have no per-day price in the model).
    private const decimal BedDailyRate = 500_000m;

    private readonly IRepository<InpatientAdmission> _repository;
    private readonly IRepository<DischargeSummary> _dischargeRepository;
    private readonly IRepository<BedAssignment> _bedAssignmentRepository;
    private readonly IRepository<VitalSign> _vitalSignRepository;
    private readonly IRepository<CareOrder> _careOrderRepository;
    private readonly IRepository<Bed> _bedRepository;
    private readonly IRepository<BillingInvoice> _invoiceRepository;
    private readonly IRepository<BillingItem> _billingItemRepository;
    private readonly IRepository<PatientProfile> _patientProfileRepository;

    public InpatientAdmissionsController(
        ICrudService<InpatientAdmission, InpatientAdmissionReadDto, InpatientAdmissionWriteDto> service,
        IRepository<InpatientAdmission> repository,
        IRepository<DischargeSummary> dischargeRepository,
        IRepository<BedAssignment> bedAssignmentRepository,
        IRepository<VitalSign> vitalSignRepository,
        IRepository<CareOrder> careOrderRepository,
        IRepository<Bed> bedRepository,
        IRepository<BillingInvoice> invoiceRepository,
        IRepository<BillingItem> billingItemRepository,
        IRepository<PatientProfile> patientProfileRepository)
        : base(service)
    {
        _repository = repository;
        _dischargeRepository = dischargeRepository;
        _bedAssignmentRepository = bedAssignmentRepository;
        _vitalSignRepository = vitalSignRepository;
        _careOrderRepository = careOrderRepository;
        _bedRepository = bedRepository;
        _invoiceRepository = invoiceRepository;
        _billingItemRepository = billingItemRepository;
        _patientProfileRepository = patientProfileRepository;
    }

    [HttpPatch("{id:guid}/status")]
    [Authorize(Roles = "Nurse,Doctor,Admin")]
    public async Task<IActionResult> UpdateStatus(
        Guid id,
        StatusUpdateDto<AdmissionStatus> dto,
        CancellationToken cancellationToken)
    {
        var admission = await _repository.GetByIdAsync(id, cancellationToken);
        if (admission is null)
        {
            return NotFound();
        }

        admission.Status = dto.Status;
        _repository.Update(admission);
        await _repository.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    // Admit a patient (optionally transferring in from an outpatient visit) and assign a bed in one step,
    // keeping the F1 bed map accurate by flipping the bed to Occupied.
    [HttpPost("admit")]
    [Authorize(Roles = "Nurse,Doctor,Admin")]
    public async Task<ActionResult<InpatientAdmissionReadDto>> Admit(
        [FromBody] AdmitRequestDto request,
        CancellationToken cancellationToken)
    {
        var bed = await _bedRepository.GetByIdAsync(request.BedId, cancellationToken);
        if (bed is null)
        {
            return NotFound(new { message = "Bed not found." });
        }

        if (bed.Status != BedStatus.Available)
        {
            return BadRequest(new { message = $"Bed is not available (current status: {bed.Status})." });
        }

        // PatientId may arrive as a PatientProfile id or a UserAccount id (the UI patient
        // dropdown lists accounts) — resolve to the profile the admission FK requires.
        var profile = await _patientProfileRepository.FirstOrDefaultAsync(
            p => p.Id == request.PatientId || p.UserAccountId == request.PatientId, cancellationToken);
        if (profile is null)
        {
            return NotFound(new { message = "Patient profile not found." });
        }

        var now = DateTime.UtcNow;

        var admission = new InpatientAdmission
        {
            Id = Guid.NewGuid(),
            PatientId = profile.Id,
            FromOutpatientVisitId = request.FromOutpatientVisitId,
            DepartmentId = request.DepartmentId,
            AdmissionDate = now,
            Status = AdmissionStatus.Active
        };
        await _repository.AddAsync(admission, cancellationToken);

        var assignment = new BedAssignment
        {
            Id = Guid.NewGuid(),
            AdmissionId = admission.Id,
            BedId = bed.Id,
            AssignedAt = now
        };
        await _bedAssignmentRepository.AddAsync(assignment, cancellationToken);

        bed.Status = BedStatus.Occupied;
        _bedRepository.Update(bed);

        await _repository.SaveChangesAsync(cancellationToken);

        var result = SimpleMapper.Map<InpatientAdmission, InpatientAdmissionReadDto>(admission);
        return Ok(result);
    }

    // Marks the patient discharged, releases beds, and aggregates bed/drug/procedure charges
    // into a Pending invoice handed off to the Billing subsystem.
    [HttpPost("{id:guid}/discharge")]
    [Authorize(Roles = "Nurse,Doctor,Admin")]
    public async Task<ActionResult<DischargeResultDto>> Discharge(
        Guid id,
        [FromBody] DischargeRequestDto? request,
        CancellationToken cancellationToken)
    {
        var admission = await _repository.GetByIdAsync(id, cancellationToken);
        if (admission is null)
        {
            return NotFound();
        }

        if (admission.Status == AdmissionStatus.Discharged)
        {
            return BadRequest(new { message = "Admission is already discharged." });
        }

        var dischargeDate = DateTime.UtcNow;

        var invoice = new BillingInvoice
        {
            Id = Guid.NewGuid(),
            PatientId = admission.PatientId,
            CreatedAt = dischargeDate,
            Status = InvoiceStatus.Pending,
            InsuranceDeduction = request?.InsuranceDeduction ?? 0m
        };

        var items = new List<BillingItem>();

        // 1. Bed charges: sum of occupied days across all bed assignments for this admission.
        var assignments = await _bedAssignmentRepository.ListAsync(a => a.AdmissionId == id, cancellationToken);
        var totalBedDays = 0;
        foreach (var assignment in assignments)
        {
            var end = assignment.ReleasedAt ?? dischargeDate;
            var days = (int)Math.Ceiling((end - assignment.AssignedAt).TotalDays);
            totalBedDays += Math.Max(days, 1);

            // Release any still-occupied bed and flag it for cleaning (links back to F1 bed map).
            if (assignment.ReleasedAt is null)
            {
                assignment.ReleasedAt = dischargeDate;
                _bedAssignmentRepository.Update(assignment);

                var bed = await _bedRepository.GetByIdAsync(assignment.BedId, cancellationToken);
                if (bed is not null)
                {
                    bed.Status = BedStatus.Cleaning;
                    _bedRepository.Update(bed);
                }
            }
        }

        if (totalBedDays > 0)
        {
            items.Add(new BillingItem
            {
                Id = Guid.NewGuid(),
                BillingInvoiceId = invoice.Id,
                ItemType = BillingItemType.Bed,
                Description = $"Bed charge ({totalBedDays} day(s))",
                Quantity = totalBedDays,
                UnitPrice = BedDailyRate,
                Amount = totalBedDays * BedDailyRate
            });
        }

        // 2. Drug & procedure charges: enumerate care orders as line items for Billing to price.
        var careOrders = await _careOrderRepository.ListAsync(c => c.AdmissionId == id, cancellationToken);
        foreach (var order in careOrders)
        {
            var itemType = order.OrderType switch
            {
                CareOrderType.Medication or CareOrderType.Infusion => BillingItemType.Drug,
                CareOrderType.Procedure => BillingItemType.Procedure,
                _ => (BillingItemType?)null
            };

            if (itemType is null)
            {
                continue;
            }

            items.Add(new BillingItem
            {
                Id = Guid.NewGuid(),
                BillingInvoiceId = invoice.Id,
                ItemType = itemType.Value,
                Description = order.Description,
                Quantity = 1,
                UnitPrice = 0m,
                Amount = 0m
            });
        }

        invoice.Subtotal = items.Sum(i => i.Amount);
        invoice.TotalAmount = invoice.Subtotal - invoice.InsuranceDeduction;

        await _invoiceRepository.AddAsync(invoice, cancellationToken);
        foreach (var item in items)
        {
            await _billingItemRepository.AddAsync(item, cancellationToken);
        }

        admission.Status = AdmissionStatus.Discharged;
        _repository.Update(admission);

        var summary = new DischargeSummary
        {
            Id = Guid.NewGuid(),
            AdmissionId = id,
            DischargeDate = dischargeDate,
            Summary = request?.Summary,
            TotalCost = invoice.TotalAmount
        };
        await _dischargeRepository.AddAsync(summary, cancellationToken);

        await _repository.SaveChangesAsync(cancellationToken);

        var result = new DischargeResultDto
        {
            Summary = SimpleMapper.Map<DischargeSummary, DischargeSummaryReadDto>(summary),
            Invoice = SimpleMapper.Map<BillingInvoice, BillingInvoiceReadDto>(invoice),
            Items = items.Select(SimpleMapper.Map<BillingItem, BillingItemReadDto>).ToList()
        };
        return Ok(result);
    }

    [HttpGet("{id:guid}/bed-assignments")]
    public async Task<ActionResult<IReadOnlyList<BedAssignmentReadDto>>> GetBedAssignments(
        Guid id,
        CancellationToken cancellationToken)
    {
        var admission = await _repository.GetByIdAsync(id, cancellationToken);
        if (admission is null)
        {
            return NotFound();
        }

        var assignments = await _bedAssignmentRepository.ListAsync(
            a => a.AdmissionId == id, cancellationToken);

        var result = assignments.Select(SimpleMapper.Map<BedAssignment, BedAssignmentReadDto>).ToList();
        return Ok(result);
    }

    [HttpGet("{id:guid}/vital-signs")]
    public async Task<ActionResult<IReadOnlyList<VitalSignReadDto>>> GetVitalSigns(
        Guid id,
        [FromQuery] DateOnly? date,
        CancellationToken cancellationToken)
    {
        var admission = await _repository.GetByIdAsync(id, cancellationToken);
        if (admission is null)
        {
            return NotFound();
        }

        var vitalSigns = await _vitalSignRepository.ListAsync(
            v => v.AdmissionId == id, cancellationToken);

        var query = vitalSigns.AsEnumerable();
        if (date.HasValue)
        {
            query = query.Where(v => DateOnly.FromDateTime(v.RecordedAt) == date.Value);
        }

        var result = query
            .OrderByDescending(v => v.RecordedAt)
            .Select(SimpleMapper.Map<VitalSign, VitalSignReadDto>)
            .ToList();
        return Ok(result);
    }

    [HttpGet("{id:guid}/care-orders")]
    public async Task<ActionResult<IReadOnlyList<CareOrderReadDto>>> GetCareOrders(
        Guid id,
        [FromQuery] CareOrderType? orderType,
        [FromQuery] bool? pending,
        CancellationToken cancellationToken)
    {
        var admission = await _repository.GetByIdAsync(id, cancellationToken);
        if (admission is null)
        {
            return NotFound();
        }

        var careOrders = await _careOrderRepository.ListAsync(
            c => c.AdmissionId == id, cancellationToken);

        var query = careOrders.AsEnumerable();
        if (orderType.HasValue)
        {
            query = query.Where(c => c.OrderType == orderType.Value);
        }
        if (pending == true)
        {
            query = query.Where(c => !c.IsCompleted);
        }

        var result = query
            .OrderByDescending(c => c.OrderedAt)
            .Select(SimpleMapper.Map<CareOrder, CareOrderReadDto>)
            .ToList();
        return Ok(result);
    }

    // Ward transfer (chuyển khoa): move the admission to another department, release the current bed
    // (flagged Cleaning) and, when a target bed is supplied, assign it (flagged Occupied) - all atomically.
    [HttpPost("{id:guid}/transfer")]
    [Authorize(Roles = "Nurse,Doctor,Admin")]
    public async Task<ActionResult<InpatientAdmissionReadDto>> Transfer(
        Guid id,
        TransferAdmissionDto dto,
        CancellationToken cancellationToken)
    {
        var admission = await _repository.GetByIdAsync(id, cancellationToken);
        if (admission is null)
        {
            return NotFound();
        }

        var now = DateTime.UtcNow;

        // Validate the target bed up front so we don't half-apply the transfer.
        Bed? targetBed = null;
        if (dto.BedId.HasValue)
        {
            targetBed = await _bedRepository.GetByIdAsync(dto.BedId.Value, cancellationToken);
            if (targetBed is null)
            {
                return NotFound(new { message = "Target bed not found." });
            }

            if (targetBed.Status != BedStatus.Available)
            {
                return BadRequest(new { message = $"Target bed is not available (current status: {targetBed.Status})." });
            }
        }

        // Release any still-open bed assignment for this admission and flag the bed for cleaning.
        var assignments = await _bedAssignmentRepository.ListAsync(a => a.AdmissionId == id, cancellationToken);
        foreach (var assignment in assignments)
        {
            if (assignment.ReleasedAt is null)
            {
                assignment.ReleasedAt = now;
                _bedAssignmentRepository.Update(assignment);

                var oldBed = await _bedRepository.GetByIdAsync(assignment.BedId, cancellationToken);
                if (oldBed is not null)
                {
                    oldBed.Status = BedStatus.Cleaning;
                    _bedRepository.Update(oldBed);
                }
            }
        }

        admission.DepartmentId = dto.DepartmentId;
        admission.Status = AdmissionStatus.Active;
        _repository.Update(admission);

        // Assign the new bed if one was provided.
        if (targetBed is not null)
        {
            var newAssignment = new BedAssignment
            {
                Id = Guid.NewGuid(),
                AdmissionId = admission.Id,
                BedId = targetBed.Id,
                AssignedAt = now
            };
            await _bedAssignmentRepository.AddAsync(newAssignment, cancellationToken);

            targetBed.Status = BedStatus.Occupied;
            _bedRepository.Update(targetBed);
        }

        await _repository.SaveChangesAsync(cancellationToken);

        var result = SimpleMapper.Map<InpatientAdmission, InpatientAdmissionReadDto>(admission);
        return Ok(result);
    }
}

public class LabOrdersController : CrudController<LabOrder, LabOrderReadDto, LabOrderWriteDto>
{
    private readonly IRepository<LabOrder> _repository;
    private readonly IRepository<LabResult> _resultRepository;

    public LabOrdersController(
        ICrudService<LabOrder, LabOrderReadDto, LabOrderWriteDto> service,
        IRepository<LabOrder> repository,
        IRepository<LabResult> resultRepository)
        : base(service)
    {
        _repository = repository;
        _resultRepository = resultRepository;
    }

    // F3: doctors (Bác sĩ) raise the lab / imaging order.
    [HttpPost]
    [Authorize(Roles = "Doctor,Admin")]
    public override Task<ActionResult<LabOrderReadDto>> Create(
        [FromBody] LabOrderWriteDto dto,
        CancellationToken cancellationToken)
        => base.Create(dto, cancellationToken);

    // Lab department receives incoming orders; ordering doctor polls their own results.
    [HttpGet("filter")]
    public async Task<ActionResult<IReadOnlyList<LabOrderReadDto>>> Filter(
        [FromQuery] LabOrderStatus? status,
        [FromQuery] Guid? orderedById,
        CancellationToken cancellationToken)
    {
        var orders = await _repository.GetAllAsync(cancellationToken);

        var query = orders.AsEnumerable();
        if (status.HasValue)
        {
            query = query.Where(o => o.Status == status.Value);
        }
        if (orderedById.HasValue)
        {
            query = query.Where(o => o.OrderedById == orderedById.Value);
        }

        var result = query
            .OrderByDescending(o => o.OrderedAt)
            .Select(SimpleMapper.Map<LabOrder, LabOrderReadDto>)
            .ToList();
        return Ok(result);
    }

    // Lab department (Bộ phận xét nghiệm) advances the order through its workflow.
    [HttpPatch("{id:guid}/status")]
    [Authorize(Roles = "Lab,Admin")]
    public async Task<IActionResult> UpdateStatus(
        Guid id,
        StatusUpdateDto<LabOrderStatus> dto,
        CancellationToken cancellationToken)
    {
        var order = await _repository.GetByIdAsync(id, cancellationToken);
        if (order is null)
        {
            return NotFound();
        }

        order.Status = dto.Status;
        _repository.Update(order);
        await _repository.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    // Lab enters a result for an order; the order is auto-completed so it surfaces on the doctor's screen.
    [HttpPost("{id:guid}/result")]
    [Authorize(Roles = "Lab,Admin")]
    public async Task<ActionResult<LabResultReadDto>> EnterResult(
        Guid id,
        LabResultEntryDto dto,
        CancellationToken cancellationToken)
    {
        var order = await _repository.GetByIdAsync(id, cancellationToken);
        if (order is null)
        {
            return NotFound();
        }

        var result = new LabResult
        {
            LabOrderId = id,
            ResultText = dto.ResultText,
            ResultedAt = DateTime.UtcNow
        };
        await _resultRepository.AddAsync(result, cancellationToken);

        order.Status = LabOrderStatus.Completed;
        _repository.Update(order);
        await _repository.SaveChangesAsync(cancellationToken);

        var read = SimpleMapper.Map<LabResult, LabResultReadDto>(result);
        return CreatedAtAction(nameof(GetResults), new { id }, read);
    }

    [HttpGet("{id:guid}/result")]
    public async Task<ActionResult<IReadOnlyList<LabResultReadDto>>> GetResults(
        Guid id,
        CancellationToken cancellationToken)
    {
        var order = await _repository.GetByIdAsync(id, cancellationToken);
        if (order is null)
        {
            return NotFound();
        }

        var results = await _resultRepository.ListAsync(r => r.LabOrderId == id, cancellationToken);
        var read = results
            .OrderByDescending(r => r.ResultedAt)
            .Select(SimpleMapper.Map<LabResult, LabResultReadDto>)
            .ToList();
        return Ok(read);
    }
}

public class LabResultsController : CrudController<LabResult, LabResultReadDto, LabResultWriteDto>
{
    private static readonly string[] AllowedExtensions = { ".pdf", ".jpg", ".jpeg", ".png" };
    private const long MaxFileSizeBytes = 10 * 1024 * 1024; // 10 MB

    private readonly IRepository<LabResult> _repository;
    private readonly IWebHostEnvironment _environment;

    public LabResultsController(
        ICrudService<LabResult, LabResultReadDto, LabResultWriteDto> service,
        IRepository<LabResult> repository,
        IWebHostEnvironment environment)
        : base(service)
    {
        _repository = repository;
        _environment = environment;
    }

    // F3: lab department uploads the scanned result image / PDF.
    [HttpPost("{id:guid}/file")]
    [Authorize(Roles = "Lab,Admin")]
    public async Task<ActionResult<LabResultReadDto>> UploadFile(Guid id, IFormFile file, CancellationToken cancellationToken)
    {
        if (file is null || file.Length == 0)
        {
            return BadRequest(new { message = "File is required." });
        }

        if (file.Length > MaxFileSizeBytes)
        {
            return BadRequest(new { message = "File exceeds the 10 MB limit." });
        }

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!AllowedExtensions.Contains(extension))
        {
            return BadRequest(new { message = "Only PDF, JPG and PNG files are allowed." });
        }

        var result = await _repository.GetByIdAsync(id, cancellationToken);
        if (result is null)
        {
            return NotFound();
        }

        var webRoot = _environment.WebRootPath ?? Path.Combine(_environment.ContentRootPath, "wwwroot");
        var folder = Path.Combine(webRoot, "uploads", "lab-results", id.ToString());
        Directory.CreateDirectory(folder);

        var storedFileName = $"{Guid.NewGuid()}{extension}";
        var fullPath = Path.Combine(folder, storedFileName);
        await using (var stream = new FileStream(fullPath, FileMode.Create))
        {
            await file.CopyToAsync(stream, cancellationToken);
        }

        result.ResultFileUrl = $"/uploads/lab-results/{id}/{storedFileName}";
        if (result.ResultedAt is null)
        {
            result.ResultedAt = DateTime.UtcNow;
        }
        _repository.Update(result);
        await _repository.SaveChangesAsync(cancellationToken);

        return Ok(SimpleMapper.Map<LabResult, LabResultReadDto>(result));
    }
}

public class MedicalServicesController : CrudController<MedicalService, MedicalServiceReadDto, MedicalServiceWriteDto>
{
    private readonly IRepository<MedicalService> _serviceRepository;

    public MedicalServicesController(
        ICrudService<MedicalService, MedicalServiceReadDto, MedicalServiceWriteDto> service,
        IRepository<MedicalService> serviceRepository)
        : base(service)
    {
        _serviceRepository = serviceRepository;
    }

    /// <summary>
    /// Cập nhật giá khám cho một dịch vụ y tế.
    /// </summary>
    [HttpPatch("{id:guid}/price")]
    public async Task<IActionResult> UpdatePrice(
        Guid id,
        [FromBody] PriceUpdateDto dto,
        CancellationToken cancellationToken)
    {
        var service = await _serviceRepository.GetByIdAsync(id, cancellationToken);
        if (service is null)
            return NotFound();

        service.Price = dto.Price;
        _serviceRepository.Update(service);
        await _serviceRepository.SaveChangesAsync(cancellationToken);
        return NoContent();
    }
}

public class OutpatientVisitsController : CrudController<OutpatientVisit, OutpatientVisitReadDto, OutpatientVisitWriteDto>
{
    private readonly IRepository<OutpatientVisit> _repository;

    public OutpatientVisitsController(
        ICrudService<OutpatientVisit, OutpatientVisitReadDto, OutpatientVisitWriteDto> service,
        IRepository<OutpatientVisit> repository)
        : base(service)
    {
        _repository = repository;
    }

    [HttpPatch("{id:guid}/status")]
    public async Task<IActionResult> UpdateStatus(
        Guid id,
        StatusUpdateDto<VisitStatus> dto,
        CancellationToken cancellationToken)
    {
        var visit = await _repository.GetByIdAsync(id, cancellationToken);
        if (visit is null)
        {
            return NotFound();
        }

        visit.Status = dto.Status;
        _repository.Update(visit);
        await _repository.SaveChangesAsync(cancellationToken);
        return NoContent();
    }
}

public class PaymentsController : CrudController<Payment, PaymentReadDto, PaymentWriteDto>
{
    private readonly IRepository<Payment> _repository;

    public PaymentsController(ICrudService<Payment, PaymentReadDto, PaymentWriteDto> service, IRepository<Payment> repository)
        : base(service)
    {
        _repository = repository;
    }

    [HttpPost("{id:guid}/confirm")]
    public async Task<IActionResult> Confirm(Guid id, CancellationToken cancellationToken)
    {
        var payment = await _repository.GetByIdAsync(id, cancellationToken);
        if (payment is null)
        {
            return NotFound();
        }

        payment.Status = PaymentStatus.Paid;
        payment.PaidAt = DateTime.UtcNow;
        _repository.Update(payment);
        await _repository.SaveChangesAsync(cancellationToken);
        return NoContent();
    }
}

public class PrescriptionsController : CrudController<Prescription, PrescriptionReadDto, PrescriptionWriteDto>
{
    public PrescriptionsController(ICrudService<Prescription, PrescriptionReadDto, PrescriptionWriteDto> service)
        : base(service)
    {
    }
}

public class PrescriptionItemsController : CrudController<PrescriptionItem, PrescriptionItemReadDto, PrescriptionItemWriteDto>
{
    public PrescriptionItemsController(ICrudService<PrescriptionItem, PrescriptionItemReadDto, PrescriptionItemWriteDto> service)
        : base(service)
    {
    }
}

public class QueueTicketsController : CrudController<QueueTicket, QueueTicketReadDto, QueueTicketWriteDto>
{
    private readonly IRepository<QueueTicket> _repository;

    public QueueTicketsController(
        ICrudService<QueueTicket, QueueTicketReadDto, QueueTicketWriteDto> service,
        IRepository<QueueTicket> repository)
        : base(service)
    {
        _repository = repository;
    }

    [HttpPatch("{id:guid}/status")]
    public async Task<IActionResult> UpdateStatus(
        Guid id,
        StatusUpdateDto<QueueStatus> dto,
        CancellationToken cancellationToken)
    {
        var ticket = await _repository.GetByIdAsync(id, cancellationToken);
        if (ticket is null)
        {
            return NotFound();
        }

        ticket.Status = dto.Status;
        _repository.Update(ticket);
        await _repository.SaveChangesAsync(cancellationToken);
        return NoContent();
    }
}

public class TelemedicineSessionsController : CrudController<TelemedicineSession, TelemedicineSessionReadDto, TelemedicineSessionWriteDto>
{
    private readonly IRepository<TelemedicineSession> _repository;

    public TelemedicineSessionsController(
        ICrudService<TelemedicineSession, TelemedicineSessionReadDto, TelemedicineSessionWriteDto> service,
        IRepository<TelemedicineSession> repository)
        : base(service)
    {
        _repository = repository;
    }

    [HttpPatch("{id:guid}/start")]
    public async Task<IActionResult> Start(Guid id, CancellationToken cancellationToken)
    {
        var session = await _repository.GetByIdAsync(id, cancellationToken);
        if (session is null)
        {
            return NotFound();
        }

        session.StartedAt = DateTime.UtcNow;
        _repository.Update(session);
        await _repository.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    [HttpPatch("{id:guid}/end")]
    public async Task<IActionResult> End(Guid id, CancellationToken cancellationToken)
    {
        var session = await _repository.GetByIdAsync(id, cancellationToken);
        if (session is null)
        {
            return NotFound();
        }

        session.EndedAt = DateTime.UtcNow;
        _repository.Update(session);
        await _repository.SaveChangesAsync(cancellationToken);
        return NoContent();
    }
}

public class VitalSignsController : CrudController<VitalSign, VitalSignReadDto, VitalSignWriteDto>
{
    public VitalSignsController(ICrudService<VitalSign, VitalSignReadDto, VitalSignWriteDto> service)
        : base(service)
    {
    }

    // F2: nurses (Y tá) record the patient's daily vital signs at the bedside.
    [HttpPost]
    [Authorize(Roles = "Nurse,Admin")]
    public override Task<ActionResult<VitalSignReadDto>> Create(
        [FromBody] VitalSignWriteDto dto,
        CancellationToken cancellationToken)
        => base.Create(dto, cancellationToken);
}
