import React, { useState } from 'react';
import { getWeather, recommendCrop, getTips } from '../api/api';

function WeatherCard() {
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [crops, setCrops] = useState([]);
  const [cropReason, setCropReason] = useState('');
  const [tip, setTip] = useState(null);

  // Helper to parse markdown table and extract crop names
  function parseMarkdownTable(md) {
    if (!md) return [];
    const lines = md.trim().split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length < 2) return [];
    // Skip header and alignment row(s)
    let rowStart = 1;
    while (rowStart < lines.length && /^\|?\s*:?[-]+/.test(lines[rowStart])) rowStart++;
    const rows = lines.slice(rowStart).map(line =>
      line.replace(/^\|/, '').replace(/\|$/, '').split('|').map(cell => cell.trim())
    ).filter(row => row.length > 0 && row[0] && row[0].toLowerCase() !== 'crop');
    // Return just the crop names (first column)
    return rows.map(row => row[0]);
  }

  const handleFetch = async () => {
    setLoading(true); setError(null); setWeather(null); setCrops([]); setCropReason(''); setTip(null);
    try {
      const res = await getWeather({ location, user_id: 'guest' });
      setWeather(res.data);
      // For crop recommendation, use the first forecasted day as the season (simple logic)
      const today = new Date();
      let season = '';
      const month = today.getMonth() + 1;
      if ([6,7,8,9,10].includes(month)) season = 'Kharif';
      else if ([11,12,1,2].includes(month)) season = 'Rabi';
      else season = 'Zaid';
      // Fetch crops and tips in parallel
      const [cropRes, tipRes] = await Promise.all([
        recommendCrop({ location, season, soil: '', user_id: 'guest' }),
        getTips()
      ]);
      // Parse markdown table to get crop names
      let cropList = [];
      if (cropRes.data && cropRes.data.table) {
        cropList = parseMarkdownTable(cropRes.data.table);
      }
      setCrops(cropList);
      setCropReason(''); // Optionally, you can add a reason or leave blank
      if (tipRes.data && tipRes.data.length > 0) {
        setTip(tipRes.data[Math.floor(Math.random() * tipRes.data.length)]);
      }
    } catch (err) {
      setError('Failed to fetch weather or crops');
    } finally {
      setLoading(false);
    }
  };

  // Helper to get only today + next 3 days
  const getForecastDays = (weather) => {
    if (!Array.isArray(weather)) return [];
    return weather.slice(0, 4);
  };

  return (
    <div className="bg-offwhite rounded-2xl shadow-card p-8 border border-hemlock text-olive">
      <div className="flex items-center gap-3 mb-3">
        <span className="inline-flex items-center justify-center bg-gold text-black rounded-full w-10 h-10 shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1.5m0 15V21m8.485-8.485l-1.06 1.06M4.515 4.515l1.06 1.06M21 12h-1.5M3 12H1.5m16.97 5.485l-1.06-1.06M6.03 17.97l1.06-1.06" />
          </svg>
        </span>
        <h2 className="text-2xl font-heading font-bold text-olive tracking-tight">Weather Forecast</h2>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input className="border border-hemlock bg-offwhite text-black rounded-lg p-2 flex-1 focus:ring-2 focus:ring-leaf outline-none transition" placeholder="Enter Location" value={location} onChange={e => setLocation(e.target.value)} />
        <button className="btn btn-green font-heading rounded-xl shadow-card transition-all duration-200 hover:scale-105 active:scale-100" onClick={handleFetch} disabled={loading}>{loading ? 'Loading...' : 'Fetch Weather'}</button>
      </div>
      {loading && (
        <div className="flex justify-center items-center py-8">
          <svg className="animate-spin h-8 w-8 text-leaf" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
        </div>
      )}
      {error && <div className="text-red-500 bg-offwhite rounded p-2 border border-red-600 animate-pulse mb-2">{error}</div>}
      {weather && getForecastDays(weather).length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {getForecastDays(weather).map((w, i) => (
            <div key={i} className={`${i % 2 === 0 ? 'feature-gold' : 'feature-green'} border border-hemlock p-4 shadow-card flex flex-col items-center min-w-[140px] max-w-[180px] mx-auto`}>
              <div className="font-heading font-bold text-olive mb-1 text-base">{i === 0 ? 'Today' : `Day ${i+1}`}</div>
              <div className="flex flex-wrap justify-center gap-2 w-full mb-2">
                <WeatherMetric icon="🌡️" label="Temp" value={`${w.temp}°C`} />
                <WeatherMetric icon="💧" label="Humidity" value={`${w.humidity}%`} />
                <WeatherMetric icon="🌧️" label="Rain" value={`${w.rain}mm`} />
                <WeatherMetric icon="💨" label="Wind" value={`${w.wind} m/s`} />
              </div>
              <div className="text-xs text-black mt-1 truncate w-full text-center" title={w.datetime}>{w.datetime}</div>
            </div>
          ))}
        </div>
      )}
      {crops.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-heading font-bold text-leaf mb-2 flex items-center gap-2">🌱 Suitable Crops for This Weather</h3>
          <div className="flex flex-wrap gap-3">
            {crops.map((crop, i) => (
              <span key={i} className={`${i % 2 === 0 ? 'feature-gold' : 'feature-green'} px-4 py-2 rounded-lg font-semibold shadow text-black`}>{crop}</span>
            ))}
          </div>
          {cropReason && <div className="text-black text-sm mt-2">{cropReason}</div>}
        </div>
      )}
      {tip && (
        <div className="mt-4 p-4 bg-gold border-l-4 border-hemlock rounded shadow text-black flex items-center gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <b className="text-olive">Tip of the Day:</b> <span>{tip.tip}</span>
            <div className="text-xs text-black mt-1">({tip.category}, {tip.stage})</div>
          </div>
        </div>
      )}
    </div>
  );
}

function WeatherMetric({ icon, label, value }) {
  return (
    <div className="flex flex-col items-center min-w-[48px]">
      <span className="text-lg">{icon}</span>
      <span className="text-leaf font-semibold text-sm">{value}</span>
      <span className="text-xs text-black">{label}</span>
    </div>
  );
}

export default WeatherCard;
