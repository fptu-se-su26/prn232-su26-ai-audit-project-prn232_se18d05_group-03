using Mediconnect.Models;
using Microsoft.EntityFrameworkCore;

namespace Mediconnect.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<UserAccount> UserAccounts => Set<UserAccount>();
    public DbSet<PatientProfile> PatientProfiles => Set<PatientProfile>();
    public DbSet<StaffProfile> StaffProfiles => Set<StaffProfile>();
    public DbSet<Department> Departments => Set<Department>();
    public DbSet<Clinic> Clinics => Set<Clinic>();
    public DbSet<MedicalService> MedicalServices => Set<MedicalService>();
    public DbSet<Appointment> Appointments => Set<Appointment>();
    public DbSet<QueueTicket> QueueTickets => Set<QueueTicket>();
    public DbSet<OutpatientVisit> OutpatientVisits => Set<OutpatientVisit>();
    public DbSet<LabOrder> LabOrders => Set<LabOrder>();
    public DbSet<LabResult> LabResults => Set<LabResult>();
    public DbSet<Drug> Drugs => Set<Drug>();
    public DbSet<DrugInteraction> DrugInteractions => Set<DrugInteraction>();
    public DbSet<Prescription> Prescriptions => Set<Prescription>();
    public DbSet<PrescriptionItem> PrescriptionItems => Set<PrescriptionItem>();
    public DbSet<InpatientAdmission> InpatientAdmissions => Set<InpatientAdmission>();
    public DbSet<Bed> Beds => Set<Bed>();
    public DbSet<BedAssignment> BedAssignments => Set<BedAssignment>();
    public DbSet<VitalSign> VitalSigns => Set<VitalSign>();
    public DbSet<CareOrder> CareOrders => Set<CareOrder>();
    public DbSet<DischargeSummary> DischargeSummaries => Set<DischargeSummary>();
    public DbSet<BillingInvoice> BillingInvoices => Set<BillingInvoice>();
    public DbSet<BillingItem> BillingItems => Set<BillingItem>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<TelemedicineSession> TelemedicineSessions => Set<TelemedicineSession>();
    public DbSet<StaffSchedule> StaffSchedules => Set<StaffSchedule>();
}
