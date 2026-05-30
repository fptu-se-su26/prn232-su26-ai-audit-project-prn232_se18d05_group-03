using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Mediconnect.Domain.Entities;

public class Clinic
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public Guid DepartmentId { get; set; }

    [ForeignKey(nameof(DepartmentId))]
    public Department Department { get; set; } = null!;

    [Required, MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(50)]
    public string? RoomNumber { get; set; }

    public bool IsActive { get; set; } = true;
}
