import React, { useState } from 'react';
import { getWeather, recommendCrop, getTips } from '../api/api';

// Weather condition icons mapping
const weatherIcons = {
  clear: '☀️',
  sunny: '☀️',
  cloudy: '☁️',
  partlycloudy: '⛅',
  overcast: '☁️',
  rain: '🌧️',
  lightrain: '🌦️',
  heavyrain: '⛈️',
  thunderstorm: '⛈️',
  snow: '❄️',
  mist: '🌫️',
  fog: '🌫️',
  default: '🌤️'
};

// Get weather icon based on description
const getWeatherIcon = (description) => {
  if (!description) return weatherIcons.default;
  
  const desc = description.toLowerCase().replace(/\s+/g, '');
  
  for (const [condition, icon] of Object.entries(weatherIcons)) {
    if (desc.includes(condition)) {
      return icon;
    }
  }
  
  return weatherIcons.default;
};

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
    <div className="bg-card rounded-2xl shadow-md p-6 sm:p-8 border border-primary/10 text-text hover:shadow-lg transition-all duration-300">
      <div className="flex items-center gap-3 mb-4">
        <span className="inline-flex items-center justify-center bg-gold text-olive rounded-full w-10 h-10 shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1.5m0 15V21m8.485-8.485l-1.06 1.06M4.515 4.515l1.06 1.06M21 12h-1.5M3 12H1.5m16.97 5.485l-1.06-1.06M6.03 17.97l1.06-1.06" />
          </svg>
        </span>
        <h2 className="text-2xl font-heading font-bold text-olive tracking-tight">Weather Forecast</h2>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 mb-6 bg-gradient-to-r from-sky/30 to-background p-5 rounded-xl border border-sky/30 shadow-md">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <input 
            className="w-full border-2 border-primary/20 bg-offwhite text-text rounded-lg py-3 pl-11 pr-3 focus:ring-2 focus:ring-accent focus:border-accent/50 outline-none transition-all duration-200 shadow-sm hover:border-primary/30" 
            placeholder="Enter city or location (e.g., Mumbai, Delhi, Bangalore)" 
            value={location} 
            onChange={e => setLocation(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleFetch()}
          />
        </div>
        <button 
          className="btn-green font-heading rounded-lg shadow-md transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 py-3 px-6" 
          onClick={handleFetch} 
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Loading...</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Get Forecast</span>
            </>
          )}
        </button>
      </div>
      
      {loading && (
        <div className="flex justify-center items-center py-8 animate-pulse">
          <svg className="animate-spin h-10 w-10 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}
      
      {error && (
        <div className="bg-error-light text-error rounded-lg p-4 border border-error/20 mb-4 animate-fade-in">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        </div>
      )}
      
      {weather && getForecastDays(weather).length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-heading font-bold text-primary mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>4-Day Forecast for {location}</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {getForecastDays(weather).map((w, i) => {
              // Determine weather icon based on conditions
              const weatherIcon = getWeatherIcon(w.description || '');
              // Generate gradient based on temperature
              const tempGradient = w.temp > 30 ? 'from-yellow to-yellow-light' : 
                                  w.temp > 20 ? 'from-gold to-yellow-light' : 
                                  w.temp > 10 ? 'from-accent-bright to-accent' : 
                                  'from-sky to-sky-light';
              return (
                <div 
                  key={i} 
                  className={`bg-gradient-to-br ${tempGradient} p-5 rounded-xl shadow-md flex flex-col items-center relative overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-lg border border-white/20`}
                >
                  <div className="absolute top-0 right-0 bg-primary/10 text-primary px-3 py-1 rounded-bl-lg font-medium text-xs">
                    {i === 0 ? 'TODAY' : `DAY ${i+1}`}
                  </div>
                  
                  <div className="text-5xl mb-3 mt-2">{weatherIcon}</div>
                  
                  <div className="font-heading font-bold text-olive text-lg mb-1">
                    {w.temp}°C
                  </div>
                  
                  <div className="text-xs text-olive/80 mb-3 truncate w-full text-center" title={w.datetime}>
                    {w.datetime}
                  </div>
                  
                  <div className="w-full border-t border-white/30 pt-3 mt-1">
                    <div className="grid grid-cols-2 gap-2 w-full">
                      <WeatherMetric icon="💧" label="Humidity" value={`${w.humidity}%`} />
                      <WeatherMetric icon="🌧️" label="Rain" value={`${w.rain}mm`} />
                      <WeatherMetric icon="💨" label="Wind" value={`${w.wind} m/s`} />
                      <WeatherMetric icon="☁️" label="Cloud" value={`${w.cloud || 0}%`} />
                    </div>
                  </div>
                  
                  {w.description && (
                    <div className="mt-3 text-center text-xs font-medium text-olive bg-white/30 w-full py-1 rounded">
                      {w.description}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {crops.length > 0 && (
        <div className="mb-8 bg-background-alt p-6 rounded-xl shadow-md border border-primary/10">
          <h3 className="text-xl font-heading font-bold text-leaf mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-leaf to-accent">Recommended Crops</span>
          </h3>
          
          <p className="text-text-muted mb-4">Based on the current weather conditions in {location}, these crops are suitable for cultivation:</p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {crops.map((crop, i) => {
              // Alternate between different styles
              const bgColors = ['bg-gold/20', 'bg-accent/20', 'bg-sky/40', 'bg-primary/10'];
              const borderColors = ['border-gold', 'border-accent', 'border-sky', 'border-primary'];
              const index = i % 4;
              
              return (
                <div 
                  key={i} 
                  className={`${bgColors[index]} ${borderColors[index]} border px-4 py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105 flex items-center justify-center text-center`}
                >
                  <span className="font-semibold text-olive">{crop}</span>
                </div>
              );
            })}
          </div>
          
          {cropReason && <div className="text-text-muted text-sm mt-4 italic">{cropReason}</div>}
        </div>
      )}
      
      {tip && (
        <div className="mt-6 p-6 bg-gradient-to-r from-gold/30 to-yellow/20 rounded-xl shadow-md border border-gold/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-gold/40 px-3 py-1 rounded-bl-lg font-medium text-xs text-olive">
            {tip.category.toUpperCase()}
          </div>
          
          <div className="flex items-start gap-4">
            <div className="bg-white/60 p-3 rounded-full shadow-inner">
              <span className="text-3xl">💡</span>
            </div>
            
            <div className="flex-1">
              <h4 className="text-lg font-heading font-bold text-olive mb-2">Farming Tip</h4>
              <p className="text-text">{tip.tip}</p>
              <div className="flex items-center gap-2 mt-3">
                <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">{tip.stage}</span>
                <span className="text-text-muted text-xs">• Best practice for optimal results</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function WeatherMetric({ icon, label, value }) {
  return (
    <div className="flex flex-col items-center min-w-[48px] group">
      <span className="text-lg group-hover:scale-125 transition-transform duration-200">{icon}</span>
      <span className="text-olive font-semibold text-sm">{value}</span>
      <span className="text-xs text-olive/70">{label}</span>
    </div>
  );
}

export default WeatherCard;
