using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Mediconnect.Domain.Entities;

public class StaffSchedule
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public Guid StaffId { get; set; }

    [ForeignKey(nameof(StaffId))]
    public StaffProfile Staff { get; set; } = null!;

    public DateOnly ShiftDate { get; set; }

    public TimeOnly StartTime { get; set; }

    public TimeOnly EndTime { get; set; }
}
