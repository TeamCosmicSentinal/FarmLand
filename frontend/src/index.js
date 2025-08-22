import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './components/AuthContext';
import { setAuthToken } from './api/api';

// Initialize Axios auth header from persisted token if present
try {
  const raw = localStorage.getItem('agroguru_auth');
  if (raw) {
    const parsed = JSON.parse(raw);
    if (parsed?.token) setAuthToken(parsed.token);
  }
} catch {}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
