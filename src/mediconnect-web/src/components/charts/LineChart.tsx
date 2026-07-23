import { formatCurrencyAxis } from "../../utils/reportUtils";

export interface LinePoint {
  label: string;
  value: number;
}

interface LineChartProps {
  data: LinePoint[];
  color?: string;
  height?: number;
  emptyIcon?: string;
  emptyText?: string;
  valueFormatter?: (v: number) => string;
}

export default function LineChart({
  data,
  color = "#00478d",
  height = 280,
  emptyIcon = "show_chart",
  emptyText = "No data for this period",
  valueFormatter = formatCurrencyAxis,
}: LineChartProps) {
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
  const padT = 20;
  const chartW = W - padL - 20;
  const chartH = H - padB - padT;
  const maxVal = Math.max(...data.map(d => d.value), 1);
  const stepX = data.length > 1 ? chartW / (data.length - 1) : 0;
  const GRID = 4;

  const coords = data.map((d, i) => ({
    x: padL + (data.length > 1 ? stepX * i : chartW / 2),
    y: padT + chartH - (d.value / maxVal) * chartH,
    ...d,
  }));

  const pathD = coords.map((c, i) => (i === 0 ? `M ${c.x} ${c.y}` : `L ${c.x} ${c.y}`)).join(" ");
  const areaD = `${pathD} L ${coords[coords.length - 1].x} ${padT + chartH} L ${coords[0].x} ${padT + chartH} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height }}>
      <defs>
        <linearGradient id="lineAreaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[...Array(GRID + 1)].map((_, i) => {
        const y = padT + (chartH / GRID) * i;
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
      <path d={areaD} fill="url(#lineAreaGrad)" />
      <path d={pathD} fill="none" stroke={color} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      {coords.map(c => (
        <circle key={c.label} cx={c.x} cy={c.y} r="4" fill={color} stroke="white" strokeWidth="1.5">
          <title>{`${c.label}: ${valueFormatter(c.value)}`}</title>
        </circle>
      ))}
      {coords.map(c => (
        <text key={c.label + "_lbl"} x={c.x} y={H - 6} textAnchor="middle" fontSize="10" fill="#727783">
          {c.label}
        </text>
      ))}
      <line x1={padL} x2={W - 10} y1={H - padB} y2={H - padB} stroke="#c2c6d4" strokeWidth="1" />
    </svg>
  );
}
