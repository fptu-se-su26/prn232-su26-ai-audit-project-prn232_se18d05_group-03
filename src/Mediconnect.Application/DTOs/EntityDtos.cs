using Mediconnect.Domain.Entities;

namespace Mediconnect.Application.DTOs;

public class AppointmentReadDto
{
    public Guid Id { get; set; }
    public Guid PatientId { get; set; }
    public Guid DoctorId { get; set; }
    public Guid ClinicId { get; set; }
    public DateTime AppointmentTime { get; set; }
    public AppointmentStatus Status { get; set; }
    public string? Reason { get; set; }
    public string? Notes { get; set; }
}

public class AppointmentWriteDto
{
    public Guid PatientId { get; set; }
    public Guid DoctorId { get; set; }
    public Guid ClinicId { get; set; }
    public DateTime AppointmentTime { get; set; }
    public AppointmentStatus Status { get; set; }
    public string? Reason { get; set; }
    public string? Notes { get; set; }
}

public class BedReadDto
{
    public Guid Id { get; set; }
    public Guid DepartmentId { get; set; }
    public string? Ward { get; set; }
    public string? RoomNumber { get; set; }
    public string? BedNumber { get; set; }
    public BedStatus Status { get; set; }
}

public class BedWriteDto
{
    public Guid DepartmentId { get; set; }
    public string? Ward { get; set; }
    public string? RoomNumber { get; set; }
    public string? BedNumber { get; set; }
    public BedStatus Status { get; set; }
}

public class BedAssignmentReadDto
{
    public Guid Id { get; set; }
    public Guid AdmissionId { get; set; }
    public Guid BedId { get; set; }
    public DateTime AssignedAt { get; set; }
    public DateTime? ReleasedAt { get; set; }
}

public class BedAssignmentWriteDto
{
    public Guid AdmissionId { get; set; }
    public Guid BedId { get; set; }
    public DateTime AssignedAt { get; set; }
    public DateTime? ReleasedAt { get; set; }
}

public class BillingInvoiceReadDto
{
    public Guid Id { get; set; }
    public Guid PatientId { get; set; }
    public DateTime CreatedAt { get; set; }
    public InvoiceStatus Status { get; set; }
    public decimal Subtotal { get; set; }
    public decimal InsuranceDeduction { get; set; }
    public decimal TotalAmount { get; set; }
    public string? InsuranceNumber { get; set; }
}

public class BillingInvoiceWriteDto
{
    public Guid PatientId { get; set; }
    public DateTime CreatedAt { get; set; }
    public InvoiceStatus Status { get; set; }
    public decimal Subtotal { get; set; }
    public decimal InsuranceDeduction { get; set; }
    public decimal TotalAmount { get; set; }
    public string? InsuranceNumber { get; set; }
}

public class BillingItemReadDto
{
    public Guid Id { get; set; }
    public Guid BillingInvoiceId { get; set; }
    public BillingItemType ItemType { get; set; }
    public string Description { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal Amount { get; set; }
}

public class BillingItemWriteDto
{
    public Guid BillingInvoiceId { get; set; }
    public BillingItemType ItemType { get; set; }
    public string Description { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal Amount { get; set; }
}

public class CareOrderReadDto
{
    public Guid Id { get; set; }
    public Guid AdmissionId { get; set; }
    public Guid OrderedById { get; set; }
    public CareOrderType OrderType { get; set; }
    public string Description { get; set; } = string.Empty;
    public DateTime OrderedAt { get; set; }
    public bool IsCompleted { get; set; }
    public DateTime? CompletedAt { get; set; }
}

public class CareOrderWriteDto
{
    public Guid AdmissionId { get; set; }
    public Guid OrderedById { get; set; }
    public CareOrderType OrderType { get; set; }
    public string Description { get; set; } = string.Empty;
    public DateTime OrderedAt { get; set; }
    public bool IsCompleted { get; set; }
    public DateTime? CompletedAt { get; set; }
}

public class ClinicReadDto
{
    public Guid Id { get; set; }
    public Guid DepartmentId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? RoomNumber { get; set; }
    public bool IsActive { get; set; }
}

public class ClinicWriteDto
{
    public Guid DepartmentId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? RoomNumber { get; set; }
    public bool IsActive { get; set; }
}

public class DepartmentReadDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Code { get; set; }
    public string? Description { get; set; }
}

public class DepartmentWriteDto
{
    public string Name { get; set; } = string.Empty;
    public string? Code { get; set; }
    public string? Description { get; set; }
}

public class DischargeSummaryReadDto
{
    public Guid Id { get; set; }
    public Guid AdmissionId { get; set; }
    public DateTime DischargeDate { get; set; }
    public string? Summary { get; set; }
    public decimal? TotalCost { get; set; }
}

public class DischargeSummaryWriteDto
{
    public Guid AdmissionId { get; set; }
    public DateTime DischargeDate { get; set; }
    public string? Summary { get; set; }
    public decimal? TotalCost { get; set; }
}

public class DrugReadDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Code { get; set; }
    public string? Unit { get; set; }
    public int StockQuantity { get; set; }
    public decimal UnitPrice { get; set; }
    public bool IsActive { get; set; }
}

