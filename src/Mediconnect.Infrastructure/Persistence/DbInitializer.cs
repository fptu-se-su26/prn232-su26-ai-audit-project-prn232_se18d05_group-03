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
        await _context.UserAccounts.AddRangeAsync(new[] { adminUser, doctorUser, nurseUser, patientUser }, cancellationToken);
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
}
