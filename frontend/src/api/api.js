import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';

// Axios instance to attach token when provided
const api = axios.create({ baseURL: API_BASE });
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Auth
export const register = (data) => api.post(`/auth/register`, data);
export const login = (data) => api.post(`/auth/login`, data);
export const logout = () => api.post(`/auth/logout`);
export const me = () => api.get(`/auth/me`);

// Crop Recommendation
export const recommendCrop = (data) => api.post(`/crop-recommend/`, data);

// Weather Forecast
export const getWeather = (data) => api.post(`/weather/`, data);

// Tips
export const getTips = () => api.get(`/tips/`);

// AI Organic Tips
export const getAITip = (data) => api.post(`/tips/ai`, data);

// Chatbot
export const askChatbot = (data) => api.post(`/chatbot/`, data);

// Crop Health
export const getCropHealth = () => api.get(`/crop-health/`);

// Dashboard
export const getDashboard = () => api.get(`/dashboard/`);

// Satellite Insight
export const getSatelliteInsight = (data) => api.post(`/satellite-insight/`, data);

// Crop Prices
export const getCropPrices = (data) => api.post(`/crop-prices/get-prices`, data);
export const getPopularCrops = () => api.get(`/crop-prices/popular-crops`);

// Marketplace
export const getMarketplaceListings = () => api.get(`/marketplace/`);
export const addMarketplaceListing = (data) => api.post(`/marketplace/`, data);
export const deleteMarketplaceListing = (id) => api.delete(`/marketplace/${id}`);
export const getMarketplaceListing = (id) => api.get(`/marketplace/${id}`);
