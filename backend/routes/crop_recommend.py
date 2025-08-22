from flask import Blueprint, request, jsonify
from services.gemini_service import get_crop_recommendation
import os
import requests

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent'

prompt = "Say hello from Gemini"
response = requests.post(
    f"{GEMINI_API_URL}?key={GEMINI_API_KEY}",
    json={
        "contents": [{"parts": [{"text": prompt}]}]
    }
)
if response.ok:
    print("Gemini API success:", response.json())
else:
    print("Gemini API error:", response.status_code, response.text)  # <-- This is critical!

crop_recommend_bp = Blueprint('crop_recommend', __name__)

@crop_recommend_bp.route('/', methods=['POST'])
def recommend_crop():
    """
    Receives soil type, season, location; returns best crop suggestions using Gemini API.
    """
    data = request.json
    print("[LOG] /api/crop-recommend/ called with:", data)
    result = get_crop_recommendation(data)
    print("[LOG] Gemini result:", result)
    return jsonify(result)
