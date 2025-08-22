from flask import Blueprint, jsonify

schemes_bp = Blueprint('schemes', __name__)

@schemes_bp.route('/', methods=['GET'])
def get_schemes():
    """
    Returns a list of latest government schemes (dummy data or mock API).
    """
    schemes = [
        {"name": "PM-KISAN", "summary": "Direct income support to farmers."},
        {"name": "Soil Health Card", "summary": "Provides soil health cards to farmers."}
    ]
    return jsonify(schemes)
