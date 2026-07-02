namespace Mediconnect.Domain.Entities;

public enum UserRole
{
    Patient,
    Doctor,
    Nurse,
    Admin,
    Lab
}

public enum StaffType
{
    Doctor,
    Nurse,
    Admin
}

public enum Gender
{
    Unknown,
    Male,
    Female,
    Other
}

public enum AppointmentStatus
{
    Requested,
    Confirmed,
    CheckedIn,
    Completed,
    Cancelled
}

public enum QueueStatus
{
    Waiting,
    InProgress,
    Skipped,
    Completed,
    Cancelled
}

public enum VisitStatus
{
    Waiting,
    InProgress,
    Completed,
    Cancelled
}

public enum LabOrderStatus
{
    Ordered,
    InProgress,
    Completed,
    Cancelled
}

public enum BedStatus
{
    Available,
    Occupied,
    Cleaning,
    OutOfService
}

public enum AdmissionStatus
{
    Active,
    Discharged,
    Transferred,
    Cancelled
}

public enum CareOrderType
{
    Medication,
    Infusion,
    Diet,
    Procedure,
    Other
}

public enum InvoiceStatus
{
    Draft,
    Pending,
    Paid,
    Cancelled
}

public enum PaymentMethod
{
    Cash,
    VnPay,
    Momo,
    BankTransfer
}

public enum PaymentStatus
{
    Pending,
    Paid,
    Failed,
    Refunded
}

public enum BillingItemType
{
    Service,
    Lab,
    Drug,
    Bed,
    Procedure,
    Other
}
