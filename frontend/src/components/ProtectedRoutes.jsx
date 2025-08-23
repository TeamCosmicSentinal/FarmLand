import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RequireAuth from './RequireAuth';
import Home from './Home';
import CropRecommendationPage from './CropRecommendationPage';
import WeatherPage from './WeatherPage';
import TipsPage from './TipsPage';
import SchemesPage from './SchemesPage';
import DashboardPage from './DashboardPage';
import ChatbotPage from './ChatbotPage';
import AboutPage from './AboutPage';
import SatelliteInsightPage from './SatelliteInsightPage';
import CropPricesPage from './CropPricesPage';
import MarketplacePage from './MarketplacePage';
import CertificationPage from './CertificationPage';
import SuperuserDashboard from './SuperuserDashboard';

export default function ProtectedRoutes() {
  return (
    <Routes>
      {/* Public auth routes are declared in App.jsx */}
      <Route
        path="/"
        element={
          <RequireAuth>
            <Home />
          </RequireAuth>
        }
      />
      <Route path="/crop-recommendation" element={<RequireAuth><CropRecommendationPage /></RequireAuth>} />
      <Route path="/weather" element={<RequireAuth><WeatherPage /></RequireAuth>} />
      <Route path="/tips" element={<RequireAuth><TipsPage /></RequireAuth>} />
      <Route path="/schemes" element={<RequireAuth><SchemesPage /></RequireAuth>} />
      <Route path="/crop-prices" element={<RequireAuth><CropPricesPage /></RequireAuth>} />
      <Route path="/dashboard" element={<RequireAuth><DashboardPage /></RequireAuth>} />
      <Route path="/chatbot" element={<RequireAuth><ChatbotPage /></RequireAuth>} />
      <Route path="/about" element={<RequireAuth><AboutPage /></RequireAuth>} />
      <Route path="/satellite-insight" element={<RequireAuth><SatelliteInsightPage /></RequireAuth>} />
      <Route path="/marketplace" element={<RequireAuth><MarketplacePage /></RequireAuth>} />
      <Route path="/certification" element={<RequireAuth><CertificationPage /></RequireAuth>} />
      <Route path="/superuser" element={<RequireAuth><SuperuserDashboard /></RequireAuth>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}