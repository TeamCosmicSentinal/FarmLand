from flask import Blueprint, request, jsonify
import os
from dotenv import load_dotenv
from services.crop_prices_service import get_real_crop_prices, get_popular_crops, get_market_insights

load_dotenv()

crop_prices_bp = Blueprint('crop_prices', __name__)

@crop_prices_bp.route('/get-prices', methods=['POST'])
def get_crop_prices():
    try:
        data = request.get_json()
        location = data.get('location', '').strip()
        crop_name = data.get('crop_name', '').strip()
        
        if not location or not crop_name:
            return jsonify({
                'success': False,
                'message': 'Location and crop name are required'
            }), 400
        
        # Fetch real-time crop prices using Gemini API
        prices_data = get_real_crop_prices(location, crop_name)
        
        # Get market insights
        try:
            insights = get_market_insights(crop_name, location)
            if prices_data.get('success') and prices_data.get('data'):
                prices_data['data']['market_insights'] = insights
        except:
            # If insights fail, continue without them
            pass
        
        return jsonify(prices_data)
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error fetching crop prices: {str(e)}'
        }), 500

@crop_prices_bp.route('/popular-crops', methods=['GET'])
def get_popular_crops_route():
    """Get list of popular crops for the dropdown"""
    try:
        crops = get_popular_crops()
        
        return jsonify({
            'success': True,
            'crops': crops
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error fetching popular crops: {str(e)}'
        }), 500 