import React, { useEffect, useState } from 'react';
import { getDashboard } from '../api/api';

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true); setError(null);
    getDashboard().then(res => setData(res.data)).catch(() => setError('Failed to fetch dashboard')).finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-offwhite p-8 rounded-2xl shadow-card flex flex-wrap gap-8 items-center border border-hemlock transition-all duration-200 hover:scale-[1.01]">
      {loading && <span className="text-leaf font-heading">Loading...</span>}
      {error && <span className="text-red-500 bg-offwhite rounded p-2 border border-red-600 animate-pulse">{error}</span>}
      <div>
        <div className="font-heading font-bold text-olive mb-1">Queries Made</div>
        <div className="text-black text-lg font-sans">{data ? data.queries : '-'}</div>
      </div>
      <div>
        <div className="font-heading font-bold text-olive mb-1">Crops Suggested</div>
        <div className="text-black text-lg font-sans">{data ? data.crops.join(', ') : '-'}</div>
      </div>
      {/* Add more dashboard stats as needed */}
    </div>
  );
}
export default Dashboard;
