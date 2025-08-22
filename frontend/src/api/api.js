import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';

// Crop Recommendation
export const recommendCrop = (data) => axios.post(`${API_BASE}/crop-recommend/`, data);

// Weather Forecast
export const getWeather = (data) => axios.post(`${API_BASE}/weather/`, data);

// Tips
export const getTips = () => axios.get(`${API_BASE}/tips/`);

// AI Organic Tips
export const getAITip = (data) => axios.post(`${API_BASE}/tips/ai`, data);

// Schemes (static, no API needed)

// Chatbot
export const askChatbot = (data) => axios.post(`${API_BASE}/chatbot/`, data);

// Crop Health
export const getCropHealth = () => axios.get(`${API_BASE}/crop-health/`);

// Dashboard
export const getDashboard = () => axios.get(`${API_BASE}/dashboard/`);

// Satellite Insight
export const getSatelliteInsight = (data) => axios.post(`${API_BASE}/satellite-insight/`, data);

// Crop Prices
export const getCropPrices = (data) => axios.post(`${API_BASE}/crop-prices/get-prices`, data);
export const getPopularCrops = () => axios.get(`${API_BASE}/crop-prices/popular-crops`);