public class DrugWriteDto
{
    public string Name { get; set; } = string.Empty;
    public string? Code { get; set; }
    public string? Unit { get; set; }
    public int StockQuantity { get; set; }
    public decimal UnitPrice { get; set; }
    public bool IsActive { get; set; }
}

public class DrugInteractionReadDto
{
    public Guid Id { get; set; }
    public Guid DrugId { get; set; }
    public Guid InteractingDrugId { get; set; }
    public string? Severity { get; set; }
    public string? Description { get; set; }
}

public class DrugInteractionWriteDto
{
    public Guid DrugId { get; set; }
    public Guid InteractingDrugId { get; set; }
    public string? Severity { get; set; }
    public string? Description { get; set; }
}

public class InpatientAdmissionReadDto
{
    public Guid Id { get; set; }
    public Guid PatientId { get; set; }
    public Guid? FromOutpatientVisitId { get; set; }
    public Guid DepartmentId { get; set; }
    public DateTime AdmissionDate { get; set; }
    public AdmissionStatus Status { get; set; }
}

public class InpatientAdmissionWriteDto
{
    public Guid PatientId { get; set; }
    public Guid? FromOutpatientVisitId { get; set; }
    public Guid DepartmentId { get; set; }
    public DateTime AdmissionDate { get; set; }
    public AdmissionStatus Status { get; set; }
}

public class LabOrderReadDto
{
    public Guid Id { get; set; }
    public Guid OutpatientVisitId { get; set; }
    public Guid OrderedById { get; set; }
    public string TestName { get; set; } = string.Empty;
    public LabOrderStatus Status { get; set; }
    public DateTime OrderedAt { get; set; }
    public string? Notes { get; set; }
}

public class LabOrderWriteDto
{
    public Guid OutpatientVisitId { get; set; }
    public Guid OrderedById { get; set; }
    public string TestName { get; set; } = string.Empty;
    public LabOrderStatus Status { get; set; }
    public DateTime OrderedAt { get; set; }
    public string? Notes { get; set; }
}

public class LabResultReadDto
{
    public Guid Id { get; set; }
    public Guid LabOrderId { get; set; }
    public string? ResultText { get; set; }
    public string? ResultFileUrl { get; set; }
    public DateTime? ResultedAt { get; set; }
}

public class LabResultWriteDto
{
    public Guid LabOrderId { get; set; }
    public string? ResultText { get; set; }
    public string? ResultFileUrl { get; set; }
    public DateTime? ResultedAt { get; set; }
}

public class MedicalServiceReadDto
{
    public Guid Id { get; set; }
    public Guid DepartmentId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Code { get; set; }
    public decimal Price { get; set; }
    public bool IsActive { get; set; }
}

