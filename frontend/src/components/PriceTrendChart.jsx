import React from 'react';

// Simple responsive SVG line chart for price trends
// props: { points: Array<{ date: string, value: number }>, height?: number }
export default function PriceTrendChart({ points = [], height = 140 }) {
  if (!points || points.length === 0) {
    return <div className="text-xs text-olive/60">No history</div>;
  }

  // Normalize data
  const parsed = points
    .map(p => ({
      date: new Date(p.date),
      value: Number(p.value)
    }))
    .filter(p => !isNaN(p.date.getTime()) && !isNaN(p.value))
    .sort((a, b) => a.date - b.date);

  if (parsed.length === 0) {
    return <div className="text-xs text-olive/60">No history</div>;
  }

  const values = parsed.map(p => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const padY = (max - min) * 0.1 || 10;
  const yMin = min - padY;
  const yMax = max + padY;

  const width = 500; // viewBox width, scaled by container
  const w = width;
  const h = height;

  const xStep = w / Math.max(parsed.length - 1, 1);
  const toX = (i) => i * xStep;
  const toY = (v) => h - ((v - yMin) / (yMax - yMin)) * h;

  const d = parsed.map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(i).toFixed(2)} ${toY(p.value).toFixed(2)}`).join(' ');

  const last = parsed[parsed.length - 1];
  const first = parsed[0];
  const pct = first.value ? Math.round(((last.value - first.value) / first.value) * 100) : 0;
  const trendColor = last.value >= first.value ? '#16a34a' : '#dc2626';

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs text-olive/70 mb-1">
        <span>{parsed[0].date.toLocaleDateString()} - {parsed[parsed.length - 1].date.toLocaleDateString()}</span>
        <span className="inline-flex items-center gap-1" style={{ color: trendColor }}>
          {last.value >= first.value ? '▲' : '▼'} {pct}%
        </span>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-36">
        {/* Area fill */}
        <path d={`${d} L ${w} ${h} L 0 ${h} Z`} fill={trendColor + '22'} />
        {/* Line */}
        <path d={d} fill="none" stroke={trendColor} strokeWidth="2" />
        {/* Last point */}
        <circle cx={toX(parsed.length - 1)} cy={toY(last.value)} r="3" fill={trendColor} />
      </svg>
      <div className="mt-1 text-xs text-olive/70">
        <span className="font-medium">Latest:</span> ₹{Math.round(last.value).toLocaleString('en-IN')} / qtl
      </div>
    </div>
  );
}