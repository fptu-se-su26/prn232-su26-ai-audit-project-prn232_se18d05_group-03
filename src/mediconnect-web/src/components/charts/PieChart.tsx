export interface PieSlice {
  label: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: PieSlice[];
  size?: number;
  emptyText?: string;
}

function polarToCartesian(cx: number, cy: number, radius: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + radius * Math.cos(angleRad), y: cy + radius * Math.sin(angleRad) };
}

export default function PieChart({ data, size = 220, emptyText = "No data" }: PieChartProps) {
  const total = data.reduce((s, d) => s + d.value, 0);

  if (total === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center text-on-surface-variant gap-2"
        style={{ height: size }}
      >
        <span className="material-symbols-outlined text-4xl">pie_chart</span>
        <p className="text-sm">{emptyText}</p>
      </div>
    );
  }

  const radius = size / 2 - 8;
  const cx = size / 2;
  const cy = size / 2;
  let cumulativeAngle = 0;

  const slices = data
    .filter(d => d.value > 0)
    .map(slice => {
      const angle = (slice.value / total) * 360;
      const startAngle = cumulativeAngle;
      const endAngle = cumulativeAngle + angle;
      cumulativeAngle = endAngle;

      const start = polarToCartesian(cx, cy, radius, startAngle);
      const end = polarToCartesian(cx, cy, radius, endAngle);
      const largeArc = angle > 180 ? 1 : 0;
      const isFullCircle = data.filter(d => d.value > 0).length === 1;

      const path = isFullCircle
        ? `M ${cx} ${cy - radius} A ${radius} ${radius} 0 1 1 ${cx - 0.01} ${cy - radius} Z`
        : `M ${cx} ${cy} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;

      return { ...slice, path, pct: (slice.value / total) * 100 };
    });

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {slices.map(s => (
        <path key={s.label} d={s.path} fill={s.color} stroke="#fff" strokeWidth="2">
          <title>{`${s.label}: ${s.pct.toFixed(1)}%`}</title>
        </path>
      ))}
    </svg>
  );
}
