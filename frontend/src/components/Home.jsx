import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [showTeam, setShowTeam] = useState(false);
  
  return (
    <section className="relative min-h-[75vh] flex flex-col items-center justify-center bg-gradient-to-br from-sky to-sky/90 text-olive py-4 px-4 md:px-8 rounded-b-3xl shadow-lg">
      {/* Hero Section */}
      <section className="w-full max-w-4xl mx-auto bg-gold/90 text-olive rounded-2xl shadow-lg px-6 py-3 mb-4 font-heading text-xl text-center backdrop-blur-sm border border-gold/30">
        Welcome to AgriGuru! Your trusted companion for modern, sustainable, and AI-powered agriculture. We empower farmers and agri-enthusiasts with personalized crop advice, weather insights, government schemes, and more—all in one vibrant, easy-to-use platform. Grow smarter, farm better, and join a thriving community dedicated to a greener future.
      </section>
      <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
        {/* Hero Text */}
        <div className="flex-1 flex flex-col items-start gap-6">
          <h1 className="text-5xl md:text-6xl font-heading font-bold text-olive mb-3 leading-tight animate-fade-in">Empowering Indian Agriculture</h1>
          <h2 className="text-2xl md:text-3xl font-heading text-leaf font-semibold mb-5">AI-powered platform for personalized crop advice, weather, schemes, and more.</h2>
          <button
            className="btn btn-green focus-ring text-lg font-heading mt-3 px-10 py-4 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-100"
            onClick={() => navigate('/crop-recommendation')}
            aria-label="Get Started"
          >
            <span className="inline-flex items-center gap-3">
              <span className="inline-block w-7 h-7 bg-gold rounded-full flex items-center justify-center text-black font-bold text-lg shadow-sm">GO</span>
              <span>Get Started</span>
            </span>
          </button>
        </div>
        {/* Hero Illustration */}
        <div className="flex-1 flex items-center justify-center">
          <img
            src="https://i.pinimg.com/736x/11/82/5b/11825b1e6deedc1013a5c6b2a2729659.jpg"
            alt="Modern sustainable agriculture"
            className="aspect-square w-full max-w-[676px] h-auto object-cover rounded-2xl shadow-lg border-2 border-gold/20"
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
        className="fixed bottom-6 right-6 z-50 btn-gold focus-ring text-black font-heading px-6 py-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-100 flex items-center gap-2"
        onClick={() => setShowTeam(true)}
        aria-label="Show Team Info"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
        </svg>
        <span>TEAM</span>
      </button>
      {/* Team Modal/Card Overlay */}
      {showTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-hemlock/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-offwhite rounded-2xl p-8 shadow-xl max-w-lg w-full flex flex-col items-center relative animate-fade-in text-black border border-primary/10">
            <button
              className="absolute top-4 right-4 text-hemlock hover:text-black text-2xl font-bold focus:outline-none hover:bg-background-alt p-1 rounded-full transition-colors"
              onClick={() => setShowTeam(false)}
              aria-label="Close Team Info"
            >
              &times;
            </button>
            <h2 className="text-2xl font-heading font-bold text-olive mb-6 tracking-wide flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gold" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              Tech Titans
            </h2>
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