public class MedicalServiceWriteDto
{
    public Guid DepartmentId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Code { get; set; }
    public decimal Price { get; set; }
    public bool IsActive { get; set; }
}

public class OutpatientVisitReadDto
{
    public Guid Id { get; set; }
    public Guid PatientId { get; set; }
    public Guid DoctorId { get; set; }
    public Guid ClinicId { get; set; }
    public Guid? QueueTicketId { get; set; }
    public DateTime VisitDate { get; set; }
    public string? ChiefComplaint { get; set; }
    public string? DiagnosisCode { get; set; }
    public string? DiagnosisDescription { get; set; }
    public VisitStatus Status { get; set; }
    public string? Notes { get; set; }
}

public class OutpatientVisitWriteDto
{
    public Guid PatientId { get; set; }
    public Guid DoctorId { get; set; }
    public Guid ClinicId { get; set; }
    public Guid? QueueTicketId { get; set; }
    public DateTime VisitDate { get; set; }
    public string? ChiefComplaint { get; set; }
    public string? DiagnosisCode { get; set; }
    public string? DiagnosisDescription { get; set; }
    public VisitStatus Status { get; set; }
    public string? Notes { get; set; }
}

public class PatientProfileReadDto
{
    public Guid Id { get; set; }
    public Guid UserAccountId { get; set; }
    public DateOnly? DateOfBirth { get; set; }
    public Gender Gender { get; set; }
    public decimal? HeightCm { get; set; }
    public decimal? WeightKg { get; set; }
    public string? InsuranceNumber { get; set; }
    public string? Address { get; set; }
    public string? EmergencyContactName { get; set; }
    public string? EmergencyContactPhone { get; set; }
}

public class PatientProfileWriteDto
{
    public Guid UserAccountId { get; set; }
    public DateOnly? DateOfBirth { get; set; }
    public Gender Gender { get; set; }
    public decimal? HeightCm { get; set; }
    public decimal? WeightKg { get; set; }
    public string? InsuranceNumber { get; set; }
    public string? Address { get; set; }
    public string? EmergencyContactName { get; set; }
    public string? EmergencyContactPhone { get; set; }
}

public class PaymentReadDto
{
    public Guid Id { get; set; }
    public Guid BillingInvoiceId { get; set; }
    public PaymentMethod Method { get; set; }
    public decimal Amount { get; set; }
    public DateTime? PaidAt { get; set; }
    public PaymentStatus Status { get; set; }
    public string? TransactionRef { get; set; }
}

public class PaymentWriteDto
{
    public Guid BillingInvoiceId { get; set; }
    public PaymentMethod Method { get; set; }
    public decimal Amount { get; set; }
    public DateTime? PaidAt { get; set; }
    public PaymentStatus Status { get; set; }
    public string? TransactionRef { get; set; }
}

public class PrescriptionReadDto
{
    public Guid Id { get; set; }
    public Guid OutpatientVisitId { get; set; }
    public Guid DoctorId { get; set; }
    public DateTime IssuedAt { get; set; }
    public string? Notes { get; set; }
}

public class PrescriptionWriteDto
{
    public Guid OutpatientVisitId { get; set; }
    public Guid DoctorId { get; set; }
    public DateTime IssuedAt { get; set; }
    public string? Notes { get; set; }
}

public class PrescriptionItemReadDto
{
    public Guid Id { get; set; }
    public Guid PrescriptionId { get; set; }
    public Guid DrugId { get; set; }
    public string? Dose { get; set; }
    public string? Frequency { get; set; }
    public int DurationDays { get; set; }
    public int Quantity { get; set; }
}

public class PrescriptionItemWriteDto
{
    public Guid PrescriptionId { get; set; }
    public Guid DrugId { get; set; }
    public string? Dose { get; set; }
    public string? Frequency { get; set; }
    public int DurationDays { get; set; }
    public int Quantity { get; set; }
}

public class QueueTicketReadDto
{
    public Guid Id { get; set; }
    public Guid ClinicId { get; set; }
    public Guid? AppointmentId { get; set; }
    public int Number { get; set; }
    public DateTime IssuedAt { get; set; }
    public QueueStatus Status { get; set; }
}

