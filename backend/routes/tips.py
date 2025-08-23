from flask import Blueprint, jsonify, request
from ..services.gemini_service import ask_gemini

tips_bp = Blueprint('tips', __name__)

@tips_bp.route('/', methods=['GET'])
def get_tips():
    """
    Returns a list of static farming tips.
    """
    print("[LOG] /api/tips/ called")
    tips = [
        {"category": "Water Management", "stage": "Pre-sowing", "tip": "Ensure proper field leveling for uniform water distribution."},
        {"category": "Soil Health", "stage": "Sowing", "tip": "Use certified seeds and treat them before sowing."},
        {"category": "Pest Control", "stage": "Growth", "tip": "Monitor crops regularly for pest attacks."},
        {"category": "Fertilizer", "stage": "Pre-harvest", "tip": "Apply fertilizers based on soil test recommendations."}
    ]
    print("[LOG] Returning tips:", tips)
    return jsonify(tips)

@tips_bp.route('/ai', methods=['POST'])
def ai_tip():
    data = request.get_json()
    question = data.get('question', '').strip()
    language = data.get('language', 'en')
    if not question:
        return jsonify({'error': 'Question is required'}), 400
    print(f"[LOG] /api/tips/ai called with question: {question}, language: {language}")
    # Direct, concise, and fast prompt for Gemini
    gemini_prompt = (
        f"Answer this farming question in 2-4 short, clear bullet points. No intro or outro, just the tips.\n"
        f"Question: {question}"
    )
    answer = ask_gemini(gemini_prompt, language=language)
    return jsonify({'answer': answer})
