import React, { useState } from 'react';
import { getSatelliteInsight } from '../api/api';

function NDVICircle({ value }) {
  // value: 0-1
  const percent = Math.round(value * 100);
  const stroke = 8;
  const radius = 32;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percent / 100) * circumference;
  return (
    <svg height={radius * 2} width={radius * 2} className="block mx-auto">
      <circle
        stroke="#334155"
        fill="none"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke="#22D3EE"
        fill="none"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference + ' ' + circumference}
        style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s' }}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        fontSize="1.1rem"
        fill="#F8FAFC"
        fontWeight="bold"
      >
        {value}
      </text>
    </svg>
  );
}

export default function SatelliteInsightPage() {
  const [location, setLocation] = useState('');
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [useCoords, setUseCoords] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  const handleFetch = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null); setResult(null);
    try {
      let payload = {};
      if (useCoords && lat && lon) {
        payload = { lat: parseFloat(lat), lon: parseFloat(lon) };
      } else {
        payload = { location };
      }
      const res = await getSatelliteInsight(payload);
      setResult(res.data);
    } catch (err) {
      setError('Failed to fetch satellite insight');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-sky text-olive py-12 px-4 md:px-8 rounded-2xl shadow-card min-h-[60vh]">
      <div className="w-full max-w-3xl mx-auto pt-6">
        <h2 className="text-3xl md:text-4xl font-heading font-bold flex items-center gap-2 mb-4">
          <span role="img" aria-label="satellite">🛰️</span> Satellite Insight
        </h2>
        <div className="divider" />
        <form onSubmit={handleFetch} className="flex flex-col gap-3 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <label className="text-sm text-leaf font-medium">
              <input type="checkbox" checked={useCoords} onChange={e => setUseCoords(e.target.checked)} className="mr-2" />
              Use exact coordinates
            </label>
          </div>
          {useCoords ? (
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                className="border border-hemlock bg-offwhite text-black rounded-lg p-2 flex-1 focus:ring-2 focus:ring-leaf outline-none transition"
                placeholder="Latitude (e.g. 29.335)"
                value={lat}
                onChange={e => setLat(e.target.value)}
                type="number"
                step="any"
                required
              />
              <input
                className="border border-hemlock bg-offwhite text-black rounded-lg p-2 flex-1 focus:ring-2 focus:ring-leaf outline-none transition"
                placeholder="Longitude (e.g. 80.099)"
                value={lon}
                onChange={e => setLon(e.target.value)}
                type="number"
                step="any"
                required
              />
            </div>
          ) : (
            <input
              className="border border-hemlock bg-offwhite text-black rounded-lg p-2 flex-1 focus:ring-2 focus:ring-leaf outline-none transition"
              placeholder="Enter location (city, village, etc.)"
              value={location}
              onChange={e => setLocation(e.target.value)}
              required
            />
          )}
          <button
            className="btn btn-green font-heading rounded-xl shadow-card transition-all duration-200 hover:scale-105 active:scale-100"
            type="submit"
            disabled={loading || (useCoords && (!lat || !lon)) || (!useCoords && !location)}
          >
            {loading ? 'Loading...' : 'Get Insight'}
          </button>
        </form>
        {error && <div className="text-red-500 bg-offwhite rounded p-2 border border-red-600 animate-pulse mb-2">{error}</div>}
        {result && (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="feature-gold rounded-2xl shadow-card p-6 border border-hemlock flex flex-col items-center">
              <div className="w-full flex flex-col items-center mb-4">
                <span className="text-2xl">📍</span>
                <span className="text-black text-sm font-semibold">Location</span>
                <span className="text-olive font-heading font-bold text-lg">{result.location}</span>
                <span className="text-black text-xs">Lat: {result.lat.toFixed(3)} | Lon: {result.lon.toFixed(3)}</span>
              </div>
              <div className="w-full flex flex-col items-center mb-4">
                <span className="text-2xl">🧑‍🌾</span>
                <span className="text-black text-sm font-semibold">Crop Health</span>
                <span className="font-heading font-bold text-lg text-leaf">{result.status}</span>
                <div className="text-black text-center mt-1">{result.recommendation}</div>
              </div>
            </div>
            <div className="feature-green rounded-2xl shadow-card p-6 border border-hemlock flex flex-col items-center">
              <span className="text-2xl mb-2">🌱</span>
              <span className="text-black text-sm font-semibold mb-2">NDVI</span>
              <div className="relative flex flex-col items-center mb-2">
                <NDVICircle value={result.ndvi} />
                <span className="absolute top-0 right-0 px-2 py-0.5 rounded-full text-xs font-bold bg-gold text-black">{result.status}</span>
              </div>
              {/* Satellite image preview */}
              {result.lat && result.lon && (
                <div className="w-full flex flex-col items-center mb-2">
                  <span className="text-black text-sm font-semibold mb-1">Satellite Image Preview</span>
                  <img
                    src={`https://static-maps.yandex.ru/1.x/?lang=en-US&ll=${result.lon},${result.lat}&z=10&l=sat&size=450,250`}
                    alt="Satellite preview"
                    className="rounded-lg shadow border border-hemlock max-w-xs"
                    style={{ minHeight: 120, background: '#222' }}
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                  <span className="text-xs text-black mt-1">Powered by Yandex Satellite</span>
                </div>
              )}
            </div>
          </div>
        )}
        {result && (
          <button
            className="mt-6 text-xs text-leaf underline hover:text-black"
            onClick={() => setShowInfo(v => !v)}
            type="button"
          >
            {showInfo ? 'Hide' : 'What is NDVI & Crop Health?'}
          </button>
        )}
        {showInfo && (
          <div className="mt-2 p-3 bg-offwhite border-l-4 border-leaf rounded shadow text-black text-sm w-full">
            <b>NDVI (Normalized Difference Vegetation Index):</b> NDVI is a satellite-derived value between 0 and 1 that measures crop greenness and health. Higher values (closer to 1) mean healthier, greener crops. <br />
            <b>Crop Health:</b> Based on NDVI, this shows if crops are healthy, moderate, or stressed. <br />
            <span className="text-xs text-black">🟢 Healthy: NDVI &gt; 0.7 &nbsp; | &nbsp; 🟡 Moderate: 0.5 - 0.7 &nbsp; | &nbsp; 🟤 Unhealthy: &lt; 0.5</span>
          </div>
        )}
      </div>
    </section>
  );
} 