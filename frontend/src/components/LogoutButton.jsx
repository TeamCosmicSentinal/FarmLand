import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout as apiLogout } from '../api/api';
import { useAuth } from './AuthContext';

export default function LogoutButton({ className = '' }) {
  const [loading, setLoading] = useState(false);
  const { token, logout: doLogout } = useAuth();
  const navigate = useNavigate();

  const handle = async () => {
    setLoading(true);
    try { if (token) await apiLogout(); } catch {}
    doLogout();
    navigate('/login', { replace: true });
    setLoading(false);
  };

  return (
    <button onClick={handle} className={`btn btn-green ${className}`} disabled={loading}>
      {loading ? 'Signing out...' : 'Logout'}
    </button>
  );
}