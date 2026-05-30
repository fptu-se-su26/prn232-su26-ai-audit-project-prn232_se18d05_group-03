using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Mediconnect.Domain.Entities;

public class VitalSign
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public Guid AdmissionId { get; set; }

    [ForeignKey(nameof(AdmissionId))]
    public InpatientAdmission Admission { get; set; } = null!;

    public DateTime RecordedAt { get; set; } = DateTime.UtcNow;

    public int? Pulse { get; set; }

    public decimal? TemperatureC { get; set; }

    public int? BloodPressureSystolic { get; set; }

    public int? BloodPressureDiastolic { get; set; }

    public int? RespiratoryRate { get; set; }

    public int? SpO2 { get; set; }
}
