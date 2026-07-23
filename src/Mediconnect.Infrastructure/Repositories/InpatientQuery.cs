using Mediconnect.Application.DTOs;
using Mediconnect.Application.Interfaces;
using Mediconnect.Domain.Entities;
using Mediconnect.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Mediconnect.Infrastructure.Repositories;

// Joins InpatientAdmission with the patient's display name, department name, and current bed
// so the TV3 (inpatient) Blazor pages can show real identities instead of raw GUIDs.
public class InpatientQuery : IInpatientQuery
{
    private readonly AppDbContext _db;

    public InpatientQuery(AppDbContext db) => _db = db;

    public async Task<IReadOnlyList<InpatientAdmissionReadDto>> GetAllAsync(CancellationToken ct = default)
    {
        var admissions = await (
            from a in _db.InpatientAdmissions.AsNoTracking()
            join p in _db.PatientProfiles.AsNoTracking() on a.PatientId equals p.Id
            join u in _db.UserAccounts.AsNoTracking() on p.UserAccountId equals u.Id
            join d in _db.Departments.AsNoTracking() on a.DepartmentId equals d.Id
            select new
            {
                a.Id,
                a.PatientId,
                a.FromOutpatientVisitId,
                a.DepartmentId,
                a.AdmissionDate,
                a.Status,
                PatientName = u.FullName,
                DepartmentName = d.Name,
            })
            .ToListAsync(ct);

        var admissionIds = admissions.Select(x => x.Id).ToList();

        var activeBeds = await (
            from ba in _db.BedAssignments.AsNoTracking()
            join b in _db.Beds.AsNoTracking() on ba.BedId equals b.Id
            where admissionIds.Contains(ba.AdmissionId) && ba.ReleasedAt == null
            select new { ba.AdmissionId, b.Id, b.Ward, b.RoomNumber, b.BedNumber })
            .ToListAsync(ct);

        var bedByAdmission = activeBeds.ToDictionary(x => x.AdmissionId);

        return admissions
            .OrderByDescending(x => x.AdmissionDate)
            .Select(x =>
            {
                bedByAdmission.TryGetValue(x.Id, out var bed);
                return new InpatientAdmissionReadDto
                {
                    Id = x.Id,
                    PatientId = x.PatientId,
                    FromOutpatientVisitId = x.FromOutpatientVisitId,
                    DepartmentId = x.DepartmentId,
                    AdmissionDate = x.AdmissionDate,
                    Status = x.Status,
                    PatientName = x.PatientName,
                    DepartmentName = x.DepartmentName,
                    BedId = bed?.Id,
                    BedLabel = bed is null ? null : FormatBedLabel(bed.Ward, bed.RoomNumber, bed.BedNumber),
                };
            })
            .ToList();
    }

    private static string? FormatBedLabel(string? ward, string? roomNumber, string? bedNumber)
    {
        var parts = new[] { ward, roomNumber, bedNumber }.Where(s => !string.IsNullOrWhiteSpace(s));
        var label = string.Join(" · ", parts);
        return label.Length == 0 ? null : label;
    }
}
