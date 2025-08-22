import React from 'react';

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans transition-colors duration-300">
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pt-20 pb-12 grid grid-cols-1 gap-8 sm:gap-10 md:gap-12">
        {children}
      </main>
    </div>
  );
}

export default Layout;
