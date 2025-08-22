import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register as apiRegister } from '../api/api';
import { useAuth } from './AuthContext';
import './AuthInput.css';

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await apiRegister({ name, email, password });
      login(res.data.token, res.data.user);
      navigate('/', { replace: true });
    } catch (e) {
      const msg = e?.response?.data?.error || e?.response?.data?.details?.[0] || 'Registration failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-4 mt-0">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-heading font-bold text-primary mb-2">Create Account</h1>
        <p className="text-text-muted">Join AgriGuru and start your farming journey</p>
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
          <label className="block mb-2 font-heading font-medium text-primary">Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="Your name" 
              required 
              className="w-full border border-primary/10 bg-offwhite text-text rounded-lg py-2 pl-10 pr-3 focus:ring-2 focus:ring-accent focus:border-accent/50 outline-none transition-all duration-200 shadow-sm" 
            />
          </div>
        </div>
        
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
              placeholder="At least 6 characters" 
              required 
              className="w-full border border-primary/10 bg-offwhite text-text rounded-lg py-2 pl-10 pr-3 focus:ring-2 focus:ring-accent focus:border-accent/50 outline-none transition-all duration-200 shadow-sm" 
            />
          </div>
        </div>
        
        <button 
          type="submit" 
          className="btn btn-gold w-full font-heading text-lg rounded-lg shadow-md transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2" 
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Creating account...</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              <span>Register</span>
            </>
          )}
        </button>
      </form>
      
      <div className="text-center mt-6 text-text-muted">
        Already have an account? <Link to="/login" className="text-accent font-medium hover:text-primary transition-colors duration-200">Login</Link>
      </div>
    </div>
  );
}