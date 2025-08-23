import os
import requests
import json

# Allow configuring model; default to cost-efficient Flash 2.0
GEMINI_MODEL = os.getenv('GEMINI_MODEL', 'gemini-2.0-flash')
GEMINI_API_URL = f'https://generativelanguage.googleapis.com/v1/models/{GEMINI_MODEL}:generateContent'

# Utility for Gemini API call

def get_crop_recommendation(data):
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
    soil = data.get('soil')
    season = data.get('season')
    location = data.get('location')
    prompt = (
        f"You are an expert agricultural advisor. Suggest the best crops for a farmer with the following details:\n"
        f"- Soil type: {soil}\n"
        f"- Season: {season}\n"
        + (f"- Location: {location}\n" if location else "") +
        "Return your answer as a markdown table with columns: Crop, Yield (quintals/hectare), Duration (days).\n"
        "Do not include any explanations, background, or extra text. Only output the table."
    )
    try:
        response = requests.post(
            f"{GEMINI_API_URL}?key={GEMINI_API_KEY}",
            json={
                "contents": [{"parts": [{"text": prompt}]}]
            }
        )
        if response.ok:
            text = response.json()['candidates'][0]['content']['parts'][0]['text']
            # Only return the markdown table
            return {"table": text.strip()}
        else:
            print("Gemini API error:", response.status_code, response.text)
            return {"table": "| Crop | Yield (quintals/hectare) | Duration (days) |\n|------|--------------------------|------------------|\n| No data available | - | - |"}
    except Exception as e:
        print("Gemini API exception:", str(e))
        return {"table": "| Crop | Yield (quintals/hectare) | Duration (days) |\n|------|--------------------------|------------------|\n| No data available | - | - |"}

def ask_gemini(message, language='en'):
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
    # System/context prompt for the chatbot
    system_prompt = (
        "You are AgriGuru, an AI assistant for Indian farmers. "
        "You answer questions about crops, weather, organic farming, government schemes, and agricultural best practices. "
        "You can reply in English, Hindi, or Kannada. "
        "If the user requests Hindi, reply in Hindi. If the user requests Kannada, reply in Kannada. Otherwise, reply in English. "
        "Keep answers clear, practical, and concise."
    )
    # Compose the full prompt
    if language == 'hi':
        prompt = f"{system_prompt}\nPlease answer in Hindi: {message}"
    elif language == 'kn':
        prompt = f"{system_prompt}\nPlease answer in Kannada: {message}"
    else:
        prompt = f"{system_prompt}\n{message}"
    response = requests.post(
        f"{GEMINI_API_URL}?key={GEMINI_API_KEY}",
        json={
            "contents": [{"parts": [{"text": prompt}]}]
        }
    )
    if response.ok:
        return response.json()['candidates'][0]['content']['parts'][0]['text']
    else:
        print("Gemini API error:", response.status_code, response.text)
        return f"Gemini API error: {response.status_code} {response.text}"

def get_ai_tips(category=None, stage=None):
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
    prompt = f"Give organic farming tips for {category or 'any crop'} at {stage or 'any stage'}."
    response = requests.post(
        f"{GEMINI_API_URL}?key={GEMINI_API_KEY}",
        json={
            "contents": [{"parts": [{"text": prompt}]}]
        }
    )
    if response.ok:
        return response.json()['candidates'][0]['content']['parts'][0]['text']
    else:
        print("Gemini API error:", response.status_code, response.text)
        return f"Gemini API error: {response.status_code} {response.text}"


def verify_equipment_certification(info: dict):
    """Call Gemini to estimate certification status for farming equipment.
    Accepts keys: equipment_id, equipment_name, brand, origin, compliance_info, extra
    Returns dict: { status: 'Likely Certified'|'Likely Not Certified'|'unknown', explanation: str, confidence: float|None }
    """
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
    # Accept both new equipment_* and legacy product/crop fields for compatibility
    equipment_id = (info.get('equipment_id') or info.get('product_id') or '').strip()
    equipment_name = (info.get('equipment_name') or info.get('crop_name') or '').strip()
    brand = (info.get('brand') or '').strip()
    origin = (info.get('origin') or '').strip()
    compliance_info = (info.get('compliance_info') or '').strip()
    extra = info.get('extra') or {}

    prompt = (
        "You are an expert in agricultural equipment certification and safety standards. "
        "Given the equipment details, estimate if the equipment is likely certified or not based on typical standards (e.g., BIS/ISI, ISO, CE), "
        "safety features (guards, electrical safety, PTO shields), emissions and quality marks, dealer provenance, and documentation.\n"
        "Respond ONLY in strict JSON with keys: status, confidence, explanation.\n"
        "- status must be either 'Likely Certified' or 'Likely Not Certified'\n"
        "- confidence must be a number between 0 and 1\n"
        "- explanation must be a short human-readable reason (max 2 sentences)\n"
        f"Equipment details:\n"
        f"- Equipment ID (QR/Serial): {equipment_id or 'N/A'}\n"
        f"- Equipment Name: {equipment_name or 'N/A'}\n"
        f"- Brand: {brand or 'N/A'}\n"
        f"- Origin/Location: {origin or 'N/A'}\n"
        f"- Compliance/Marks Observed: {compliance_info or 'N/A'}\n"
        f"- Extra: {json.dumps(extra)}\n"
    )

    try:
        response = requests.post(
            f"{GEMINI_API_URL}?key={GEMINI_API_KEY}",
            json={
                "contents": [{"parts": [{"text": prompt}]}]
            }
        )
        if not response.ok:
            print("Gemini API error:", response.status_code, response.text)
            return {"status": "unknown", "explanation": "Verification service unavailable.", "confidence": None}
        text = response.json()['candidates'][0]['content']['parts'][0]['text']
        # Try to parse JSON strictly; fallback to heuristic
        try:
            data = json.loads(text)
            status = data.get('status')
            conf = data.get('confidence')
            explanation = data.get('explanation')
            if status not in ('Likely Certified', 'Likely Not Certified'):
                status = 'unknown'
            return {"status": status or 'unknown', "confidence": conf, "explanation": explanation or ''}
        except Exception:
            lower = text.lower()
            if 'likely certified' in lower:
                status = 'Likely Certified'
            elif 'likely not certified' in lower or 'not certified' in lower:
                status = 'Likely Not Certified'
            else:
                status = 'unknown'
            return {"status": status, "confidence": None, "explanation": text.strip()[:400]}
    except Exception as e:
        print('Gemini API exception:', str(e))
        return {"status": "unknown", "explanation": "Error contacting verification service.", "confidence": None}

# Backward-compat alias for previous crop/product verification name
verify_product_certification = verify_equipment_certification
