using System.ComponentModel.DataAnnotations;
using Mediconnect.Domain.Entities;

namespace Mediconnect.Application.DTOs;

public class ScheduleFlatReadDto
{
    public Guid Id { get; set; }
    public Guid StaffId { get; set; }

    // "date" per API spec — the shift date
    public DateOnly Date { get; set; }

    // "shift" per API spec — Vietnamese display name: "Ca Sáng" | "Ca Chiều" | "Ca Tối"
    public string Shift { get; set; } = string.Empty;

    // Numeric enum kept so the frontend edit-form can pre-select the correct option
    public ShiftType ShiftType { get; set; }

    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public string? WorkRoom { get; set; }

    // "userId" per API spec — UserAccount.Id (different from StaffId which is StaffProfile.Id)
    public Guid UserId { get; set; }

    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Specialty { get; set; }
    public int YearsExperience { get; set; }
    public string? Degree { get; set; }
    public Guid DepartmentId { get; set; }
    public string Department { get; set; } = string.Empty;
    public StaffType StaffType { get; set; }
}

public class ScheduleWriteDto
{
    [Required]
    public Guid StaffId { get; set; }

    [Required]
    public DateOnly ShiftDate { get; set; }

    [Required]
    public ShiftType ShiftType { get; set; }

    [MaxLength(100)]
    public string? WorkRoom { get; set; }
}

public class ScheduleFilterQuery
{
    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public bool CurrentWeek { get; set; }
    public Guid? DepartmentId { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}

public class PagedResult<T>
{
    public IReadOnlyList<T> Items { get; set; } = Array.Empty<T>();
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalCount { get; set; }
    public int TotalPages { get; set; }
}

public class StaffDirectoryDto
{
    public Guid Id { get; set; }        // StaffProfile.Id
    public Guid UserId { get; set; }    // UserAccount.Id
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public StaffType StaffType { get; set; }
    public Guid DepartmentId { get; set; }
    public string Department { get; set; } = string.Empty;
    public string? Specialty { get; set; }
    public int YearsExperience { get; set; }
    public string? Degree { get; set; }
}
