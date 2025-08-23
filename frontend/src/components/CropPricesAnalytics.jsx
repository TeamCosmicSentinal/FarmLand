import React, { useMemo, useState } from 'react';

// Multi-series responsive SVG line/area chart with optional reference lines
function SimpleChart({ series = [], refLines = [], height = 240 }) {
  if (!series || series.length === 0) return <div className="text-xs text-olive/60">No data</div>;

  // Parse and sort each series
  const parsedSeries = series.map(s => {
    const pts = (s.points || [])
      .map(p => ({ date: new Date(p.date), value: Number(p.value) }))
      .filter(p => !isNaN(p.date) && !isNaN(p.value))
      .sort((a, b) => a.date - b.date);
    return { label: s.label, color: s.color || '#16a34a', points: pts };
  }).filter(s => s.points.length > 0);

  if (parsedSeries.length === 0) return <div className="text-xs text-olive/60">No data</div>;

  // Y-axis domain across all series and reference lines
  const allValues = parsedSeries.flatMap(s => s.points.map(p => p.value));
  const refVals = (refLines || []).map(r => r.value);
  const yminRaw = Math.min(...allValues, ...(refVals.length ? refVals : [Infinity]));
  const ymaxRaw = Math.max(...allValues, ...(refVals.length ? refVals : [-Infinity]));
  const pad = (ymaxRaw - yminRaw) * 0.1 || 10;
  const yMin = yminRaw - pad;
  const yMax = ymaxRaw + pad;

  // X dimension: use longest series for width mapping
  const w = 760; // viewBox width
  const h = height; // viewBox height

  const longest = parsedSeries.reduce((a, b) => (a.points.length >= b.points.length ? a : b));
  const n = Math.max(longest.points.length - 1, 1);
  const step = w / n;
  const toX = (i) => i * step;
  const toY = (v) => h - ((v - yMin) / (yMax - yMin)) * h;

  // Build path for each series
  const makePath = (pts) => pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(i).toFixed(2)} ${toY(p.value).toFixed(2)}`).join(' ');

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-64">
      {/* Reference lines */}
      {(refLines || []).map((r, i) => (
        <g key={i}>
          <line x1={0} x2={w} y1={toY(r.value)} y2={toY(r.value)} stroke={r.color || '#f59e0b'} strokeDasharray="6 4" />
        </g>
      ))}

      {/* Series */}
      {parsedSeries.map((s, idx) => {
        const d = makePath(s.points);
        return (
          <g key={idx}>
            <path d={`${d} L ${w} ${h} L 0 ${h} Z`} fill={(s.color || '#16a34a') + '22'} />
            <path d={d} fill="none" stroke={s.color || '#16a34a'} strokeWidth="2" />
            {/* Last point */}
            <circle cx={toX(s.points.length - 1)} cy={toY(s.points[s.points.length - 1].value)} r="3" fill={s.color || '#16a34a'} />
          </g>
        );
      })}
    </svg>
  );
}

function formatINR(v) {
  if (v == null || isNaN(v)) return '-';
  return `₹${Math.round(v).toLocaleString('en-IN')}`;
}

function computeStats(points) {
  const vals = (points || []).map(p => Number(p.value)).filter(v => !isNaN(v));
  if (vals.length === 0) return { avg: null, min: null, max: null, changePct: null, volatility: null, latest: null, earliest: null };
  const sum = vals.reduce((a, b) => a + b, 0);
  const avg = sum / vals.length;
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const latest = vals[vals.length - 1];
  const earliest = vals[0];
  const changePct = earliest ? ((latest - earliest) / earliest) * 100 : null;
  const mean = avg;
  const variance = vals.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / vals.length;
  const volatility = Math.sqrt(variance); // standard deviation
  return { avg, min, max, changePct, volatility, latest, earliest };
}

function percentileOf(points, value) {
  const vals = (points || []).map(p => Number(p.value)).filter(v => !isNaN(v)).sort((a, b) => a - b);
  if (!vals.length || value == null || isNaN(value)) return null;
  let count = 0;
  for (const v of vals) if (v <= value) count++;
  return (count / vals.length) * 100;
}

function filterByRange(points, days) {
  if (!Array.isArray(points) || points.length === 0) return [];
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return points.filter(p => new Date(p.date) >= cutoff);
}

function toCSV(points) {
  const rows = [['date', 'price']].concat((points || []).map(p => [new Date(p.date).toISOString().slice(0,10), Math.round(p.value)]));
  return rows.map(r => r.join(',')).join('\n');
}

export default function CropPricesAnalytics({ open, onClose, data }) {
  const [selected, setSelected] = useState('All Mandis');
  const [overlayAverage, setOverlayAverage] = useState(true);
  const [range, setRange] = useState(30); // 7/30/90 days
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [overlayMandis, setOverlayMandis] = useState([]); // names

  const colors = ['#16a34a', '#2563eb', '#dc2626', '#7c3aed', '#0ea5e9', '#f97316', '#22c55e', '#10b981'];

  const analytics = useMemo(() => {
    if (!data || !Array.isArray(data.mandi_prices)) {
      return { list: [], allPoints: [], best: null, top3: [] };
    }
    const mandis = data.mandi_prices;

    // Build per-mandi history
    const perMandi = mandis.map((m, idx) => {
      let points = [];
      if (Array.isArray(m.history) && m.history.length) {
        points = m.history.map(h => ({
          date: h.date || h.last_updated || data.last_updated,
          value: h.price_per_quintal || h.price || m.price_per_quintal
        }));
      } else {
        // Synthesize from min/avg/max/current
        const today = new Date();
        const d20 = new Date(today); d20.setDate(d20.getDate() - 20);
        const d10 = new Date(today); d10.setDate(d10.getDate() - 10);
        const d5 = new Date(today); d5.setDate(d5.getDate() - 5);
        points = [
          { date: d20.toISOString().slice(0, 10), value: m.min_price || m.price_per_quintal * 0.95 },
          { date: d10.toISOString().slice(0, 10), value: ((m.min_price ?? m.price_per_quintal) + (m.max_price ?? m.price_per_quintal)) / 2 },
          { date: d5.toISOString().slice(0, 10), value: ((m.min_price ?? m.price_per_quintal) + (m.price_per_quintal ?? m.max_price)) / 2 },
          { date: today.toISOString().slice(0, 10), value: m.price_per_quintal }
        ];
      }
      return { label: m.mandi_name, color: colors[idx % colors.length], points };
    });

    // Aggregate average across mandis by date
    const byDate = new Map();
    perMandi.forEach(s => s.points.forEach(p => {
      const k = String(p.date);
      const entry = byDate.get(k) || { sum: 0, n: 0 };
      entry.sum += Number(p.value) || 0;
      entry.n += 1;
      byDate.set(k, entry);
    }));
    const allPoints = Array.from(byDate.entries())
      .map(([date, v]) => ({ date, value: v.n ? v.sum / v.n : 0 }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    // Best current price and top 3
    const currentList = mandis.map(m => ({ mandi: m.mandi_name, value: m.price_per_quintal || 0 }));
    currentList.sort((a, b) => b.value - a.value);
    const best = currentList[0] || null;
    const top3 = currentList.slice(0, 3);

    return { list: perMandi, allPoints, best, top3 };
  }, [data]);

  if (!open) return null;

  const list = analytics.list;
  const currentSeries = selected === 'All Mandis' ? { label: 'All Mandis', color: colors[0], points: analytics.allPoints } : list.find(s => s.label === selected);

  // Apply range filter
  const primaryPoints = filterByRange(currentSeries?.points || [], range);
  const avgPoints = filterByRange(analytics.allPoints, range);

  // Overlays (other mandis)
  const overlaySeries = overlayMandis
    .filter(name => name !== currentSeries?.label)
    .map(name => list.find(s => s.label === name))
    .filter(Boolean)
    .map(s => ({ label: s.label, color: s.color, points: filterByRange(s.points, range) }));

  // Stats
  const statsPrimary = computeStats(primaryPoints);
  const statsAvg = computeStats(avgPoints);
  const pctRank = percentileOf(primaryPoints, statsPrimary.latest);
  const last7 = filterByRange(primaryPoints, 7);
  const last30 = filterByRange(primaryPoints, 30);
  const last7Stats = computeStats(last7);
  const last30Stats = computeStats(last30);

  // Build series for chart
  const chartSeries = [
    { label: currentSeries?.label || 'Series', color: '#16a34a', points: primaryPoints }
  ];
  if (overlayAverage && selected !== 'All Mandis') {
    chartSeries.push({ label: 'Average (All Mandis)', color: '#2563eb', points: avgPoints });
  }
  overlaySeries.forEach(s => chartSeries.push(s));

  const refLines = analytics.best ? [{ value: analytics.best.value, color: '#f59e0b', label: 'Best Price' }] : [];

  const changeBadge = (pct) => {
    if (pct == null || isNaN(pct)) return <span className="ml-2 text-olive/60">n/a</span>;
    const up = pct >= 0;
    return (
      <span className={`ml-2 text-xs px-2 py-0.5 rounded ${up ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'}`}>
        {up ? '▲' : '▼'} {Math.abs(pct).toFixed(1)}%
      </span>
    );
  };

  // CSV download for primary series
  const handleDownload = () => {
    const csv = toCSV(primaryPoints);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(data?.crop_name || 'crop').replace(/\s+/g,'_')}_${(currentSeries?.label || 'series').replace(/\s+/g,'_')}_${range}d.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-offwhite w-full max-w-6xl mx-4 rounded-2xl shadow-2xl border border-hemlock max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-hemlock/60 flex-shrink-0">
          <div>
            <h3 className="text-2xl font-heading font-bold text-olive">📊 Analytics</h3>
            <p className="text-sm text-olive/70">{data?.crop_name} • {data?.location}</p>
          </div>
          <button onClick={onClose} className="px-3 py-1 rounded-lg bg-olive/10 hover:bg-olive/20">Close</button>
        </div>

        <div className="p-4 space-y-4 overflow-auto">
          {/* Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-olive">Mandi</label>
              <select
                className="px-3 py-2 border border-hemlock rounded-lg bg-white"
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
              >
                <option>All Mandis</option>
                {list.map(s => (
                  <option key={s.label}>{s.label}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-olive">Range</label>
              <div className="flex gap-1">
                {[7, 30, 90].map(d => (
                  <button
                    key={d}
                    onClick={() => setRange(d)}
                    className={`px-3 py-1 rounded-lg border ${range === d ? 'bg-olive text-white border-olive' : 'bg-white text-olive border-hemlock'}`}
                  >
                    {d}d
                  </button>
                ))}
              </div>
            </div>

            {selected !== 'All Mandis' && (
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={overlayAverage} onChange={(e) => setOverlayAverage(e.target.checked)} />
                Compare with All-Mandi Average
              </label>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <button onClick={() => setOverlayOpen(v => !v)} className="px-3 py-2 rounded-lg border border-hemlock bg-white text-sm">Compare mandis</button>
              <button onClick={handleDownload} className="px-3 py-2 rounded-lg border border-hemlock bg-white text-sm">Download CSV</button>
            </div>
          </div>

          {overlayOpen && (
            <div className="rounded-lg border border-hemlock p-3 bg-white">
              <div className="text-sm font-medium text-olive mb-2">Overlay mandis</div>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {list.map(s => (
                  <label key={s.label} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={overlayMandis.includes(s.label)}
                      onChange={(e) => {
                        setOverlayMandis(prev => e.target.checked ? [...prev, s.label] : prev.filter(x => x !== s.label));
                      }}
                    />
                    <span className="inline-block w-3 h-3 rounded" style={{ background: s.color }} />
                    {s.label}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Chart */}
          <div className="rounded-xl border border-hemlock p-3 bg-white">
            <SimpleChart series={chartSeries} refLines={refLines} />
            <div className="mt-2 text-xs text-olive/80 flex items-center gap-4 flex-wrap">
              {chartSeries.map(s => (
                <span key={s.label} className="inline-flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded" style={{ background: s.color }} />
                  {s.label}
                </span>
              ))}
              {refLines.length > 0 && (
                <span className="inline-flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded" style={{ background: '#f59e0b' }} /> Best price reference
                </span>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-6 gap-3">
            <div className="rounded-lg border border-hemlock bg-white p-3">
              <div className="text-xs text-olive/60">Latest</div>
              <div className="text-lg font-semibold text-olive">{formatINR(statsPrimary.latest)}</div>
            </div>
            <div className="rounded-lg border border-hemlock bg-white p-3">
              <div className="text-xs text-olive/60">Average</div>
              <div className="text-lg font-semibold text-olive">{formatINR(statsPrimary.avg)}</div>
              {selected !== 'All Mandis' && (
                <div className="text-xs text-olive/70">All-mandi avg: {formatINR(statsAvg.avg)}</div>
              )}
            </div>
            <div className="rounded-lg border border-hemlock bg-white p-3">
              <div className="text-xs text-olive/60">Range</div>
              <div className="text-lg font-semibold text-olive">{formatINR(statsPrimary.min)} - {formatINR(statsPrimary.max)}</div>
            </div>
            <div className="rounded-lg border border-hemlock bg-white p-3">
              <div className="text-xs text-olive/60">Volatility (σ)</div>
              <div className="text-lg font-semibold text-olive">{statsPrimary.volatility ? Math.round(statsPrimary.volatility).toLocaleString('en-IN') : '-'}</div>
            </div>
            <div className="rounded-lg border border-hemlock bg-white p-3">
              <div className="text-xs text-olive/60">Percentile</div>
              <div className="text-lg font-semibold text-olive">{pctRank ? `${pctRank.toFixed(0)}th` : '-'}</div>
            </div>
            <div className="rounded-lg border border-hemlock bg-white p-3">
              <div className="text-xs text-olive/60">Change</div>
              <div className="text-xs text-olive/80">7d: {changeBadge(last7Stats.changePct)}</div>
              <div className="text-xs text-olive/80">30d: {changeBadge(last30Stats.changePct)}</div>
            </div>
          </div>

          {/* Advisory */}
          <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-3 text-olive/90">
            <div className="text-sm font-semibold">Advisory</div>
            <div className="text-sm">
              {(() => {
                const cur = statsPrimary.latest;
                const avg = statsPrimary.avg;
                if (cur && avg) {
                  const diff = ((cur - avg) / avg) * 100;
                  if (diff >= 5) return 'Current price is above the recent average. It may be a favorable time to sell.';
                  if (diff <= -5) return 'Current price is below the recent average. Consider waiting if market outlook is stable.';
                  return 'Current price is close to the recent average. Monitor for small swings or local demand changes.';
                }
                return 'Insufficient data for a detailed advisory.';
              })()}
            </div>
          </div>

          {/* Best mandis now */}
          {analytics.top3 && analytics.top3.length > 0 && (
            <div className="rounded-lg border border-hemlock bg-white p-3">
              <div className="text-sm font-medium text-olive mb-2">Best Mandi Now</div>
              <div className="grid md:grid-cols-3 gap-2">
                {analytics.top3.map((t, i) => (
                  <div key={i} className="rounded border border-hemlock/70 p-2">
                    <div className="text-sm font-semibold text-olive">{t.mandi}</div>
                    <div className="text-sm text-green-700">{formatINR(t.value)}</div>
                    {analytics.best && t.mandi === analytics.best.mandi && (
                      <div className="text-xs text-yellow-700 mt-1">Best current price</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* History table */}
          <div className="rounded-lg border border-hemlock bg-white">
            <div className="px-3 py-2 border-b border-hemlock/60 text-sm font-medium text-olive">Recent Data ({selected})</div>
            <div className="max-h-56 overflow-auto">
              <table className="w-full text-sm">
                <thead className="bg-olive/5">
                  <tr>
                    <th className="text-left px-3 py-2">Date</th>
                    <th className="text-left px-3 py-2">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {primaryPoints.slice(-50).map((p, idx) => (
                    <tr key={idx} className="odd:bg-white even:bg-olive/3">
                      <td className="px-3 py-2">{new Date(p.date).toLocaleDateString()}</td>
                      <td className="px-3 py-2">{formatINR(p.value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}