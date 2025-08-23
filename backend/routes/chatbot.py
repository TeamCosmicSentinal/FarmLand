from flask import Blueprint, request, jsonify
from ..services.gemini_service import ask_gemini

chatbot_bp = Blueprint('chatbot', __name__)

@chatbot_bp.route('/', methods=['POST'])
def chatbot():
    data = request.get_json()
    message = data.get('message', '').strip()
    language = data.get('language', 'en')
    if not message:
        return jsonify({'error': 'Message is required'}), 400
    print(f"[LOG] /api/chatbot/ called with message: {message}, language: {language}")
    # Fast, concise prompt for Gemini
    prompt = (
        f"Answer this as a farming assistant in 1-3 short, clear sentences. No intro or outro, just the answer.\n"
        f"Question: {message}"
    )
    answer = ask_gemini(prompt, language=language)
    return jsonify({'answer': answer})
