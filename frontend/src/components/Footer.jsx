import React, { useState } from 'react';

export default function Footer() {
  const [showContact, setShowContact] = useState(false);
  return (
    <>
      {showContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-offwhite rounded-2xl shadow-card p-8 max-w-md w-full flex flex-col items-center relative animate-fade-in text-black">
            <button
              className="absolute top-4 right-4 text-hemlock hover:text-black text-2xl font-bold focus:outline-none"
              onClick={() => setShowContact(false)}
              aria-label="Close Contact Card"
            >
              &times;
            </button>
            <h2 className="text-2xl font-heading font-bold text-olive mb-2 tracking-wide">Contact Us</h2>
            <div className="mb-2 text-sm text-black/80">Email: support@agriguru.com<br/>Phone: +91-9876543210</div>
            <textarea className="w-full border border-hemlock rounded-lg p-3 mb-3 text-black bg-offwhite focus:ring-2 focus:ring-leaf outline-none transition" rows={3} placeholder="Your review or query..." />
            <button className="btn btn-green font-heading rounded-xl shadow-card transition-all duration-200 hover:scale-105 active:scale-100 w-full">Send</button>
          </div>
        </div>
      )}
      <div className="divider" />
      <footer
        style={{ background: "#0A400C url('/leafy-accent.svg') no-repeat left top", backgroundSize: '120px 120px' }}
        className="text-offwhite py-8 font-sans transition-colors duration-300"
      >
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-heading font-bold text-xl text-offwhite">
            <img src="https://i.postimg.cc/W4BdVRqB/IMG-20250712-WA0000.jpg" alt="AgroWise Logo" className="w-14 h-14 rounded-full object-cover" />
            <span>AgriGuru</span>
          </div>
          <div className="text-offwhite/80 text-sm flex gap-4">
            <button onClick={() => setShowContact(true)} className="text-white no-underline hover:text-gold hover:font-semibold transition-colors duration-300 bg-transparent border-none cursor-pointer">Contact</button>
          </div>
          <div className="text-offwhite/80 text-sm">&copy; {new Date().getFullYear()} AgriGuru. All rights reserved.</div>
        </div>
      </footer>
    </>
  );
}