public class QueueTicketWriteDto
{
    public Guid ClinicId { get; set; }
    public Guid? AppointmentId { get; set; }
    public int Number { get; set; }
    public DateTime IssuedAt { get; set; }
    public QueueStatus Status { get; set; }
}

public class StaffProfileReadDto
{
    public Guid Id { get; set; }
    public Guid UserAccountId { get; set; }
    public StaffType StaffType { get; set; }
    public Guid DepartmentId { get; set; }
    public string? Specialty { get; set; }
    public int YearsExperience { get; set; }
    public string? Degree { get; set; }
}

public class StaffProfileWriteDto
{
    public Guid UserAccountId { get; set; }
    public StaffType StaffType { get; set; }
    public Guid DepartmentId { get; set; }
    public string? Specialty { get; set; }
    public int YearsExperience { get; set; }
    public string? Degree { get; set; }
}

public class StaffScheduleReadDto
{
    public Guid Id { get; set; }
    public Guid StaffId { get; set; }
    public DateOnly ShiftDate { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
}

public class StaffScheduleWriteDto
{
    public Guid StaffId { get; set; }
    public DateOnly ShiftDate { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
}

public class TelemedicineSessionReadDto
{
    public Guid Id { get; set; }
    public Guid AppointmentId { get; set; }
    public Guid DoctorId { get; set; }
    public Guid PatientId { get; set; }
    public DateTime? StartedAt { get; set; }
    public DateTime? EndedAt { get; set; }
    public string? VideoCallUrl { get; set; }
    public string? Notes { get; set; }
}

public class TelemedicineSessionWriteDto
{
    public Guid AppointmentId { get; set; }
    public Guid DoctorId { get; set; }
    public Guid PatientId { get; set; }
    public DateTime? StartedAt { get; set; }
    public DateTime? EndedAt { get; set; }
    public string? VideoCallUrl { get; set; }
    public string? Notes { get; set; }
}

public class UserAccountReadDto
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public UserRole Role { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? VerifiedAt { get; set; }
}

public class UserAccountWriteDto
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string? Password { get; set; }
    public UserRole Role { get; set; }
    public bool IsActive { get; set; }
}

public class VitalSignReadDto
{
    public Guid Id { get; set; }
    public Guid AdmissionId { get; set; }
    public DateTime RecordedAt { get; set; }
    public int? Pulse { get; set; }
    public decimal? TemperatureC { get; set; }
    public int? BloodPressureSystolic { get; set; }
    public int? BloodPressureDiastolic { get; set; }
    public int? RespiratoryRate { get; set; }
    public int? SpO2 { get; set; }
}

public class VitalSignWriteDto
{
    public Guid AdmissionId { get; set; }
    public DateTime RecordedAt { get; set; }
    public int? Pulse { get; set; }
    public decimal? TemperatureC { get; set; }
    public int? BloodPressureSystolic { get; set; }
    public int? BloodPressureDiastolic { get; set; }
    public int? RespiratoryRate { get; set; }
    public int? SpO2 { get; set; }
}

public class BedMapGroupDto
{
    public BedStatus Status { get; set; }
    public int Count { get; set; }
    public IList<BedReadDto> Beds { get; set; } = new List<BedReadDto>();
}

public class TransferAdmissionDto
{
    public Guid DepartmentId { get; set; }
}

// Feature 3 - Lab / imaging results
public class LabResultEntryDto
{
    public string? ResultText { get; set; }
}

// Feature 4 - Discharge & aggregated billing
public class DischargeRequestDto
{
    public string? Summary { get; set; }
    public decimal InsuranceDeduction { get; set; }
}

public class DischargeResultDto
{
    public DischargeSummaryReadDto Summary { get; set; } = null!;
    public BillingInvoiceReadDto Invoice { get; set; } = null!;
    public IList<BillingItemReadDto> Items { get; set; } = new List<BillingItemReadDto>();
}
