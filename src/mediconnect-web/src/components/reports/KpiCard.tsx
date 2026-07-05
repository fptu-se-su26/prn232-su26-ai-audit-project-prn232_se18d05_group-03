import type { ReactNode } from "react";
import Skeleton from "./Skeleton";

interface KpiCardProps {
  icon: string;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string | null;
  sub?: string | ReactNode;
  badge?: { text: string; color: string };
}

export default function KpiCard({ icon, iconBg, iconColor, label, value, sub, badge }: KpiCardProps) {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-[0px_2px_4px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className={`p-2 ${iconBg} rounded-lg ${iconColor}`}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        {badge && <span className={`text-xs font-semibold ${badge.color}`}>{badge.text}</span>}
      </div>
      <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">{label}</p>
      {value === null ? (
        <Skeleton className="h-9 mt-1" />
      ) : (
        <h3 className="text-3xl font-bold text-on-surface mt-1">{value}</h3>
      )}
      {sub != null &&
        (typeof sub === "string" ? (
          <p className="text-xs text-on-surface-variant mt-2">{sub}</p>
        ) : (
          <div className="mt-2">{sub}</div>
        ))}
    </div>
  );
}
