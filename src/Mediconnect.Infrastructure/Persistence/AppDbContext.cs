using System.Linq;
using Mediconnect.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Mediconnect.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<BillingInvoice>().Property(x => x.Subtotal).HasPrecision(18, 2);
        modelBuilder.Entity<BillingInvoice>().Property(x => x.InsuranceDeduction).HasPrecision(18, 2);
        modelBuilder.Entity<BillingInvoice>().Property(x => x.TotalAmount).HasPrecision(18, 2);

        modelBuilder.Entity<BillingItem>().Property(x => x.UnitPrice).HasPrecision(18, 2);
        modelBuilder.Entity<BillingItem>().Property(x => x.Amount).HasPrecision(18, 2);

        modelBuilder.Entity<DischargeSummary>().Property(x => x.TotalCost).HasPrecision(18, 2);
        modelBuilder.Entity<Drug>().Property(x => x.UnitPrice).HasPrecision(18, 2);
        modelBuilder.Entity<MedicalService>().Property(x => x.Price).HasPrecision(18, 2);
        modelBuilder.Entity<Payment>().Property(x => x.Amount).HasPrecision(18, 2);

        modelBuilder.Entity<PatientProfile>().Property(x => x.HeightCm).HasPrecision(6, 2);
        modelBuilder.Entity<PatientProfile>().Property(x => x.WeightKg).HasPrecision(6, 2);
        modelBuilder.Entity<VitalSign>().Property(x => x.TemperatureC).HasPrecision(5, 2);

        foreach (var foreignKey in modelBuilder.Model.GetEntityTypes().SelectMany(e => e.GetForeignKeys()))
        {
            foreignKey.DeleteBehavior = DeleteBehavior.Restrict;
        }

        modelBuilder.Entity<StaffSchedule>()
            .HasIndex(s => new { s.StaffId, s.ShiftDate, s.ShiftType })
            .IsUnique();
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
