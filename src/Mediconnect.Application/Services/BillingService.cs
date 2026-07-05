using Mediconnect.Application.DTOs;
using Mediconnect.Application.Interfaces;
using Mediconnect.Application.Mapping;
using Mediconnect.Domain.Entities;

namespace Mediconnect.Application.Services;

public class BillingService : IBillingService
{
    // BHYT đúng tuyến tại tuyến cơ sở (mức phổ biến nhất) - đơn giản hóa cho phạm vi đồ án.
    private const decimal InsuranceCoverageRate = 0.8m;

    // Giá xét nghiệm mặc định khi không tìm thấy MedicalService trùng tên - đơn giản hóa cho phạm vi đồ án.
    private const decimal DefaultLabFee = 100_000m;

    private readonly IRepository<BillingInvoice> _invoiceRepository;
    private readonly IRepository<BillingItem> _billingItemRepository;
    private readonly IRepository<OutpatientVisit> _visitRepository;
    private readonly IRepository<LabOrder> _labOrderRepository;
    private readonly IRepository<Prescription> _prescriptionRepository;
    private readonly IRepository<PrescriptionItem> _prescriptionItemRepository;
    private readonly IRepository<Drug> _drugRepository;
    private readonly IRepository<MedicalService> _medicalServiceRepository;
    private readonly IRepository<PatientProfile> _patientRepository;

    public BillingService(
        IRepository<BillingInvoice> invoiceRepository,
        IRepository<BillingItem> billingItemRepository,
        IRepository<OutpatientVisit> visitRepository,
        IRepository<LabOrder> labOrderRepository,
        IRepository<Prescription> prescriptionRepository,
        IRepository<PrescriptionItem> prescriptionItemRepository,
        IRepository<Drug> drugRepository,
        IRepository<MedicalService> medicalServiceRepository,
        IRepository<PatientProfile> patientRepository)
    {
        _invoiceRepository = invoiceRepository;
        _billingItemRepository = billingItemRepository;
        _visitRepository = visitRepository;
        _labOrderRepository = labOrderRepository;
        _prescriptionRepository = prescriptionRepository;
        _prescriptionItemRepository = prescriptionItemRepository;
        _drugRepository = drugRepository;
        _medicalServiceRepository = medicalServiceRepository;
        _patientRepository = patientRepository;
    }

    public async Task<BillingInvoiceDetailDto> GenerateInvoiceAsync(GenerateInvoiceRequestDto dto, CancellationToken cancellationToken = default)
    {
        var visit = await _visitRepository.GetByIdAsync(dto.OutpatientVisitId, cancellationToken)
            ?? throw new InvalidOperationException("Outpatient visit not found.");

        var patient = await _patientRepository.GetByIdAsync(visit.PatientId, cancellationToken)
            ?? throw new InvalidOperationException("Patient not found.");

        var invoice = new BillingInvoice
        {
            Id = Guid.NewGuid(),
            PatientId = visit.PatientId,
            CreatedAt = DateTime.UtcNow,
            Status = InvoiceStatus.Draft
        };
        await _invoiceRepository.AddAsync(invoice, cancellationToken);

        var items = new List<BillingItem>();

        if (dto.ExamServiceId.HasValue)
        {
            var service = await _medicalServiceRepository.GetByIdAsync(dto.ExamServiceId.Value, cancellationToken);
            if (service is not null)
            {
                items.Add(BuildItem(invoice.Id, BillingItemType.Service, $"Phí khám - {service.Name}", 1, service.Price));
            }
        }

        var labOrders = await _labOrderRepository.ListAsync(l => l.OutpatientVisitId == visit.Id, cancellationToken);
        if (labOrders.Count > 0)
        {
            var allServices = await _medicalServiceRepository.GetAllAsync(cancellationToken);
            foreach (var lab in labOrders)
            {
                var matchedService = allServices.FirstOrDefault(s =>
                    s.Name.Contains(lab.TestName, StringComparison.OrdinalIgnoreCase)
                    || lab.TestName.Contains(s.Name, StringComparison.OrdinalIgnoreCase));
                var price = matchedService?.Price ?? DefaultLabFee;
                items.Add(BuildItem(invoice.Id, BillingItemType.Lab, $"Xét nghiệm - {lab.TestName}", 1, price));
            }
        }

        var prescriptions = await _prescriptionRepository.ListAsync(p => p.OutpatientVisitId == visit.Id, cancellationToken);
        foreach (var prescription in prescriptions)
        {
            var prescriptionItems = await _prescriptionItemRepository.ListAsync(
                pi => pi.PrescriptionId == prescription.Id, cancellationToken);

            foreach (var prescriptionItem in prescriptionItems)
            {
                var drug = await _drugRepository.GetByIdAsync(prescriptionItem.DrugId, cancellationToken);
                if (drug is null) continue;

                items.Add(BuildItem(invoice.Id, BillingItemType.Drug, $"Thuốc - {drug.Name}", prescriptionItem.Quantity, drug.UnitPrice));
            }
        }

        foreach (var item in items)
        {
            await _billingItemRepository.AddAsync(item, cancellationToken);
        }

        invoice.Subtotal = items.Sum(i => i.Amount);
        await _invoiceRepository.SaveChangesAsync(cancellationToken);

        var insuranceNumber = string.IsNullOrWhiteSpace(dto.InsuranceNumber) ? patient.InsuranceNumber : dto.InsuranceNumber;
        return await CalculateInsuranceAsync(invoice.Id, insuranceNumber, cancellationToken);
    }

    public async Task<BillingInvoiceDetailDto> CalculateInsuranceAsync(Guid invoiceId, string? insuranceNumber, CancellationToken cancellationToken = default)
    {
        var invoice = await _invoiceRepository.GetByIdAsync(invoiceId, cancellationToken)
            ?? throw new InvalidOperationException("Invoice not found.");

        var effectiveInsuranceNumber = string.IsNullOrWhiteSpace(insuranceNumber) ? invoice.InsuranceNumber : insuranceNumber;
        var isValidBhyt = !string.IsNullOrWhiteSpace(effectiveInsuranceNumber) && effectiveInsuranceNumber.Trim().Length >= 10;

        invoice.InsuranceNumber = effectiveInsuranceNumber;
        invoice.InsuranceDeduction = isValidBhyt ? Math.Round(invoice.Subtotal * InsuranceCoverageRate, 0) : 0m;
        invoice.TotalAmount = invoice.Subtotal - invoice.InsuranceDeduction;
        invoice.Status = InvoiceStatus.Pending;

        _invoiceRepository.Update(invoice);
        await _invoiceRepository.SaveChangesAsync(cancellationToken);

        return await BuildDetailAsync(invoice, cancellationToken);
    }

    private static BillingItem BuildItem(Guid invoiceId, BillingItemType type, string description, int quantity, decimal unitPrice) => new()
    {
        Id = Guid.NewGuid(),
        BillingInvoiceId = invoiceId,
        ItemType = type,
        Description = description,
        Quantity = quantity,
        UnitPrice = unitPrice,
        Amount = quantity * unitPrice
    };

    private async Task<BillingInvoiceDetailDto> BuildDetailAsync(BillingInvoice invoice, CancellationToken cancellationToken)
    {
        var items = await _billingItemRepository.ListAsync(i => i.BillingInvoiceId == invoice.Id, cancellationToken);
        var detail = SimpleMapper.Map<BillingInvoice, BillingInvoiceDetailDto>(invoice);
        detail.Items = items.Select(SimpleMapper.Map<BillingItem, BillingItemReadDto>).ToList();
        return detail;
    }
}
