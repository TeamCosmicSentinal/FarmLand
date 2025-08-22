import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import CropRecommendationPage from './components/CropRecommendationPage';
import WeatherPage from './components/WeatherPage';
import TipsPage from './components/TipsPage';
import SchemesPage from './components/SchemesPage';
import DashboardPage from './components/DashboardPage';
import ChatbotPage from './components/ChatbotPage';
import AboutPage from './components/AboutPage';
import SatelliteInsightPage from './components/SatelliteInsightPage';
import CropPricesPage from './components/CropPricesPage';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <main className="flex-1 pt-20 pb-8 px-2 md:px-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/crop-recommendation" element={<CropRecommendationPage />} />
            <Route path="/weather" element={<WeatherPage />} />
            <Route path="/tips" element={<TipsPage />} />
            <Route path="/schemes" element={<SchemesPage />} />
            <Route path="/crop-prices" element={<CropPricesPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/chatbot" element={<ChatbotPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/satellite-insight" element={<SatelliteInsightPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
