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

    [HttpPatch("{id:guid}/status")]
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

    public BedAssignmentsController(
        ICrudService<BedAssignment, BedAssignmentReadDto, BedAssignmentWriteDto> service,
        IRepository<BedAssignment> repository)
        : base(service)
    {
        _repository = repository;
    }

    [HttpPatch("{id:guid}/release")]
    public async Task<IActionResult> Release(Guid id, CancellationToken cancellationToken)
    {
        var assignment = await _repository.GetByIdAsync(id, cancellationToken);
        if (assignment is null)
        {
            return NotFound();
        }

        assignment.ReleasedAt = DateTime.UtcNow;
        _repository.Update(assignment);
        await _repository.SaveChangesAsync(cancellationToken);
        return NoContent();
    }
}

public class BillingInvoicesController : CrudController<BillingInvoice, BillingInvoiceReadDto, BillingInvoiceWriteDto>
{
    private readonly IRepository<BillingItem> _billingItemRepository;
    private readonly IBillingService _billingService;

    public BillingInvoicesController(
        ICrudService<BillingInvoice, BillingInvoiceReadDto, BillingInvoiceWriteDto> service,
        IRepository<BillingItem> billingItemRepository,
        IBillingService billingService)
        : base(service)
    {
        _billingItemRepository = billingItemRepository;
        _billingService = billingService;
    }

