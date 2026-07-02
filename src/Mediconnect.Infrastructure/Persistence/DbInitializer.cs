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
        await _context.StaffProfiles.AddRangeAsync(staffProfiles, cancellationToken);
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
