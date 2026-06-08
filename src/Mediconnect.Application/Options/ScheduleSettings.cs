namespace Mediconnect.Application.Options;

public class ScheduleSettings
{
    public const string SectionName = "ScheduleSettings";

    public int MaxShiftsPerDay { get; set; } = 2;
}
