# AgriGuru

**AgriGuru** is an AI-powered web application to assist farmers with crop recommendations, weather forecasts, organic farming tips, government schemes, a chatbot assistant, crop health monitoring, and a personal dashboard.

---

## Features
- **Crop Recommendation:** Suggests best crops using Google Gemini API based on soil, season, and location.
- **Weather Forecast:** 5-day forecast using OpenWeatherMap API.
- **Farming Tips:** Static and AI-generated tips, categorized.
- **Government Schemes Explorer:** Lists latest Indian agricultural schemes.
- **Crop Prices:** Get latest mandi prices for crops based on location and crop type.
- **Chatbot Assistant:** Gemini-powered Q&A, supports English, Hindi, and Kannada.
- **Satellite Insight:** NDVI and crop health insights from satellite data.
- **Dashboard:** Shows user queries, crops, weather, and tips viewed (stored in MongoDB).

---

## Tech Stack
- **Frontend:** React, Tailwind CSS
- **Backend:** Flask (Python)
- **Database:** MongoDB
- **APIs:** Google Gemini, OpenWeatherMap

---

## Project Structure
```
AgroGuru/
├── backend/
│   ├── app.py
│   ├── routes/
│   ├── services/
│   ├── models/
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── api/
│   │   └── App.jsx
│   ├── public/
│   ├── tailwind.config.js
│   ├── .env.example
│   └── package.json
└── README.md
```

---

## Setup Instructions

### 1. Clone and Prepare Environment
```
git clone <repo_url>
cd AgroGuru
```

### 2. Backend Setup
```
cd backend
cp .env.example .env
# Fill in your actual API keys in .env
pip install -r requirements.txt
python app.py
```

#### Required Backend .env variables:
- `GEMINI_API_KEY` (Google Gemini API key)
- `OPENWEATHER_API_KEY` (OpenWeatherMap API key)
- `MONGO_URI` (MongoDB connection string)
- `MONGO_DB` (Database name)

### 3. Frontend Setup
```
cd ../frontend
cp .env.example .env
# Set REACT_APP_API_BASE if backend is not on localhost:5000
npm install
npm start
```

---

## API Endpoints
- `POST /api/crop-recommend/` – Crop recommendation
- `POST /api/weather/` – Weather forecast
- `GET /api/tips/` – Farming tips
- `GET /api/schemes/` – Government schemes
- `POST /api/crop-prices/get-prices` – Get crop prices by location and crop
- `GET /api/crop-prices/popular-crops` – Get list of popular crops
- `POST /api/chatbot/` – Chatbot Q&A
- `POST /api/satellite-insight/` – Satellite insights and NDVI data
- `GET /api/dashboard/` – User dashboard

---

## Extending AgriGuru
- Add login/signup and farmer profiles
- Integrate real satellite/NDVI data
- Add more regional languages
- Expand dashboard analytics

---

## Notes
- Ensure MongoDB is running locally or provide a cloud URI.
- For Gemini API, sign up at [Google AI Studio](https://aistudio.google.com/app/apikey) to get your key.
- For OpenWeatherMap API, sign up at [OpenWeatherMap](https://openweathermap.org/api).

---

## License
MIT
