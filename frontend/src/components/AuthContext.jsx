import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { setAuthToken } from '../api/api';

// Simple auth context to share token and user across the app
const AuthContext = createContext({
  token: null,
  user: null,
  login: () => {},
  logout: () => {},
  setToken: () => {},
  setUser: () => {},
});

const STORAGE_KEY = 'agroguru_auth';

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  // Load persisted auth on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          if (parsed.token) setToken(parsed.token);
          if (parsed.user) setUser(parsed.user);
        }
      }
    } catch (e) {
      // ignore storage errors
    }
  }, []);

  // Persist on change and set axios header
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }));
    } catch (e) {
      // ignore storage errors
    }
    setAuthToken(token);
  }, [token, user]);

  const login = (nextToken, nextUser) => {
    setToken(nextToken || null);
    setUser(nextUser || null);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setAuthToken(null);
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
  };

  const value = useMemo(() => ({ token, user, login, logout, setToken, setUser }), [token, user]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;