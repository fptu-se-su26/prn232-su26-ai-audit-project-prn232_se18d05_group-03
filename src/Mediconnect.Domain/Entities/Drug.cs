using System.ComponentModel.DataAnnotations;

namespace Mediconnect.Domain.Entities;

public class Drug
{
    [Key]
    public Guid Id { get; set; }

    [Required, MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(50)]
    public string? Code { get; set; }

    [MaxLength(50)]
    public string? Unit { get; set; }

    public int StockQuantity { get; set; }

    public decimal UnitPrice { get; set; }

    public bool IsActive { get; set; } = true;

    // ── CDSS dose-safety thresholds (Screen 2.2) ─────────────────────────────
    // Absolute recommended maximum dose per administration/day (in the drug's Unit).
    public decimal? MaxDailyDose { get; set; }

    // Weight-based recommended maximum (Unit per kg of body weight). When set and
    // the patient's weight is known, this takes precedence over MaxDailyDose.
    public decimal? MaxDosePerKg { get; set; }
}
