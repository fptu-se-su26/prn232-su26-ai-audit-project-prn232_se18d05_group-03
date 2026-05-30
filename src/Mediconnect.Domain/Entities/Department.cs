using System.ComponentModel.DataAnnotations;

namespace Mediconnect.Domain.Entities;

public class Department
{
    [Key]
    public Guid Id { get; set; }

    [Required, MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(50)]
    public string? Code { get; set; }

    [MaxLength(500)]
    public string? Description { get; set; }
}
