import React, { useState, useEffect } from 'react';
import { getCropPrices, getPopularCrops } from '../api/api';

const CropPricesForm = () => {
  const [formData, setFormData] = useState({
    location: '',
    crop_name: ''
  });
  const [popularCrops, setPopularCrops] = useState([]);
  const [prices, setPrices] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [loadingQuote, setLoadingQuote] = useState('');
  const [quoteIndex, setQuoteIndex] = useState(0);

  const loadingQuotes = [
    "🌾 Fetching real-time prices from government mandis...",
    "📊 Analyzing market data from AGMARKNET...",
    "🏛️ Checking eNAM (National Agriculture Market) prices...",
    "📈 Gathering data from state agricultural boards...",
    "🔍 Searching for the latest mandi rates...",
    "💼 Compiling comprehensive price information...",
    "📋 Verifying data from multiple government sources...",
    "🌱 Processing crop-specific market insights..."
  ];

  useEffect(() => {
    fetchPopularCrops();
  }, []);

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setQuoteIndex((prev) => (prev + 1) % loadingQuotes.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [loading]);

  useEffect(() => {
    setLoadingQuote(loadingQuotes[quoteIndex]);
  }, [quoteIndex]);

  const fetchPopularCrops = async () => {
    try {
      const response = await getPopularCrops();
      console.log('Popular crops response:', response);
      if (response.data && response.data.success) {
        setPopularCrops(response.data.crops);
      } else {
        console.error('Invalid response format:', response);
        // Fallback to default crops if API fails
        setPopularCrops(['Rice', 'Wheat', 'Maize', 'Sugarcane', 'Cotton', 'Pulses', 'Oilseeds', 'Vegetables', 'Fruits', 'Tea', 'Coffee', 'Spices']);
      }
    } catch (err) {
      console.error('Error fetching popular crops:', err);
      // Fallback to default crops if API fails
      setPopularCrops(['Rice', 'Wheat', 'Maize', 'Sugarcane', 'Cotton', 'Pulses', 'Oilseeds', 'Vegetables', 'Fruits', 'Tea', 'Coffee', 'Spices']);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.location.trim() || !formData.crop_name.trim()) {
      setError('Please enter both location and crop name');
      return;
    }

    setLoading(true);
    setError('');
    setPrices(null);

    try {
      const response = await getCropPrices(formData);
      console.log('Crop prices response:', response);
      if (response.data && response.data.success) {
        setPrices(response.data.data);
      } else {
        setError(response.data?.message || 'Failed to fetch prices');
      }
    } catch (err) {
      console.error('Error fetching crop prices:', err);
      setError('Error connecting to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };



  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const getCropIcon = (cropName) => {
    const crop = cropName.toLowerCase();
    if (crop.includes('rice')) return '🌾';
    if (crop.includes('wheat')) return '🌾';
    if (crop.includes('maize')) return '🌽';
    if (crop.includes('sugarcane')) return '🎋';
    if (crop.includes('cotton')) return '🧶';
    if (crop.includes('pulses')) return '🫘';
    if (crop.includes('vegetables')) return '🥬';
    if (crop.includes('fruits')) return '🍎';
    if (crop.includes('tea')) return '🍵';
    if (crop.includes('coffee')) return '☕';
    if (crop.includes('spices')) return '🌶️';
    return '🌱';
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Search Form */}
      <div className="bg-offwhite rounded-2xl shadow-card p-6 mb-8 border border-hemlock">
        <h2 className="text-2xl font-heading font-bold text-olive mb-6 text-center">
          Search Crop Prices
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location (City/District)
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., Bangalore, Karnataka"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
            
            <div>
              <label htmlFor="crop_name" className="block text-sm font-medium text-gray-700 mb-2">
                Crop Name
              </label>
              <select
                id="crop_name"
                name="crop_name"
                value={formData.crop_name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-900"
                required
              >
                <option value="" className="text-gray-900">Select a crop</option>
                {popularCrops.map((crop, index) => (
                  <option key={index} value={crop} className="text-gray-900">
                    {crop}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Fetching Real Data...
                </span>
              ) : (
                'Get Real-Time Prices'
              )}
            </button>
          </div>
        </form>
        
        {loading && (
          <div className="mt-8 text-center">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-200">
              <div className="flex items-center justify-center mb-4">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl">🌾</span>
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Fetching Real-Time Crop Prices
              </h3>
              <p className="text-gray-600 mb-4 animate-pulse">
                {loadingQuote}
              </p>
              <div className="text-sm text-gray-500">
                <p>⏱️ This may take 30-60 seconds as we search multiple government sources</p>
                <p>📊 We're getting the most accurate, up-to-date mandi prices for you</p>
              </div>
            </div>
          </div>
        )}
        
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-center">{error}</p>
          </div>
        )}
      </div>

      {/* Results */}
      {prices && (
        <div className="bg-offwhite rounded-2xl shadow-card p-6 border border-hemlock">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-semibold text-green-700 mb-2">
              {getCropIcon(prices.crop_name)} {prices.crop_name} Prices in {prices.location}
            </h3>
            <p className="text-gray-600">
              Last updated: {prices.last_updated} • {prices.note}
            </p>
          </div>

          <div className="grid gap-6">
            {prices.mandi_prices.map((mandi, index) => (
              <div key={index} className="feature-gold md:feature-green border border-hemlock rounded-xl p-6 shadow-card transition-all duration-200 hover:scale-[1.01]">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-semibold text-gray-800">
                    🏪 {mandi.mandi_name}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      {mandi.quality}
                    </span>
                    {mandi.source && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {mandi.source}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Current Price</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatPrice(mandi.price_per_quintal)}
                    </p>
                    <p className="text-xs text-gray-500">per quintal</p>
                  </div>
                  
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Min Price</p>
                    <p className="text-xl font-semibold text-blue-600">
                      {formatPrice(mandi.min_price)}
                    </p>
                    <p className="text-xs text-gray-500">per quintal</p>
                  </div>
                  
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Max Price</p>
                    <p className="text-xl font-semibold text-orange-600">
                      {formatPrice(mandi.max_price)}
                    </p>
                    <p className="text-xs text-gray-500">per quintal</p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Price Range:</span> {formatPrice(mandi.min_price)} - {formatPrice(mandi.max_price)} per quintal
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Market Insights */}
          <div className="mt-8 p-6 feature-gold rounded-xl border border-hemlock shadow-card">
            <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              💡 Market Insights
            </h4>
            <div className="text-sm text-gray-700">
              {prices.market_insights ? (
                <div className="whitespace-pre-line">{prices.market_insights}</div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium mb-1">📈 Price Trend:</p>
                    <p>Prices are currently stable with moderate fluctuations</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">🕒 Best Time to Sell:</p>
                    <p>Consider selling during peak demand seasons</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">📊 Market Demand:</p>
                    <p>Steady demand expected in the coming weeks</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">💼 Trading Volume:</p>
                    <p>High trading activity in major mandis</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Information Section */}
      <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          📋 About Mandi Prices
        </h3>
        <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">What are Mandi Prices?</h4>
            <p>
              Mandi prices are the wholesale rates at which agricultural commodities are traded 
              in government-regulated agricultural markets (mandis). These prices serve as 
              benchmarks for farmers and traders.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">How to Use This Information?</h4>
            <p>
              Compare prices across different mandis, track price trends, and make informed 
              decisions about when and where to sell your produce for maximum profit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropPricesForm; 