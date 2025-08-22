import React from 'react';
import Dashboard from './Dashboard';

function DashboardPage() {
  return (
    <section className="bg-sky text-olive py-12 px-4 md:px-8 rounded-2xl shadow-card min-h-[60vh]">
      <div className="max-w-4xl mx-auto pt-6">
        <h2 className="text-3xl md:text-4xl font-heading font-bold flex items-center gap-2 mb-4">
          <span role="img" aria-label="dashboard">📊</span> Dashboard
        </h2>
        <div className="divider" />
        <Dashboard />
      </div>
    </section>
  );
}

export default DashboardPage;
