import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from './AuthContext';
import LogoutButton from './LogoutButton';

function Navbar() {
  const [open, setOpen] = useState(false);
  const { token, user } = useAuth();
  const isSuperuser = user?.role === 'superuser';
  const menu = [
    { name: 'Home', path: '/' },
    { name: 'Crop Recommendation', path: '/crop-recommendation' },
    { name: 'Weather', path: '/weather' },
    { name: 'Organic Tips', path: '/tips' },
    { name: 'Government Schemes', path: '/schemes' },
    { name: 'Crop Prices', path: '/crop-prices' },
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'Certification', path: '/certification' },
    { name: 'Satellite Insight', path: '/satellite-insight' },
    { name: 'Chatbot', path: '/chatbot' },
    ...(isSuperuser ? [{ name: 'Superuser', path: '/superuser' }] : []),
  ];
  return (
    <nav className="sticky top-0 z-50 bg-primary text-offwhite shadow-md backdrop-blur supports-[backdrop-filter]:bg-primary/95 border-b border-primary-light/10">
      <div className="w-full px-3 sm:px-4 md:px-6 flex flex-wrap items-center gap-2 py-2">
        <div className="flex items-center flex-shrink-0 mr-4">
          <Link to="/" className="flex items-center text-2xl font-heading font-bold text-offwhite gap-2 hover:opacity-90 transition-opacity duration-200">
            <div className="w-10 h-10 rounded-full overflow-hidden shadow-md border-2 border-offwhite/20">
              <img src="https://i.postimg.cc/W4BdVRqB/IMG-20250712-WA0000.jpg" alt="AgroWise Logo" className="w-full h-full object-cover" />
            </div>
            <span className="tracking-tight">AgriGuru</span>
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-end gap-3 min-w-0">
          {token ? (
            <>
              <button 
                className="md:hidden p-2 rounded-lg hover:bg-primary-light/20 active:bg-primary-light/30 transition-all duration-200 text-offwhite focus:outline-none focus:ring-2 focus:ring-offwhite/30" 
                onClick={() => setOpen(!open)} 
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6 text-offwhite" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
                </svg>
              </button>
              <div 
                className={`${open ? 'block absolute bg-primary left-0 right-0 top-full shadow-lg p-3 rounded-b-xl z-40 border-t border-primary-light/10 animate-fade-in' : 'hidden md:flex'} 
                md:static md:bg-transparent md:shadow-none md:p-0 md:border-none md:rounded-none md:z-auto flex-row flex-wrap md:flex-nowrap md:items-center gap-1 md:gap-2 font-sans font-medium overflow-x-auto md:overflow-visible whitespace-normal`}
              >
                {menu.map(item => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `px-4 py-2 mx-0 md:mx-0.5 rounded-lg transition-all duration-200 text-sm flex items-center justify-center font-sans tracking-wide
                      text-offwhite no-underline hover:bg-primary-light/30 ${isActive ? 'bg-primary-light/40 font-semibold shadow-sm' : ''}`
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
                {/* Moved logout to a fixed bottom-left button; removed from navbar */}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <NavLink to="/login" className="btn btn-green hover:scale-105 active:scale-100 transition-transform duration-200">Login</NavLink>
              <NavLink to="/register" className="btn btn-gold hover:scale-105 active:scale-100 transition-transform duration-200">Register</NavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
