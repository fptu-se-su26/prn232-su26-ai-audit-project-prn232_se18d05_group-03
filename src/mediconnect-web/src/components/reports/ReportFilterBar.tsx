import type { Period } from "../../utils/reportUtils";

interface ReportFilterBarProps {
  period: Period;
  onPeriodChange: (p: Period) => void;
  custom: { start: string; end: string };
  onCustomChange: (c: { start: string; end: string }) => void;
  today: string;
  department: string;
  onDepartmentChange: (d: string) => void;
  departments: string[];
  onExport: () => void;
  exportDisabled?: boolean;
}

export default function ReportFilterBar({
  period,
  onPeriodChange,
  custom,
  onCustomChange,
  today,
  department,
  onDepartmentChange,
  departments,
  onExport,
  exportDisabled,
}: ReportFilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <div className="bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 flex items-center gap-2">
        <span className="material-symbols-outlined text-on-surface-variant text-[18px]">calendar_month</span>
        <select
          value={period}
          onChange={e => onPeriodChange(e.target.value as Period)}
          className="bg-transparent border-none text-sm font-medium text-on-surface-variant cursor-pointer outline-none"
        >
          <option value="today">Today</option>
          <option value="this-month">This Month</option>
          <option value="last-30">Last 30 Days</option>
          <option value="ytd">Year to Date</option>
          <option value="custom">Custom Range</option>
        </select>
      </div>

      {period === "custom" && (
        <div className="bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 flex items-center gap-2">
          <input
            type="date"
            value={custom.start}
            max={custom.end}
            onChange={e => onCustomChange({ ...custom, start: e.target.value })}
            className="bg-transparent border-none text-sm text-on-surface-variant cursor-pointer outline-none"
          />
          <span className="text-on-surface-variant text-sm">→</span>
          <input
            type="date"
            value={custom.end}
            min={custom.start}
            max={today}
            onChange={e => onCustomChange({ ...custom, end: e.target.value })}
            className="bg-transparent border-none text-sm text-on-surface-variant cursor-pointer outline-none"
          />
        </div>
      )}

      <div className="bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 flex items-center gap-2">
        <span className="material-symbols-outlined text-on-surface-variant text-[18px]">filter_list</span>
        <select
          value={department}
          onChange={e => onDepartmentChange(e.target.value)}
          className="bg-transparent border-none text-sm font-medium text-on-surface-variant cursor-pointer outline-none"
        >
          <option value="">All Departments</option>
          {departments.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      <button
        onClick={onExport}
        disabled={exportDisabled}
        className="bg-primary text-on-primary rounded px-4 py-2 flex items-center gap-2 text-sm font-medium hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="material-symbols-outlined text-[18px]">download</span>
        Export CSV
      </button>
    </div>
  );
}
