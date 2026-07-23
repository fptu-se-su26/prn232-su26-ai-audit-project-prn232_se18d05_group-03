import { useEffect, useMemo, useState } from "react";
import { reportApi, departmentApi } from "../api/services";
import type { BedOccupancyReport, OutpatientVisitItem } from "../types";
import {
  type Period,
  PERIOD_LABELS,
  getDateRange,
  toDateStr,
  downloadCsv,
} from "../utils/reportUtils";
import LineChart from "../components/charts/LineChart";
import PieChart from "../components/charts/PieChart";
import KpiCard from "../components/reports/KpiCard";
import Skeleton from "../components/reports/Skeleton";
import ReportFilterBar from "../components/reports/ReportFilterBar";

export default function OperationsReportPage() {
  const today = useMemo(() => toDateStr(new Date()), []);
  const [period, setPeriod] = useState<Period>("this-month");
  const [custom, setCustom] = useState({ start: today, end: today });
  const [department, setDepartment] = useState("");
  const [allDepartments, setAllDepartments] = useState<string[]>([]);

  const [bedOccupancy, setBedOccupancy] = useState<BedOccupancyReport | null>(null);
  const [visits, setVisits] = useState<OutpatientVisitItem[]>([]);
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

    setLoading(true);
    setError(null);

    Promise.all([
      reportApi.getBedOccupancy(department || undefined),
      reportApi.getOutpatientVisits({ startDate, endDate, groupBy }),
    ])
      .then(([b, v]) => {
        if (cancelled) return;
        setBedOccupancy(b.data);
        setVisits(v.data);
      })
      .catch(err => {
        if (cancelled) return;
        setError(err?.response?.data?.message ?? "Failed to load operations data. Make sure you are logged in.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [period, custom, department]);

  const periodLabel = PERIOD_LABELS[period];
  const rangeVisits = useMemo(() => visits.reduce((s, v) => s + v.visitCount, 0), [visits]);
  const peakDay = useMemo(() => {
    if (visits.length === 0) return null;
    return visits.reduce((max, v) => (v.visitCount > max.visitCount ? v : max), visits[0]);
  }, [visits]);

  const lineData = useMemo(
    () => visits.map(v => ({ label: v.timePeriod.length > 7 ? v.timePeriod.slice(5) : v.timePeriod, value: v.visitCount })),
    [visits],
  );

  const occupancyPie = useMemo(
    () => [
      { label: "Occupied", value: bedOccupancy?.occupiedBeds ?? 0, color: "#ba1a1a" },
      { label: "Available", value: bedOccupancy?.availableBeds ?? 0, color: "#006a6a" },
    ],
    [bedOccupancy],
  );

  const handleExport = () => {
    downloadCsv("operations-report", [
      {
        title: `Bed Occupancy by Department${department ? ` — ${department}` : ""}`,
        rows: [
          ["Department", "Total Beds", "Occupied", "Available", "Occupancy %"],
          ...(bedOccupancy?.byDepartmentBreakdown.map(d => [
            d.department,
            d.total,
            d.occupied,
            d.total - d.occupied,
            d.percentage,
          ]) ?? []),
        ],
      },
      {
        title: `Outpatient Visits — ${periodLabel}`,
        rows: [["Date", "Visits"], ...visits.map(v => [v.timePeriod, v.visitCount])],
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-background p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-on-surface">Operations Report Dashboard</h2>
          <p className="text-sm text-on-surface-variant mt-1">
            Inpatient bed capacity analysis and outpatient visit trends.
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
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <KpiCard
          icon="bed"
          iconBg="bg-primary-container"
          iconColor="text-on-primary-container"
          label="Total Beds"
          value={loading ? null : (bedOccupancy?.totalBeds ?? 0).toLocaleString()}
          sub={department || "All Departments"}
        />
        <KpiCard
          icon="hotel"
          iconBg="bg-error-container"
          iconColor="text-on-error-container"
          label="Occupied"
          value={loading ? null : (bedOccupancy?.occupiedBeds ?? 0).toLocaleString()}
          badge={
            !loading && bedOccupancy
              ? (bedOccupancy.occupancyPercentage >= 85
                  ? { text: "Critical", color: "text-error" }
                  : { text: "Normal", color: "text-tertiary" })
              : undefined
          }
        />
        <KpiCard
          icon="bed"
          iconBg="bg-tertiary-container"
          iconColor="text-on-tertiary-container"
          label="Available"
          value={loading ? null : (bedOccupancy?.availableBeds ?? 0).toLocaleString()}
          sub="Ready for admission"
        />
        <KpiCard
          icon="personal_injury"
          iconBg="bg-secondary-container"
          iconColor="text-on-secondary-container"
          label="Outpatient Visits"
          value={loading ? null : rangeVisits.toLocaleString()}
          sub={peakDay ? `Peak: ${peakDay.visitCount} on ${peakDay.timePeriod}` : periodLabel}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Pie chart: bed capacity */}
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="text-xl font-semibold text-on-surface">Bed Capacity</h4>
              <p className="text-xs text-on-surface-variant">Occupied vs. available</p>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant">pie_chart</span>
          </div>
          {loading ? (
            <Skeleton className="h-[220px] rounded-full mx-auto" />
          ) : (
            <div className="flex flex-col items-center gap-4">
              <PieChart data={occupancyPie} />
              <div className="flex gap-4 text-sm">
                {occupancyPie.map(s => (
                  <span key={s.label} className="flex items-center gap-1.5 text-on-surface">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                    {s.label} ({s.value})
                  </span>
                ))}
              </div>
              <p className="text-2xl font-bold text-on-surface">
                {bedOccupancy?.occupancyPercentage ?? 0}%{" "}
                <span className="text-sm font-normal text-on-surface-variant">occupancy</span>
              </p>
            </div>
          )}
        </div>

        {/* Data table: department breakdown */}
        <div className="xl:col-span-2 bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden">
          <div className="px-6 py-4 border-b border-outline-variant bg-surface">
            <h4 className="text-xl font-semibold text-on-surface">Bed Occupancy by Department</h4>
            <p className="text-xs text-on-surface-variant">Capacity breakdown per unit</p>
          </div>
          {loading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-8" />)}
            </div>
          ) : bedOccupancy && bedOccupancy.byDepartmentBreakdown.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container-low text-xs text-on-surface-variant">
                <tr>
                  <th className="px-6 py-2 font-semibold">Department</th>
                  <th className="px-6 py-2 font-semibold text-right">Total</th>
                  <th className="px-6 py-2 font-semibold text-right">Occupied</th>
                  <th className="px-6 py-2 font-semibold text-right">Available</th>
                  <th className="px-6 py-2 font-semibold text-right">Occupancy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant text-sm">
                {bedOccupancy.byDepartmentBreakdown.map(d => (
                  <tr key={d.department} className="hover:bg-surface transition-colors">
                    <td className="px-6 py-3 font-medium text-on-surface">{d.department}</td>
                    <td className="px-6 py-3 text-right text-on-surface-variant">{d.total}</td>
                    <td className="px-6 py-3 text-right text-on-surface-variant">{d.occupied}</td>
                    <td className="px-6 py-3 text-right text-on-surface-variant">{d.total - d.occupied}</td>
                    <td className="px-6 py-3 text-right">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-bold ${
                          d.percentage >= 85
                            ? "bg-error text-on-error"
                            : d.percentage >= 60
                            ? "bg-primary text-on-primary"
                            : "bg-secondary text-on-secondary"
                        }`}
                      >
                        {d.percentage}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center h-[200px] text-on-surface-variant gap-2">
              <span className="material-symbols-outlined text-4xl">hotel</span>
              <p className="text-sm">No bed data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Line chart: outpatient visits */}
      <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant pb-16">
        <div className="mb-4">
          <h4 className="text-xl font-semibold text-on-surface">Outpatient Visit Trend</h4>
          <p className="text-xs text-on-surface-variant">{periodLabel}</p>
        </div>
        {loading ? (
          <Skeleton className="h-[280px]" />
        ) : (
          <LineChart
            data={lineData}
            color="#006a6a"
            emptyIcon="personal_injury"
            valueFormatter={v => v.toFixed(0)}
          />
        )}
      </div>
    </div>
  );
}
