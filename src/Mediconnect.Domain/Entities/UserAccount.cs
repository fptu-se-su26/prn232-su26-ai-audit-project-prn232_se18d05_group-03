using System.ComponentModel.DataAnnotations;

namespace Mediconnect.Domain.Entities;

public class UserAccount
{
    [Key]
    public Guid Id { get; set; }

    [Required, MaxLength(200)]
    public string FullName { get; set; } = string.Empty;

    [Required, MaxLength(200)]
    public string Email { get; set; } = string.Empty;

    [MaxLength(30)]
    public string? PhoneNumber { get; set; }

    [Required, MaxLength(500)]
    public string PasswordHash { get; set; } = string.Empty;

    public UserRole Role { get; set; } = UserRole.Patient;

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? VerifiedAt { get; set; }

    public PatientProfile? PatientProfile { get; set; }

    public StaffProfile? StaffProfile { get; set; }
}
