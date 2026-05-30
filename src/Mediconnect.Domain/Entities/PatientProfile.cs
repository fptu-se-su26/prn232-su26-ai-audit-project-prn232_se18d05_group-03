using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Mediconnect.Domain.Entities;

public class PatientProfile
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public Guid UserAccountId { get; set; }

    [ForeignKey(nameof(UserAccountId))]
    public UserAccount UserAccount { get; set; } = null!;

    public DateOnly? DateOfBirth { get; set; }

    public Gender Gender { get; set; } = Gender.Unknown;

    public decimal? HeightCm { get; set; }

    public decimal? WeightKg { get; set; }

    [MaxLength(50)]
    public string? InsuranceNumber { get; set; }

    [MaxLength(300)]
    public string? Address { get; set; }

    [MaxLength(100)]
    public string? EmergencyContactName { get; set; }

    [MaxLength(30)]
    public string? EmergencyContactPhone { get; set; }
}
