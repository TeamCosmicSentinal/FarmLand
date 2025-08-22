import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const menu = [
  { name: 'Home', path: '/' },
  { name: 'Crop Recommendation', path: '/crop-recommendation' },
  { name: 'Weather', path: '/weather' },
  { name: 'Organic Tips', path: '/tips' },
  { name: 'Government Schemes', path: '/schemes' },
  { name: 'Crop Prices', path: '/crop-prices' },
  { name: 'Chatbot', path: '/chatbot' },
  { name: 'Satellite Insight', path: '/satellite-insight' },
];

function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav
      style={{ background: "#0A400C url('/leafy-accent.svg') no-repeat left top", backgroundSize: '120px 120px' }}
      className="text-offwhite shadow-card transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto px-4 flex items-center h-20">
        <div className="flex items-center flex-shrink-0 mr-8">
          <Link to="/" className="flex items-center text-3xl font-heading font-bold text-offwhite gap-2">
            <img src="https://i.postimg.cc/W4BdVRqB/IMG-20250712-WA0000.jpg" alt="AgroWise Logo" className="w-14 h-14 rounded-full object-cover" />
            <span className="tracking-tight">AgriGuru</span>
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-end gap-2">
          <button className="md:hidden p-2 rounded-lg hover:bg-offwhite/10 transition-colors duration-200 text-offwhite" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            <svg className="w-7 h-7 text-offwhite" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
          <div className={`md:flex gap-2 font-sans font-medium items-center ${open ? 'block absolute bg-hemlock left-0 right-0 top-20 shadow-lg p-4 rounded-b-xl z-40' : 'hidden md:flex'}`}> 
            {menu.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-5 py-2 mx-1 rounded-xl transition-colors duration-300 text-base flex items-center justify-center font-sans tracking-wide
                  text-white no-underline hover:text-gold hover:font-semibold focus:outline-none ${isActive ? 'font-bold' : ''}`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
