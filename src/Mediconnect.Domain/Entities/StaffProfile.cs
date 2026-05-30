using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Mediconnect.Domain.Entities;

public class StaffProfile
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public Guid UserAccountId { get; set; }

    [ForeignKey(nameof(UserAccountId))]
    public UserAccount UserAccount { get; set; } = null!;

    public StaffType StaffType { get; set; } = StaffType.Doctor;

    [Required]
    public Guid DepartmentId { get; set; }

    [ForeignKey(nameof(DepartmentId))]
    public Department Department { get; set; } = null!;

    [MaxLength(100)]
    public string? Specialty { get; set; }

    public int YearsExperience { get; set; }

    [MaxLength(100)]
    public string? Degree { get; set; }
}