    /// <summary>
    /// Tự động gom chi phí khám + xét nghiệm + thuốc của một lần khám thành phiếu thu tổng.
    /// </summary>
    [HttpPost("generate")]
    public async Task<ActionResult<BillingInvoiceDetailDto>> Generate(
        GenerateInvoiceRequestDto dto,
        CancellationToken cancellationToken)
    {
        try
        {
            var result = await _billingService.GenerateInvoiceAsync(dto, cancellationToken);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
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

    /// <summary>
    /// Nhập/cập nhật mã thẻ BHYT và tính lại mức khấu trừ bảo hiểm cho phiếu thu.
    /// </summary>
    [HttpPost("{id:guid}/calculate-insurance")]
    public async Task<ActionResult<BillingInvoiceDetailDto>> CalculateInsurance(
        Guid id,
        InsuranceCalculationRequestDto dto,
        CancellationToken cancellationToken)
    {
        try
        {
            var result = await _billingService.CalculateInsuranceAsync(id, dto.InsuranceNumber, cancellationToken);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { message = ex.Message });
        }
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

    [HttpPatch("{id:guid}/complete")]
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
    private readonly IRepository<InpatientAdmission> _repository;
    private readonly IRepository<DischargeSummary> _dischargeRepository;
    private readonly IRepository<BedAssignment> _bedAssignmentRepository;

    public InpatientAdmissionsController(
        ICrudService<InpatientAdmission, InpatientAdmissionReadDto, InpatientAdmissionWriteDto> service,
        IRepository<InpatientAdmission> repository,
        IRepository<DischargeSummary> dischargeRepository,
        IRepository<BedAssignment> bedAssignmentRepository)
        : base(service)
    {
        _repository = repository;
        _dischargeRepository = dischargeRepository;
        _bedAssignmentRepository = bedAssignmentRepository;
    }

    [HttpPatch("{id:guid}/status")]
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

    [HttpPost("{id:guid}/discharge")]
    public async Task<ActionResult<DischargeSummaryReadDto>> Discharge(
        Guid id,
        CancellationToken cancellationToken)
    {
        var admission = await _repository.GetByIdAsync(id, cancellationToken);
        if (admission is null)
        {
            return NotFound();
        }

        admission.Status = AdmissionStatus.Discharged;
        _repository.Update(admission);

        var summary = new DischargeSummary
        {
            AdmissionId = id,
            DischargeDate = DateTime.UtcNow
        };

        await _dischargeRepository.AddAsync(summary, cancellationToken);
        await _repository.SaveChangesAsync(cancellationToken);

        var result = SimpleMapper.Map<DischargeSummary, DischargeSummaryReadDto>(summary);
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

    [HttpPost("{id:guid}/transfer")]
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

        admission.DepartmentId = dto.DepartmentId;
        admission.Status = AdmissionStatus.Active;
        _repository.Update(admission);
        await _repository.SaveChangesAsync(cancellationToken);

        var result = SimpleMapper.Map<InpatientAdmission, InpatientAdmissionReadDto>(admission);
        return Ok(result);
    }
}

public class LabOrdersController : CrudController<LabOrder, LabOrderReadDto, LabOrderWriteDto>
{
    public LabOrdersController(ICrudService<LabOrder, LabOrderReadDto, LabOrderWriteDto> service)
        : base(service)
    {
    }
}

public class LabResultsController : CrudController<LabResult, LabResultReadDto, LabResultWriteDto>
{
    private readonly IRepository<LabResult> _repository;

    public LabResultsController(
        ICrudService<LabResult, LabResultReadDto, LabResultWriteDto> service,
        IRepository<LabResult> repository)
        : base(service)
    {
        _repository = repository;
    }

    [HttpPost("{id:guid}/file")]
    public async Task<IActionResult> UploadFile(Guid id, IFormFile file, CancellationToken cancellationToken)
    {
        if (file is null || file.Length == 0)
        {
            return BadRequest(new { message = "File is required." });
        }

        var result = await _repository.GetByIdAsync(id, cancellationToken);
        if (result is null)
        {
            return NotFound();
        }

        result.ResultFileUrl = $"/uploads/lab-results/{id}/{file.FileName}";
        _repository.Update(result);
        await _repository.SaveChangesAsync(cancellationToken);
        return NoContent();
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
    private readonly IPaymentGatewayService _gateway;

    public PaymentsController(
        ICrudService<Payment, PaymentReadDto, PaymentWriteDto> service,
        IRepository<Payment> repository,
        IPaymentGatewayService gateway)
        : base(service)
    {
        _repository = repository;
        _gateway = gateway;
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

    /// <summary>Tạo link thanh toán VNPay cho một Payment đã tồn tại (Method = VnPay).</summary>
    [HttpPost("{id:guid}/vnpay-url")]
    public async Task<ActionResult<PaymentUrlResultDto>> CreateVnPayUrl(Guid id, CancellationToken cancellationToken)
    {
        var payment = await _repository.GetByIdAsync(id, cancellationToken);
        if (payment is null)
        {
            return NotFound();
        }

        var ip = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1";
        var url = _gateway.CreateVnPayUrl(payment, ip);
        return Ok(new PaymentUrlResultDto { PaymentId = payment.Id, PaymentUrl = url });
    }

    /// <summary>Tạo link thanh toán Momo cho một Payment đã tồn tại (Method = Momo).</summary>
    [HttpPost("{id:guid}/momo-url")]
    public async Task<ActionResult<PaymentUrlResultDto>> CreateMomoUrl(Guid id, CancellationToken cancellationToken)
    {
        var payment = await _repository.GetByIdAsync(id, cancellationToken);
        if (payment is null)
        {
            return NotFound();
        }

        var url = _gateway.CreateMomoUrl(payment);
        return Ok(new PaymentUrlResultDto { PaymentId = payment.Id, PaymentUrl = url });
    }

    /// <summary>
    /// VNPay redirect trình duyệt về endpoint này sau khi thanh toán (không có Bearer token).
    /// Xác thực chữ ký, cập nhật trạng thái Payment tương ứng.
    /// </summary>
    [HttpGet("vnpay-return")]
    [AllowAnonymous]
    public async Task<IActionResult> VnPayReturn(CancellationToken cancellationToken)
    {
        var queryParams = Request.Query.ToDictionary(kv => kv.Key, kv => kv.Value.ToString());
        var result = _gateway.ValidateVnPayReturn(queryParams);

        if (!result.IsValidSignature)
        {
            return BadRequest(new { message = result.Message });
        }

        if (!Guid.TryParse(result.TxnRef, out var paymentId))
        {
            return BadRequest(new { message = "Invalid vnp_TxnRef" });
        }

        var payment = await _repository.GetByIdAsync(paymentId, cancellationToken);
        if (payment is null)
        {
            return NotFound();
        }

        payment.Status = result.IsSuccess ? PaymentStatus.Paid : PaymentStatus.Failed;
        payment.TransactionRef = result.TransactionNo;
        if (result.IsSuccess)
        {
            payment.PaidAt = DateTime.UtcNow;
        }
        _repository.Update(payment);
        await _repository.SaveChangesAsync(cancellationToken);

        return Ok(new { message = result.Message, paymentId = payment.Id, status = payment.Status });
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

public class ServiceRatingsController : CrudController<ServiceRating, ServiceRatingReadDto, ServiceRatingWriteDto>
{
    private readonly IRepository<ServiceRating> _repository;

    public ServiceRatingsController(
        ICrudService<ServiceRating, ServiceRatingReadDto, ServiceRatingWriteDto> service,
        IRepository<ServiceRating> repository)
        : base(service)
    {
        _repository = repository;
    }

    /// <summary>Điểm đánh giá trung bình và tổng số lượt đánh giá của một bác sĩ.</summary>
    [HttpGet("doctor/{doctorId:guid}/summary")]
    public async Task<ActionResult<DoctorRatingSummaryDto>> GetDoctorSummary(Guid doctorId, CancellationToken cancellationToken)
    {
        var ratings = await _repository.ListAsync(r => r.DoctorId == doctorId, cancellationToken);

        return Ok(new DoctorRatingSummaryDto
        {
            DoctorId = doctorId,
            TotalRatings = ratings.Count,
            AverageScore = ratings.Count == 0 ? 0 : Math.Round(ratings.Average(r => r.Score), 2)
        });
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
}
