import os
import requests

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
