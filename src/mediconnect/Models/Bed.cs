using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Mediconnect.Models;

public class Bed
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public Guid DepartmentId { get; set; }

    [ForeignKey(nameof(DepartmentId))]
    public Department Department { get; set; } = null!;

    [MaxLength(50)]
    public string? Ward { get; set; }

    [MaxLength(50)]
    public string? RoomNumber { get; set; }

    [MaxLength(50)]
    public string? BedNumber { get; set; }

    public BedStatus Status { get; set; } = BedStatus.Available;
}
