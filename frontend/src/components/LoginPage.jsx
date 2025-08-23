import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login as apiLogin, superuserLogin } from '../api/api';
import { useAuth } from './AuthContext';
import './AuthInput.css';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [suOpen, setSuOpen] = useState(false);
  const [suKey, setSuKey] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await apiLogin({ email, password });
      login(res.data.token, res.data.user);
      navigate('/', { replace: true });
    } catch (e) {
      setError(e?.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-4 mt-0">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-heading font-bold text-primary mb-2">Welcome Back</h1>
        <p className="text-text-muted">Sign in to access your AgriGuru account</p>
      </div>
      
      {error && (
        <div className="bg-error-light text-error rounded-lg p-4 border border-error/20 mb-6 animate-fade-in">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        </div>
      )}
      
      <form onSubmit={submit} className="bg-card rounded-xl shadow-md p-6 sm:p-8 border border-primary/10 transition-all duration-300 hover:shadow-lg">
        <div className="mb-5">
          <label className="block mb-2 font-heading font-medium text-primary">Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </div>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="you@example.com" 
              required 
              className="w-full border border-primary/10 bg-offwhite text-text rounded-lg py-2 pl-10 pr-3 focus:ring-2 focus:ring-accent focus:border-accent/50 outline-none transition-all duration-200 shadow-sm" 
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block mb-2 font-heading font-medium text-primary">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="••••••••" 
              required 
              className="w-full border border-primary/10 bg-offwhite text-text rounded-lg py-2 pl-10 pr-3 focus:ring-2 focus:ring-accent focus:border-accent/50 outline-none transition-all duration-200 shadow-sm" 
            />
          </div>
        </div>
        
        <button 
          type="submit" 
          className="btn btn-green w-full font-heading text-lg rounded-lg shadow-md transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2" 
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span>Login</span>
            </>
          )}
        </button>
      </form>
      
      <div className="text-center mt-6 text-text-muted">
        No account yet? <Link to="/register" className="text-accent font-medium hover:text-primary transition-colors duration-200">Register</Link>
      </div>

      {/* Superuser access */}
      <div className="text-center mt-6">
        <button
          type="button"
          onClick={() => setSuOpen((v) => !v)}
          className="text-olive/70 hover:text-primary underline"
        >
          Superuser Login
        </button>
      </div>

      {suOpen && (
        <div className="mt-4 bg-background-alt border border-primary/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="font-heading font-semibold text-primary">Enter Superuser Key</div>
            <button className="text-olive/60 hover:text-error" onClick={() => setSuOpen(false)}>✕</button>
          </div>
          <div className="flex gap-2">
            <input
              type="password"
              value={suKey}
              onChange={e => setSuKey(e.target.value)}
              placeholder="Admin key"
              className="flex-1 border border-primary/10 bg-offwhite text-text rounded-lg py-2 px-3 focus:ring-2 focus:ring-accent focus:border-accent/50 outline-none shadow-sm"
            />
            <button
              type="button"
              className="btn btn-green"
              onClick={async () => {
                setError(''); setLoading(true);
                try {
                  const res = await superuserLogin(suKey);
                  login(res.data.token, res.data.user);
                  navigate('/superuser', { replace: true });
                } catch (e) {
                  setError(e?.response?.data?.error || 'Superuser login failed');
                } finally {
                  setLoading(false);
                }
              }}
            >
              Access
            </button>
          </div>
          <div className="text-xs text-olive/60 mt-2">Use the private key provided by the system administrator.</div>
        </div>
      )}
    </div>
  );
}