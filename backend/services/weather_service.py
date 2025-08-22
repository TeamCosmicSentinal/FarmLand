import os
import requests

OPENWEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/forecast'

def get_weather_forecast(location):
    OPENWEATHER_API_KEY = os.getenv('OPENWEATHER_API_KEY')
    params = {
        'q': location,
        'appid': OPENWEATHER_API_KEY,
        'units': 'metric'
    }
    resp = requests.get(OPENWEATHER_API_URL, params=params)
    if not resp.ok:
        return {"error": "OpenWeatherMap API error"}
    data = resp.json()
    # Extract 5-day summary (simplified)
    forecast = []
    for entry in data['list'][:5]:
        forecast.append({
            'datetime': entry['dt_txt'],
            'temp': entry['main']['temp'],
            'humidity': entry['main']['humidity'],
            'rain': entry.get('rain', {}).get('3h', 0),
            'wind': entry['wind']['speed']
        })
    return forecast
