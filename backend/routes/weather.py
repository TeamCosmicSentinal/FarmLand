from flask import Blueprint, request, jsonify
from services.weather_service import get_weather_forecast

weather_bp = Blueprint('weather', __name__)

@weather_bp.route('/', methods=['POST'])
def weather():
    """
    Receives location; returns 5-day weather forecast from OpenWeatherMap.
    """
    data = request.json
    print("[LOG] /api/weather/ called with:", data)
    forecast = get_weather_forecast(data['location'])
    print("[LOG] Weather forecast:", forecast)
    return jsonify(forecast)
