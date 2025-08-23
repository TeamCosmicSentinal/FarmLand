from flask import Blueprint, request, jsonify
from services.gemini_service import get_crop_recommendation

# Blueprint for crop recommendation
crop_recommend_bp = Blueprint('crop_recommend', __name__)

@crop_recommend_bp.route('/', methods=['POST'])
def recommend_crop():
    """
    Receives soil type, season, location; returns best crop suggestions using Gemini API.
    """
    data = request.get_json(silent=True) or {}
    print("[LOG] /api/crop-recommend/ called with:", data)
    result = get_crop_recommendation(data)
    print("[LOG] Gemini result:", result)
    return jsonify(result)
