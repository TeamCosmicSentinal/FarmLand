import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [showTeam, setShowTeam] = useState(false);
  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center bg-sky text-olive py-12 px-4 md:px-8 rounded-b-2xl shadow-card">
      {/* Hero Section */}
      <section className="w-full max-w-4xl mx-auto bg-gold text-olive rounded-2xl shadow-card px-6 py-4 mb-8 font-heading text-xl text-center">
        Welcome to AgriGuru! Your trusted companion for modern, sustainable, and AI-powered agriculture. We empower farmers and agri-enthusiasts with personalized crop advice, weather insights, government schemes, and more—all in one vibrant, easy-to-use platform. Grow smarter, farm better, and join a thriving community dedicated to a greener future.
      </section>
      <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
        {/* Hero Text */}
        <div className="flex-1 flex flex-col items-start gap-6">
          <h1 className="text-5xl md:text-6xl font-heading font-bold text-olive mb-2 leading-tight">Empowering Indian Agriculture</h1>
          <h2 className="text-2xl md:text-3xl font-heading text-leaf font-semibold mb-4">AI-powered platform for personalized crop advice, weather, schemes, and more.</h2>
          <button
            className="btn btn-green focus-ring text-lg font-heading mt-2 px-10 py-4 rounded-xl shadow-card transition-all duration-200 hover:scale-105 active:scale-100"
            onClick={() => navigate('/crop-recommendation')}
            aria-label="Get Started"
          >
            <span className="inline-flex items-center gap-2">
              <span className="inline-block w-6 h-6 bg-gold rounded-full flex items-center justify-center text-black font-bold text-lg">GO</span>
              <span>Get Started</span>
            </span>
          </button>
        </div>
        {/* Hero Illustration */}
        <div className="flex-1 flex items-center justify-center">
          <img
            src="https://i.pinimg.com/736x/11/82/5b/11825b1e6deedc1013a5c6b2a2729659.jpg"
            alt="Modern sustainable agriculture"
            className="aspect-square w-full max-w-[676px] h-auto object-cover rounded-2xl shadow-card"
            style={{ minWidth: '220px', maxWidth: '100%', flex: '0 0 60%' }}
          />
        </div>
      </div>
      {/* Feature Cards Section */}
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <FeatureCard title="Crop Recommendation" desc="AI-driven suggestions for the best crops based on your soil, season, and location." variant="gold" />
        <FeatureCard title="Weather Forecast" desc="Accurate, location-based 5-day weather forecasts to plan your farming activities." variant="green" />
        <FeatureCard title="Organic Tips" desc="Expert tips for sustainable and organic farming at every stage of your crop cycle." variant="gold" />
        <FeatureCard title="Government Schemes" desc="Explore the latest government schemes and subsidies for farmers in your region." variant="green" />
        <FeatureCard title="Crop Prices" desc="Get the latest mandi prices for crops in your area to make informed selling decisions." variant="gold" />
        <FeatureCard title="AI Chatbot" desc="Get instant answers to your farming questions in English, Hindi, or Kannada, powered by Gemini AI." variant="green" />
        <FeatureCard title="Satellite Insight" desc="Get NDVI and crop health insights from satellite data for your field or village." variant="gold" />
      </div>
      {/* Team Button (fixed bottom right) */}
      <button
        className="fixed bottom-6 right-6 z-50 btn-gold focus-ring text-black font-heading px-6 py-3 rounded-xl shadow-card transition-all duration-200 hover:scale-105 active:scale-100"
        onClick={() => setShowTeam(true)}
        aria-label="Show Team Info"
      >
        TEAM
      </button>
      {/* Team Modal/Card Overlay */}
      {showTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-hemlock/80 backdrop-blur-sm">
          <div className="bg-offwhite rounded-2xl p-8 shadow-card max-w-lg w-full flex flex-col items-center relative animate-fade-in text-black">
            <button
              className="absolute top-4 right-4 text-hemlock hover:text-black text-2xl font-bold focus:outline-none"
              onClick={() => setShowTeam(false)}
              aria-label="Close Team Info"
            >
              &times;
            </button>
            <h2 className="text-2xl font-heading font-bold text-olive mb-6 tracking-wide">Tech Titans</h2>
            <div className="grid grid-cols-1 gap-6 w-full">
              <TeamMember name="Saurabh Joshi" role="Backend Developer" part="Backend/API" />
              <TeamMember name="Trisa Das" role="Frontend Developer" part="UI & React" />
              <TeamMember name="Nithaksha G" role="Researcher" part="Research about data and info." />
              <TeamMember name="Chiranthan M S" role="Presentation and Theme Designing" part="Making ppt and friendly themes for UI" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function FeatureCard({ title, desc, variant }) {
  // variant: 'gold' | 'green'
  const cardClass = variant === 'gold' ? 'feature-gold' : 'feature-green';
  return (
    <div className={`${cardClass} flex flex-col gap-2 group cursor-pointer hover:scale-[1.03] active:scale-100 transition-all duration-200`}
      tabIndex={0} role="region" aria-label={title}>
      <h3 className="text-xl font-heading font-bold mb-1 text-olive group-hover:underline transition-colors duration-200">{title}</h3>
      <p className="text-base leading-relaxed font-sans opacity-90 group-hover:opacity-100 transition-opacity duration-200 text-black">{desc}</p>
    </div>
  );
}

function TeamMember({ name, role, part }) {
  return (
    <div className="flex flex-col items-center bg-sky rounded-xl p-4 shadow-soft w-full border border-hemlock text-black">
      <div className="text-lg font-bold mb-1">{name}</div>
      <div className="text-black/80 text-sm font-medium text-center mb-1">{role}</div>
      <div className="text-xs text-black text-center">{part}</div>
    </div>
  );
}

export default Home;
