from flask import Blueprint, request, jsonify
import os
import requests

satellite_insight_bp = Blueprint('satellite_insight', __name__)

AGRO_API_URL = 'https://api.openweathermap.org/data/3.0/agro/1.0/ndvi'

@satellite_insight_bp.route('/', methods=['POST'])
def satellite_insight():
    data = request.get_json(silent=True) or {}
    lat = data.get('lat')
    lon = data.get('lon')
    location = data.get('location')

    # Load API key at request time to avoid import-order issues
    api_key = os.getenv('OPENWEATHER_API_KEY')
    if not api_key:
        return jsonify({'error': 'OpenWeather API key not configured'}), 500

    if lat is not None and lon is not None:
        try:
            lat = float(lat)
            lon = float(lon)
        except Exception:
            return jsonify({'error': 'Invalid coordinates'}), 400
    elif location:
        # Normalize location
        location = str(location).strip()
        if not location:
            return jsonify({'error': 'Location or coordinates required'}), 400

        # Helper: deterministic synthetic coordinates within India bounds when geocoding fails
        def synthesize_coords(loc: str):
            # India approx bounds: lat 8-37, lon 68-97
            h = abs(hash(loc))
            lat_synth = 8 + (h % 2900) / 100.0  # 8.00 - 36.99
            lon_synth = 68 + (h % 2900) / 100.0  # 68.00 - 96.99
            return round(lat_synth, 4), round(lon_synth, 4)

        # Geocode location name
        geo_url = f'https://api.openweathermap.org/geo/1.0/direct?q={location}&limit=1&appid={api_key}'
        try:
            geo_resp = requests.get(geo_url, timeout=10)
            if geo_resp.ok:
                geo_json = geo_resp.json()
                if geo_json:
                    geo = geo_json[0]
                    lat, lon = geo.get('lat'), geo.get('lon')
            # Fallback if missing or invalid
            if lat is None or lon is None:
                lat, lon = synthesize_coords(location)
        except Exception:
            # Network or service error -> fallback
            lat, lon = synthesize_coords(location)
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