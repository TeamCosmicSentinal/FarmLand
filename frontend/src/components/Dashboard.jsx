import React, { useEffect, useState } from 'react';
import { getDashboard } from '../api/api';
import { useAuth } from './AuthContext';

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token, user } = useAuth();

  useEffect(() => {
    setLoading(true); setError(null);
    getDashboard(token)
      .then(res => setData(res.data))
      .catch(() => setError('Failed to fetch dashboard'))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="card bg-card border border-primary/10 p-6 sm:p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
      {loading && (
        <div className="flex items-center text-leaf font-heading mb-4 animate-pulse">
          <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading dashboard data...
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
      
      <div className="mb-6 text-text-muted text-sm bg-background-alt rounded-lg p-4 border border-primary/5 shadow-sm">
        {user ? (
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">Welcome back{user.name ? `, ${user.name}` : ''}!</span>
          </div>
        ) : (
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Signed in as guest</span>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="feature-gold p-5 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center bg-olive/10 text-olive rounded-full w-8 h-8 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <div className="font-heading font-bold text-olive">Queries Made</div>
          </div>
          <div className="text-black text-2xl font-sans font-semibold pl-10">{data ? data.queries : '-'}</div>
        </div>
        
        <div className="feature-green p-5 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center bg-olive/10 text-olive rounded-full w-8 h-8 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <div className="font-heading font-bold text-olive">Crops Suggested</div>
          </div>
          <div className="text-black text-lg font-sans truncate pl-10">{data ? data.crops.join(', ') : '-'}</div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
