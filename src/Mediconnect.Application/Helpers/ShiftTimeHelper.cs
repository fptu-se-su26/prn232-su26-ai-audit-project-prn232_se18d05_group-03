using Mediconnect.Domain.Entities;

namespace Mediconnect.Application.Helpers;

public static class ShiftTimeHelper
{
    public static (TimeOnly Start, TimeOnly End) GetTimes(ShiftType shiftType) => shiftType switch
    {
        ShiftType.Morning => (new TimeOnly(6, 0), new TimeOnly(12, 0)),
        ShiftType.Afternoon => (new TimeOnly(12, 0), new TimeOnly(18, 0)),
        ShiftType.Evening => (new TimeOnly(18, 0), new TimeOnly(23, 59)),
        _ => throw new ArgumentOutOfRangeException(nameof(shiftType), shiftType, "Invalid shift type.")
    };

    public static string GetDisplayName(ShiftType shiftType) => shiftType switch
    {
        ShiftType.Morning => "Ca Sáng",
        ShiftType.Afternoon => "Ca Chiều",
        ShiftType.Evening => "Ca Tối",
        _ => shiftType.ToString()
    };
}
