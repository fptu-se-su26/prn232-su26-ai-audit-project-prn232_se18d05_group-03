import { formatCurrencyAxis } from "../../utils/reportUtils";

export interface BarPoint {
  label: string;
  value: number;
}

interface BarChartProps {
  data: BarPoint[];
  color?: string;
  height?: number;
  emptyIcon?: string;
  emptyText?: string;
  valueFormatter?: (v: number) => string;
}

export default function BarChart({
  data,
  color = "#005db6",
  height = 280,
  emptyIcon = "bar_chart",
  emptyText = "No data for this period",
  valueFormatter = formatCurrencyAxis,
}: BarChartProps) {
  if (data.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center text-on-surface-variant gap-2"
        style={{ height }}
      >
        <span className="material-symbols-outlined text-4xl">{emptyIcon}</span>
        <p className="text-sm">{emptyText}</p>
      </div>
    );
  }

  const W = 1000;
  const H = height;
  const padL = 70;
  const padB = 40;
  const chartW = W - padL - 10;
  const chartH = H - padB - 10;
  const maxVal = Math.max(...data.map(d => d.value), 1);
  const spacing = chartW / data.length;
  const barW = Math.max(8, Math.min(60, spacing - 10));
  const GRID = 4;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height }}>
      <defs>
        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor={color} stopOpacity="0.55" />
        </linearGradient>
      </defs>
      {[...Array(GRID + 1)].map((_, i) => {
        const y = 10 + (chartH / GRID) * i;
        const val = maxVal * (1 - i / GRID);
        return (
          <g key={i}>
            <line x1={padL} x2={W - 10} y1={y} y2={y} stroke="#e6e8ea" strokeWidth="1" />
            <text x={padL - 6} y={y + 4} textAnchor="end" fontSize="11" fill="#727783">
              {valueFormatter(val)}
            </text>
          </g>
        );
      })}
      {data.map((d, i) => {
        const barH = Math.max(2, (d.value / maxVal) * chartH);
        const cx = padL + spacing * i + spacing / 2;
        const x = cx - barW / 2;
        const y = 10 + chartH - barH;
        return (
          <g key={d.label}>
            <rect x={x} y={y} width={barW} height={barH} fill="url(#barGrad)" rx="3" />
            <text x={cx} y={H - 6} textAnchor="middle" fontSize="10" fill="#727783">
              {d.label}
            </text>
          </g>
        );
      })}
      <line x1={padL} x2={W - 10} y1={H - padB} y2={H - padB} stroke="#c2c6d4" strokeWidth="1" />
    </svg>
  );
}
