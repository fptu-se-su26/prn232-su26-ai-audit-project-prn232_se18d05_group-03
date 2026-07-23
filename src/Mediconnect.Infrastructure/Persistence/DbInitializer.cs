using Mediconnect.Application.Interfaces;
using Mediconnect.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Mediconnect.Infrastructure.Persistence;

public class DbInitializer
{
    private readonly AppDbContext _context;
    private readonly IPasswordHasher _passwordHasher;

    public DbInitializer(AppDbContext context, IPasswordHasher passwordHasher)
    {
        _context = context;
        _passwordHasher = passwordHasher;
    }

    public async Task SeedAsync(CancellationToken cancellationToken = default)
    {
        await SeedCoreAsync(cancellationToken);
        await SeedBedsAsync(cancellationToken);
        await SeedCatalogAsync(cancellationToken);
    }

    // Service & drug catalog. Seeded independently of SeedCoreAsync so an existing database
    // (created before these rows existed) still gets back-filled on the next start-up.
    // Without this the Service-Management / pricing screen (Member 1 F1) shows an empty catalog
    // and the CDSS overdose check (Member 4 F2) has no dose thresholds to warn against.
    private async Task SeedCatalogAsync(CancellationToken cancellationToken)
    {
        // ── Demo accounts back-fill. The lab account was historically constructed but never
        //    persisted (omitted from the SeedCore AddRange), so databases created before the fix
        //    have no Lab user even though the login screen advertises it — the whole Lab persona
        //    (Member 3 F3 lab-result entry) was unreachable. Add any advertised demo account that
        //    is missing, idempotently, so existing DBs are healed on the next start-up.
        var demoAccounts = new (string Email, string Password, string FullName, UserRole Role)[]
        {
            ("admin@mediconnect.local",   "Admin@123",   "System Admin",   UserRole.Admin),
            ("doctor@mediconnect.local",  "Doctor@123",  "Dr. Minh Tran",  UserRole.Doctor),
            ("nurse@mediconnect.local",   "Nurse@123",   "Nurse Lan Pham", UserRole.Nurse),
            ("lab@mediconnect.local",     "Lab@123",     "Lab Tech Hoa Vo",UserRole.Lab),
            ("patient@mediconnect.local", "Patient@123", "Nguyen An",      UserRole.Patient),
        };
        var missing = new List<UserAccount>();
        foreach (var a in demoAccounts)
        {
            if (!await _context.UserAccounts.AnyAsync(u => u.Email == a.Email, cancellationToken))
            {
                missing.Add(new UserAccount
                {
                    Id = Guid.NewGuid(),
                    FullName = a.FullName,
                    Email = a.Email,
                    Role = a.Role,
                    IsActive = true,
                    PasswordHash = _passwordHasher.Hash(a.Password)
                });
            }
        }
        if (missing.Count > 0)
        {
            await _context.UserAccounts.AddRangeAsync(missing, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }

        // ── Medical services: seed a handful per department when the catalog is empty. ──
        if (!await _context.MedicalServices.AnyAsync(cancellationToken))
        {
            var departments = await _context.Departments.ToListAsync(cancellationToken);
            var services = new List<MedicalService>();
            foreach (var dept in departments)
            {
                var isCard = dept.Code == "CARD";
                services.Add(new MedicalService { Id = Guid.NewGuid(), DepartmentId = dept.Id, Name = $"Khám {dept.Name}", Code = $"{dept.Code}-KH", Price = isCard ? 250_000m : 150_000m, IsActive = true });
                services.Add(new MedicalService { Id = Guid.NewGuid(), DepartmentId = dept.Id, Name = $"Tái khám {dept.Name}", Code = $"{dept.Code}-TK", Price = isCard ? 150_000m : 100_000m, IsActive = true });
                if (isCard)
                {
                    services.Add(new MedicalService { Id = Guid.NewGuid(), DepartmentId = dept.Id, Name = "Điện tâm đồ (ECG)", Code = "CARD-ECG", Price = 200_000m, IsActive = true });
                    services.Add(new MedicalService { Id = Guid.NewGuid(), DepartmentId = dept.Id, Name = "Siêu âm tim", Code = "CARD-ECHO", Price = 400_000m, IsActive = true });
                }
                else
                {
                    services.Add(new MedicalService { Id = Guid.NewGuid(), DepartmentId = dept.Id, Name = "Xét nghiệm công thức máu", Code = "GEN-CBC", Price = 120_000m, IsActive = true });
                }
            }

            if (services.Count > 0)
            {
                await _context.MedicalServices.AddRangeAsync(services, cancellationToken);
                await _context.SaveChangesAsync(cancellationToken);
            }
        }

        // ── Drugs: seed a standard set when there is no active, priced drug to prescribe. ──
        // (An older build left a couple of zero-price/inactive placeholder rows behind; this
        //  back-fills real drugs — including CDSS dose thresholds — without touching those.)
        if (!await _context.Drugs.AnyAsync(d => d.IsActive && d.UnitPrice > 0, cancellationToken))
        {
            var drugs = new[]
            {
                new Drug { Id = Guid.NewGuid(), Name = "Paracetamol 500mg", Code = "PARA500", Unit = "viên", StockQuantity = 500, UnitPrice = 2_000m,  IsActive = true, MaxDailyDose = 4_000m, MaxDosePerKg = 60m },
                new Drug { Id = Guid.NewGuid(), Name = "Amoxicillin 500mg", Code = "AMOX500", Unit = "viên", StockQuantity = 300, UnitPrice = 3_500m,  IsActive = true, MaxDailyDose = 3_000m },
                new Drug { Id = Guid.NewGuid(), Name = "Diclofenac 50mg",   Code = "DICLO50", Unit = "viên", StockQuantity = 200, UnitPrice = 2_500m,  IsActive = true, MaxDailyDose = 150m, MaxDosePerKg = 2m },
                new Drug { Id = Guid.NewGuid(), Name = "Omeprazole 20mg",   Code = "OME20",   Unit = "viên", StockQuantity = 400, UnitPrice = 4_000m,  IsActive = true, MaxDailyDose = 40m },
                new Drug { Id = Guid.NewGuid(), Name = "Cetirizine 10mg",   Code = "CET10",   Unit = "viên", StockQuantity = 250, UnitPrice = 1_800m,  IsActive = true, MaxDailyDose = 10m },
                new Drug { Id = Guid.NewGuid(), Name = "Vitamin C 1000mg",  Code = "VITC1000",Unit = "viên", StockQuantity = 0,   UnitPrice = 1_200m,  IsActive = true },
            };
            await _context.Drugs.AddRangeAsync(drugs, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }

    private async Task SeedCoreAsync(CancellationToken cancellationToken)
    {
        if (await _context.Departments.AnyAsync(cancellationToken))
        {
            return;
        }

        var generalDeptId = Guid.NewGuid();
        var cardiologyDeptId = Guid.NewGuid();

        var departments = new[]
        {
            new Department
            {
                Id = generalDeptId,
                Name = "General Medicine",
                Code = "GEN",
                Description = "Primary care and general outpatient services"
            },
            new Department
            {
                Id = cardiologyDeptId,
                Name = "Cardiology",
                Code = "CARD",
                Description = "Cardiology clinic and inpatient care"
            }
        };

        var clinics = new[]
        {
            new Clinic
            {
                Id = Guid.NewGuid(),
                DepartmentId = generalDeptId,
                Name = "General Clinic",
                RoomNumber = "A101",
                IsActive = true
            },
            new Clinic
            {
                Id = Guid.NewGuid(),
                DepartmentId = cardiologyDeptId,
                Name = "Cardiology Clinic",
                RoomNumber = "B201",
                IsActive = true
            }
        };

        var adminUser = new UserAccount
        {
            Id = Guid.NewGuid(),
            FullName = "System Admin",
            Email = "admin@mediconnect.local",
            PhoneNumber = "0000000000",
            Role = UserRole.Admin,
            IsActive = true,
            PasswordHash = _passwordHasher.Hash("Admin@123")
        };

        var doctorUser = new UserAccount
        {
            Id = Guid.NewGuid(),
            FullName = "Dr. Minh Tran",
            Email = "doctor@mediconnect.local",
            PhoneNumber = "0900000000",
            Role = UserRole.Doctor,
            IsActive = true,
            PasswordHash = _passwordHasher.Hash("Doctor@123")
        };

        var nurseUser = new UserAccount
        {
            Id = Guid.NewGuid(),
            FullName = "Nurse Lan Pham",
            Email = "nurse@mediconnect.local",
            PhoneNumber = "0910000000",
            Role = UserRole.Nurse,
            IsActive = true,
            PasswordHash = _passwordHasher.Hash("Nurse@123")
        };

        var labUser = new UserAccount
        {
            Id = Guid.NewGuid(),
            FullName = "Lab Tech Hoa Vo",
            Email = "lab@mediconnect.local",
            PhoneNumber = "0930000000",
            Role = UserRole.Lab,
            IsActive = true,
            PasswordHash = _passwordHasher.Hash("Lab@123")
        };

        var staffProfiles = new[]
        {
            new StaffProfile
            {
                Id = Guid.NewGuid(),
                UserAccountId = doctorUser.Id,
                DepartmentId = cardiologyDeptId,
                StaffType = StaffType.Doctor,
                Specialty = "Cardiology",
                YearsExperience = 8,
                Degree = "MD"
            },
            new StaffProfile
            {
                Id = Guid.NewGuid(),
                UserAccountId = nurseUser.Id,
                DepartmentId = generalDeptId,
                StaffType = StaffType.Nurse,
                Specialty = "General Nursing",
                YearsExperience = 5,
                Degree = "BSN"
            }
        };

        var patientUser = new UserAccount
        {
            Id = Guid.NewGuid(),
            FullName = "Nguyen An",
            Email = "patient@mediconnect.local",
            PhoneNumber = "0920000000",
            Role = UserRole.Patient,
            IsActive = true,
            PasswordHash = _passwordHasher.Hash("Patient@123")
        };

        var patientProfile = new PatientProfile
        {
            Id = Guid.NewGuid(),
            UserAccountId = patientUser.Id,
            Gender = Gender.Male,
            DateOfBirth = new DateOnly(1995, 5, 12),
            HeightCm = 172.5m,
            WeightKg = 68.3m,
            Address = "Hanoi",
            InsuranceNumber = "BHYT-0001"
        };

        await _context.Departments.AddRangeAsync(departments, cancellationToken);
        await _context.Clinics.AddRangeAsync(clinics, cancellationToken);
        await _context.UserAccounts.AddRangeAsync(new[] { adminUser, doctorUser, nurseUser, labUser, patientUser }, cancellationToken);
        var today = DateOnly.FromDateTime(DateTime.Today);
        var staffSchedules = new[]
        {
            new StaffSchedule
            {
                Id = Guid.NewGuid(),
                StaffId = staffProfiles[0].Id,
                ShiftDate = today,
                ShiftType = ShiftType.Morning,
                StartTime = new TimeOnly(6, 0),
                EndTime = new TimeOnly(12, 0),
                WorkRoom = "B201"
            },
            new StaffSchedule
            {
                Id = Guid.NewGuid(),
                StaffId = staffProfiles[0].Id,
                ShiftDate = today.AddDays(1),
                ShiftType = ShiftType.Afternoon,
                StartTime = new TimeOnly(12, 0),
                EndTime = new TimeOnly(18, 0),
                WorkRoom = "B201"
            },
            new StaffSchedule
            {
                Id = Guid.NewGuid(),
                StaffId = staffProfiles[1].Id,
                ShiftDate = today,
                ShiftType = ShiftType.Evening,
                StartTime = new TimeOnly(18, 0),
                EndTime = new TimeOnly(23, 59),
                WorkRoom = "A101"
            }
        };

        await _context.StaffProfiles.AddRangeAsync(staffProfiles, cancellationToken);
        await _context.StaffSchedules.AddRangeAsync(staffSchedules, cancellationToken);
        await _context.PatientProfiles.AddAsync(patientProfile, cancellationToken);

        await _context.SaveChangesAsync(cancellationToken);
    }

    private async Task SeedBedsAsync(CancellationToken cancellationToken)
    {
        if (await _context.Beds.AnyAsync(cancellationToken)) return;

        var depts = await _context.Departments.ToListAsync(cancellationToken);
        if (depts.Count < 2) return;

        var beds = new List<Bed>();

        // Multi-floor layout: each department spans 3 floors; each floor has 2 wards
        // (Khu A / Khu B). Each ward has 4 rooms of mixed capacity [6, 3, 2, 1] beds so
        // the UI can show room types (Phòng thường / 3 giường / đôi / VIP). No coordinates —
        // the UI generates a realistic floor plan from the Ward → Room → Bed hierarchy.
        var capacities = new[] { 6, 3, 2, 1 };
        var statusCycle = new[]
        {
            BedStatus.Available, BedStatus.Occupied,     BedStatus.Available,
            BedStatus.Cleaning,  BedStatus.Available,    BedStatus.Available,
            BedStatus.Occupied,  BedStatus.OutOfService, BedStatus.Available
        };

        foreach (var dept in depts)
        {
            int deptOffset = dept == depts[0] ? 0 : 4;

            for (int floor = 1; floor <= 3; floor++)
            {
                foreach (var (wardName, wardLetter) in new[] { ("Khu A", 'A'), ("Khu B", 'B') })
                {
                    for (int r = 0; r < capacities.Length; r++)
                    {
                        string room = $"{dept.Code}-{floor}{wardLetter}{r + 1:D2}";
                        for (int b = 1; b <= capacities[r]; b++)
                        {
                            var status = statusCycle[(deptOffset + floor + r + b) % statusCycle.Length];
                            beds.Add(new Bed
                            {
                                Id = Guid.NewGuid(),
                                DepartmentId = dept.Id,
                                Ward = wardName,
                                RoomNumber = room,
                                BedNumber = $"{b:D2}",
                                Status = status,
                                Floor = floor,
                                PositionX = null,
                                PositionY = null
                            });
                        }
                    }
                }
            }
        }

        await _context.Beds.AddRangeAsync(beds, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
