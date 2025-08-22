from flask import Blueprint, request, jsonify
import os
import requests

satellite_insight_bp = Blueprint('satellite_insight', __name__)

OPENWEATHER_API_KEY = os.getenv('OPENWEATHER_API_KEY')
AGRO_API_URL = 'https://api.openweathermap.org/data/3.0/agro/1.0/ndvi'

@satellite_insight_bp.route('/', methods=['POST'])
def satellite_insight():
    data = request.json
    lat = data.get('lat')
    lon = data.get('lon')
    location = data.get('location')
    if lat is not None and lon is not None:
        try:
            lat = float(lat)
            lon = float(lon)
        except Exception:
            return jsonify({'error': 'Invalid coordinates'}), 400
    elif location:
        # Geocode location name
        geo_url = f'https://api.openweathermap.org/geo/1.0/direct?q={location}&limit=1&appid={OPENWEATHER_API_KEY}'
        geo_resp = requests.get(geo_url)
        if not geo_resp.ok or not geo_resp.json():
            return jsonify({'error': 'Could not find location'}), 400
        geo = geo_resp.json()[0]
        lat, lon = geo['lat'], geo['lon']
    else:
        return jsonify({'error': 'Location or coordinates required'}), 400
    # Simulate NDVI value for demo
    ndvi_value = round(0.5 + 0.4 * (hash(f'{lat},{lon}') % 100) / 100, 2)  # Simulate NDVI 0.5-0.9
    # NDVI interpretation
    if ndvi_value > 0.7:
        status = 'Healthy'
        color = 'green'
        recommendation = 'Crops are healthy. Maintain current practices.'
    elif ndvi_value > 0.5:
        status = 'Moderate'
        color = 'yellow'
        recommendation = 'Monitor crops for stress. Consider irrigation or nutrients.'
    else:
        status = 'Unhealthy'
        color = 'red'
        recommendation = 'Crops may be stressed. Investigate for pests, drought, or disease.'
    return jsonify({
        'location': location or f'{lat},{lon}',
        'lat': lat,
        'lon': lon,
        'ndvi': ndvi_value,
        'status': status,
        'color': color,
        'recommendation': recommendation
    }) 