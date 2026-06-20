import { useEffect, useMemo, useState } from "react";
import { reportApi, departmentApi } from "../api/services";
import type { RevenueItem } from "../types";
import {
  type Period,
  PERIOD_LABELS,
  getDateRange,
  getLastNMonthsRange,
  toDateStr,
  formatCurrency,
  downloadCsv,
} from "../utils/reportUtils";
import BarChart from "../components/charts/BarChart";
import LineChart from "../components/charts/LineChart";
import KpiCard from "../components/reports/KpiCard";
import Skeleton from "../components/reports/Skeleton";
import ReportFilterBar from "../components/reports/ReportFilterBar";

const DEPT_COLORS = ["bg-primary", "bg-secondary", "bg-tertiary", "bg-error", "bg-primary-container"];

function RevenueByDepartment({ data }: { data: RevenueItem[] }) {
  const byDept = useMemo(() => {
    const acc: Record<string, number> = {};
    for (const item of data) acc[item.department] = (acc[item.department] ?? 0) + item.revenue;
    return Object.entries(acc).sort(([, a], [, b]) => b - a);
  }, [data]);
  const total = byDept.reduce((s, [, v]) => s + v, 0);

  if (byDept.length === 0) {
    return (
      <div className="h-[160px] flex flex-col items-center justify-center text-on-surface-variant gap-2">
        <span className="material-symbols-outlined text-4xl">pie_chart</span>
        <p className="text-sm">No revenue data for this period</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {byDept.map(([dept, rev], i) => {
        const pct = total > 0 ? (rev / total) * 100 : 0;
        return (
          <div key={dept} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-2 text-on-surface">
                <span className={`w-2.5 h-2.5 rounded-full ${DEPT_COLORS[i % DEPT_COLORS.length]}`} />
                {dept}
              </span>
              <span className="font-semibold text-on-surface">
                {formatCurrency(rev)}{" "}
                <span className="text-on-surface-variant font-normal">({pct.toFixed(0)}%)</span>
              </span>
            </div>
            <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${DEPT_COLORS[i % DEPT_COLORS.length]}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
      <div className="pt-2 mt-2 border-t border-outline-variant flex justify-between text-sm">
        <span className="text-on-surface-variant">Total</span>
        <span className="font-bold text-on-surface">{formatCurrency(total)}</span>
      </div>
    </div>
  );
}

export default function RevenueDashboardPage() {
  const today = useMemo(() => toDateStr(new Date()), []);
  const [period, setPeriod] = useState<Period>("this-month");
  const [custom, setCustom] = useState({ start: today, end: today });
  const [department, setDepartment] = useState("");
  const [allDepartments, setAllDepartments] = useState<string[]>([]);

  const [revenue, setRevenue] = useState<RevenueItem[]>([]);
  const [monthlyTrend, setMonthlyTrend] = useState<RevenueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    departmentApi
      .getAll()
      .then(res => setAllDepartments(res.data.map(d => d.name)))
      .catch(() => {});
  }, []);

  useEffect(() => {
    let cancelled = false;
    const { startDate, endDate, groupBy } = getDateRange(period, custom);

    if (period === "custom" && startDate > endDate) {
      setError("Start date must not be after end date.");
      setLoading(false);
      return;
    }

    const trendRange = getLastNMonthsRange(12);

    setLoading(true);
    setError(null);

    Promise.all([
      reportApi.getRevenue({ startDate, endDate, groupBy, department: department || undefined }),
      reportApi.getRevenue({
        startDate: trendRange.startDate,
        endDate: trendRange.endDate,
        groupBy: "month",
        department: department || undefined,
      }),
    ])
      .then(([r, trend]) => {
        if (cancelled) return;
        setRevenue(r.data);
        setMonthlyTrend(trend.data);
      })
      .catch(err => {
        if (cancelled) return;
        setError(err?.response?.data?.message ?? "Failed to load revenue data. Make sure you are logged in.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [period, custom, department]);

  const periodLabel = PERIOD_LABELS[period];

  const totalRevenue = useMemo(() => revenue.reduce((s, r) => s + r.revenue, 0), [revenue]);
  const dayCount = useMemo(() => new Set(revenue.map(r => r.timePeriod)).size || 1, [revenue]);
  const avgPerDay = totalRevenue / dayCount;

  const topDepartment = useMemo(() => {
    const acc: Record<string, number> = {};
    for (const item of revenue) acc[item.department] = (acc[item.department] ?? 0) + item.revenue;
    const entries = Object.entries(acc).sort(([, a], [, b]) => b - a);
    return entries[0]?.[0] ?? "—";
  }, [revenue]);

  const barData = useMemo(() => {
    const acc: Record<string, number> = {};
    for (const item of revenue) acc[item.timePeriod] = (acc[item.timePeriod] ?? 0) + item.revenue;
    return Object.entries(acc)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([label, value]) => ({ label: label.length > 7 ? label.slice(5) : label, value }));
  }, [revenue]);

  const lineData = useMemo(() => {
    const acc: Record<string, number> = {};
    for (const item of monthlyTrend) acc[item.timePeriod] = (acc[item.timePeriod] ?? 0) + item.revenue;
    return Object.entries(acc)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([label, value]) => ({ label: label.slice(2), value })); // "2026-06" -> "26-06"
  }, [monthlyTrend]);

  const handleExport = () => {
    downloadCsv("revenue-dashboard", [
      {
        title: `Revenue by Day/Month — ${periodLabel}${department ? ` — ${department}` : ""}`,
        rows: [["Date", "Department", "Revenue"], ...revenue.map(r => [r.timePeriod, r.department, r.revenue])],
      },
      {
        title: "Revenue Trend — Last 12 Months",
        rows: [["Month", "Department", "Revenue"], ...monthlyTrend.map(r => [r.timePeriod, r.department, r.revenue])],
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-background p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-on-surface">Financial Revenue Dashboard</h2>
          <p className="text-sm text-on-surface-variant mt-1">
            Revenue trends by day and month, filterable by department.
          </p>
        </div>
        <ReportFilterBar
          period={period}
          onPeriodChange={setPeriod}
          custom={custom}
          onCustomChange={setCustom}
          today={today}
          department={department}
          onDepartmentChange={setDepartment}
          departments={allDepartments}
          onExport={handleExport}
          exportDisabled={loading}
        />
      </div>

      {error && (
        <div className="bg-error-container text-on-error-container px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
          <span className="material-symbols-outlined text-lg">error</span>
          {error}
        </div>
      )}

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        <KpiCard
          icon="payments"
          iconBg="bg-primary-container"
          iconColor="text-on-primary-container"
          label="Total Revenue"
          value={loading ? null : formatCurrency(totalRevenue)}
          sub={`Paid invoices · ${periodLabel}${department ? ` · ${department}` : ""}`}
        />
        <KpiCard
          icon="trending_up"
          iconBg="bg-secondary-container"
          iconColor="text-on-secondary-container"
          label="Average Daily Revenue"
          value={loading ? null : formatCurrency(avgPerDay)}
          sub="Across days with activity"
        />
        <KpiCard
          icon="apartment"
          iconBg="bg-tertiary-container"
          iconColor="text-on-tertiary-container"
          label="Top Earning Department"
          value={loading ? null : topDepartment}
          sub={`In ${periodLabel.toLowerCase()}`}
        />
      </div>

      {/* Bar chart: revenue by day/month for selected period */}
      <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant">
        <div className="mb-4">
          <h4 className="text-xl font-semibold text-on-surface">
            Revenue by {period === "ytd" ? "Month" : "Day"}
          </h4>
          <p className="text-xs text-on-surface-variant">{periodLabel}{department ? ` · ${department}` : ""}</p>
        </div>
        {loading ? <Skeleton className="h-[280px]" /> : <BarChart data={barData} />}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Line chart: 12-month trend */}
        <div className="xl:col-span-2 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant">
          <div className="mb-4">
            <h4 className="text-xl font-semibold text-on-surface">Revenue Trend (12 Months)</h4>
            <p className="text-xs text-on-surface-variant">
              Monthly revenue trajectory{department ? ` · ${department}` : ""}
            </p>
          </div>
          {loading ? <Skeleton className="h-[280px]" /> : <LineChart data={lineData} />}
        </div>

        {/* Revenue by department */}
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="text-xl font-semibold text-on-surface">By Department</h4>
              <p className="text-xs text-on-surface-variant">Share of total · {periodLabel}</p>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant">apartment</span>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-8" />)}
            </div>
          ) : (
            <RevenueByDepartment data={revenue} />
          )}
        </div>
      </div>
    </div>
  );
}
