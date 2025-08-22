from flask import Blueprint, jsonify

crop_health_bp = Blueprint('crop_health', __name__)

@crop_health_bp.route('/', methods=['GET'])
def crop_health():
    """
    Simulates NDVI visualization and traffic light indicator.
    """
    # TODO: Integrate with real or dummy NDVI data
    return jsonify({"status": "green", "ndvi": 0.82})
