import React, { useEffect, useState } from 'react';
import { getCropHealth } from '../api/api';

function CropHealthIndicator() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true); setError(null);
    getCropHealth().then(res => setHealth(res.data)).catch(() => setError('Failed to fetch crop health')).finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-card p-4 rounded shadow flex items-center gap-4">
      <h2 className="text-xl font-semibold text-accent">Crop Health</h2>
      {loading && <span className="text-accent">Loading...</span>}
      {error && <span className="text-red-400">{error}</span>}
      {health && (
        <div className={`w-6 h-6 rounded-full ${health.status === 'green' ? 'bg-accent' : 'bg-red-500'}`}></div>
      )}
      <span className="text-text">{health ? `NDVI: ${health.ndvi}` : ''}</span>
    </div>
  );
}
export default CropHealthIndicator;
