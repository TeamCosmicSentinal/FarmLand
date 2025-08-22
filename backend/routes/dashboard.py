from flask import Blueprint, jsonify

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/', methods=['GET'])
def dashboard():
    """
    Returns user dashboard data (queries, crops, weather, tips viewed, etc.).
    """
    user_id = 'guest'  # Replace with real user ID if available
    dashboard_data = {
        'queries': 12,
        'crops': ['Wheat', 'Rice', 'Maize'],
        'weather': 'Sunny',
        'tips_viewed': 5
    }
    return jsonify(dashboard_data)
