export function toDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function formatCurrency(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(1)}K`;
  return `$${v.toFixed(2)}`;
}

export function formatCurrencyAxis(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v}`;
}

export type Period = "today" | "this-month" | "last-30" | "ytd" | "custom";

export const PERIOD_LABELS: Record<Period, string> = {
  today: "Today",
  "this-month": "This Month",
  "last-30": "Last 30 Days",
  ytd: "Year to Date",
  custom: "Custom Range",
};

export interface DateRange {
  startDate: string;
  endDate: string;
  groupBy: "day" | "month";
}

export function getDateRange(period: Period, custom: { start: string; end: string }): DateRange {
  const today = new Date();
  const end = toDateStr(today);

  switch (period) {
    case "today":
      return { startDate: end, endDate: end, groupBy: "day" };
    case "last-30": {
      const start = new Date(today);
      start.setDate(start.getDate() - 29);
      return { startDate: toDateStr(start), endDate: end, groupBy: "day" };
    }
    case "ytd": {
      const start = new Date(today.getFullYear(), 0, 1);
      return { startDate: toDateStr(start), endDate: end, groupBy: "month" };
    }
    case "custom":
      return { startDate: custom.start, endDate: custom.end, groupBy: "day" };
    case "this-month":
    default: {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      return { startDate: toDateStr(start), endDate: end, groupBy: "day" };
    }
  }
}

/** Last N full months (inclusive of current month), for trend line charts. */
export function getLastNMonthsRange(n: number): { startDate: string; endDate: string } {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth() - (n - 1), 1);
  return { startDate: toDateStr(start), endDate: toDateStr(today) };
}

// ── CSV export ────────────────────────────────────────────────────────────────

function csvCell(v: string | number): string {
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function downloadCsv(filenamePrefix: string, sections: { title: string; rows: (string | number)[][] }[]) {
  const lines: string[] = [];
  lines.push("MediConnect Analytics Report");
  lines.push(`Generated,${csvCell(new Date().toLocaleString())}`);
  lines.push("");

  for (const section of sections) {
    lines.push(section.title);
    if (section.rows.length === 0) {
      lines.push("(no data)");
    } else {
      section.rows.forEach(row => lines.push(row.map(csvCell).join(",")));
    }
    lines.push("");
  }

  const blob = new Blob(["﻿" + lines.join("\r\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filenamePrefix}-${toDateStr(new Date())}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
