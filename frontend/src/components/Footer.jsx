import React, { useState } from 'react';

export default function Footer() {
  const [showContact, setShowContact] = useState(false);
  return (
    <>
      {showContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-card rounded-2xl shadow-lg p-6 sm:p-8 max-w-md w-full flex flex-col items-center relative animate-fade-in text-text border border-primary/10">
            <button
              className="absolute top-4 right-4 text-text-muted hover:text-text transition-colors duration-200 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-accent rounded-full w-8 h-8 flex items-center justify-center"
              onClick={() => setShowContact(false)}
              aria-label="Close Contact Card"
            >
              &times;
            </button>
            <h2 className="text-2xl font-heading font-bold text-olive mb-3 tracking-wide">Contact Us</h2>
            <div className="mb-4 text-sm text-text-muted">
              <div className="flex items-center gap-2 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>support@agriguru.com</span>
              </div>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+91-9876543210</span>
              </div>
            </div>
            <textarea 
              className="w-full border border-hemlock/20 rounded-lg p-3 mb-4 text-text bg-offwhite focus:ring-2 focus:ring-accent focus:border-accent/50 outline-none transition-all duration-200 shadow-sm" 
              rows={3} 
              placeholder="Your review or query..." 
            />
            <button className="btn btn-green font-heading rounded-xl shadow-md transition-all duration-200 hover:scale-105 active:scale-100 w-full">
              <span className="flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Send Message
              </span>
            </button>
          </div>
        </div>
      )}
      <div className="divider" />
      <footer
        style={{ 
          background: "linear-gradient(to right, rgba(30, 86, 49, 0.98), rgba(30, 86, 49, 0.95)), url('/leafy-accent.svg') no-repeat left top", 
          backgroundSize: '120px 120px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}
        className="text-offwhite py-8 sm:py-10 font-sans transition-colors duration-300 shadow-lg"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 font-heading font-bold text-xl text-offwhite">
            <div className="w-12 h-12 rounded-full overflow-hidden shadow-md border-2 border-offwhite/20">
              <img src="https://i.postimg.cc/W4BdVRqB/IMG-20250712-WA0000.jpg" alt="AgroWise Logo" className="w-full h-full object-cover" />
            </div>
            <span className="tracking-wide">AgriGuru</span>
          </div>
          <div className="text-offwhite/90 text-sm flex gap-6">
            <button 
              onClick={() => setShowContact(true)} 
              className="text-offwhite no-underline hover:text-gold-light hover:underline transition-all duration-200 bg-transparent border-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-offwhite/30 rounded-lg px-2 py-1"
            >
              Contact Us
            </button>
          </div>
          <div className="text-offwhite/80 text-sm">&copy; {new Date().getFullYear()} AgriGuru. All rights reserved.</div>
        </div>
      </footer>
    </>
  );
}
