using System.Globalization;

namespace Mediconnect.Web.Services;

public enum ReportPeriod { Today, ThisMonth, Last30, Ytd, Custom }

public record ChartPoint(string Label, double Value);
public record PieSlice(string Label, double Value, string Color);

public static class ReportUtils
{
    public static readonly Dictionary<ReportPeriod, string> PeriodLabels = new()
    {
        [ReportPeriod.Today] = "Hôm nay",
        [ReportPeriod.ThisMonth] = "Tháng này",
        [ReportPeriod.Last30] = "30 ngày qua",
        [ReportPeriod.Ytd] = "Từ đầu năm",
        [ReportPeriod.Custom] = "Tuỳ chọn",
    };

    public static (DateTime Start, DateTime End, string GroupBy) GetDateRange(ReportPeriod period, DateTime customStart, DateTime customEnd)
    {
        var today = DateTime.Today;
        return period switch
        {
            ReportPeriod.Today => (today, today, "day"),
            ReportPeriod.Last30 => (today.AddDays(-29), today, "day"),
            ReportPeriod.Ytd => (new DateTime(today.Year, 1, 1), today, "month"),
            ReportPeriod.Custom => (customStart, customEnd, "day"),
            _ => (new DateTime(today.Year, today.Month, 1), today, "day"), // ThisMonth
        };
    }

    public static (DateTime Start, DateTime End) GetLastNMonthsRange(int n)
    {
        var today = DateTime.Today;
        var start = new DateTime(today.Year, today.Month, 1).AddMonths(-(n - 1));
        return (start, today);
    }

    public static string FormatCurrency(decimal v)
    {
        var ci = CultureInfo.InvariantCulture;
        if (v >= 1_000_000_000m) return $"{(v / 1_000_000_000m).ToString("0.##", ci)} tỷ đ";
        if (v >= 1_000_000m) return $"{(v / 1_000_000m).ToString("0.##", ci)} triệu đ";
        if (v >= 1_000m) return $"{(v / 1_000m).ToString("0.#", ci)} nghìn đ";
        return $"{v.ToString("0", ci)} đ";
    }

    public static string FormatCurrencyAxis(double v) => FormatCurrency((decimal)v);

    private static string CsvCell(object? v)
    {
        var s = v?.ToString() ?? "";
        return s.Contains('"') || s.Contains(',') || s.Contains('\n') ? $"\"{s.Replace("\"", "\"\"")}\"" : s;
    }

    /// <summary>Builds CSV text (BOM + sections) ready to hand to the download.js JS-interop helper.</summary>
    public static string BuildCsv(IEnumerable<(string Title, IEnumerable<IEnumerable<object>> Rows)> sections)
    {
        var lines = new List<string> { "MediConnect Analytics Report", $"Generated,{CsvCell(DateTime.Now.ToString())}", "" };
        foreach (var section in sections)
        {
            lines.Add(section.Title);
            var rows = section.Rows.ToList();
            if (rows.Count == 0) lines.Add("(không có dữ liệu)");
            else foreach (var row in rows) lines.Add(string.Join(",", row.Select(CsvCell)));
            lines.Add("");
        }
        return "﻿" + string.Join("\r\n", lines);
    }
}
