import os
import requests
import re
from datetime import datetime, timedelta
from threading import Thread
from services.gemini_service import ask_gemini

# In-memory cache: (location, crop_name) -> { 'data': ..., 'timestamp': ... }
crop_price_cache = {}
CACHE_EXPIRY_HOURS = 3

# For background Gemini fetches
pending_gemini_fetches = {}

def get_real_crop_prices(location, crop_name):
    """
    Fetch real-time crop prices using Gemini API to scrape government websites.
    Use cache for repeated queries. If not cached, fetch real data directly (no fallback).
    """
    key = (location.lower().strip(), crop_name.lower().strip())
    now = datetime.now()
    # Check cache
    if key in crop_price_cache:
        cached = crop_price_cache[key]
        if now - cached['timestamp'] < timedelta(hours=CACHE_EXPIRY_HOURS):
            return cached['data']
    
    # Fetch real data directly (no fallback)
    data = _fetch_gemini_prices(location, crop_name)
    # Cache the result
    crop_price_cache[key] = {
        'data': data,
        'timestamp': datetime.now()
    }
    return data

def fetch_and_cache_gemini(location, crop_name, key):
    """Fetch from Gemini and update cache."""
    data = _fetch_gemini_prices(location, crop_name)
    crop_price_cache[key] = {
        'data': data,
        'timestamp': datetime.now()
    }
    # Remove from pending
    if key in pending_gemini_fetches:
        del pending_gemini_fetches[key]

def _fetch_gemini_prices(location, crop_name):
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
    prompt = f"""
    You are an expert agricultural data analyst. I need current mandi prices for {crop_name} in {location}, India.
    Please search for and provide the most recent mandi prices from reliable government sources like:
    - AGMARKNET (Agricultural Marketing Information Network)
    - eNAM (National Agriculture Market)
    - State Agricultural Marketing Boards
    - FCI (Food Corporation of India) data
    - State government agricultural websites
    For each mandi/price source found, provide:
    1. Mandi name and location
    2. Current price per quintal (in INR)
    3. Minimum and maximum price range
    4. Quality grade (if available)
    5. Date of price update
    6. Source website/authority
    Format the response as JSON with this structure:
    {{
        "success": true,
        "data": {{
            "location": "{location}",
            "crop_name": "{crop_name}",
            "mandi_prices": [
                {{
                    "mandi_name": "Mandi Name",
                    "price_per_quintal": 2000,
                    "min_price": 1950,
                    "max_price": 2050,
                    "quality": "Grade A",
                    "last_updated": "2024-01-15",
                    "source": "AGMARKNET"
                }}
            ],
            "last_updated": "2024-01-15",
            "note": "Prices are per quintal (100 kg)"
        }}
    }}
    If you cannot find specific prices for {location}, provide prices from nearby major mandis or state-level averages.
    Ensure all prices are in INR per quintal.
    Only return valid JSON, no additional text or explanations.
    """
    try:
        response = requests.post(
            f"https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent?key={GEMINI_API_KEY}",
            json={
                "contents": [{"parts": [{"text": prompt}]}]
            }
        )
        if response.ok:
            gemini_response = response.json()['candidates'][0]['content']['parts'][0]['text']
            try:
                json_match = re.search(r'\{.*\}', gemini_response, re.DOTALL)
                if json_match:
                    import json
                    parsed_data = json.loads(json_match.group())
                    return parsed_data
                else:
                    return create_structured_data_from_text(gemini_response, location, crop_name)
            except Exception:
                return create_structured_data_from_text(gemini_response, location, crop_name)
        else:
            print(f"Gemini API error: {response.status_code} {response.text}")
            raise Exception(f"Gemini API error: {response.status_code}")
    except Exception as e:
        print(f"Error fetching crop prices: {str(e)}")
        raise e

def create_structured_data_from_text(text, location, crop_name):
    """
    Parse Gemini's text response and create structured data
    """
    try:
        # Extract prices using regex patterns
        price_pattern = r'(\d{1,4}(?:,\d{3})*)\s*(?:per\s+quintal|quintal|₹|Rs\.?)'
        prices = re.findall(price_pattern, text, re.IGNORECASE)
        
        # Extract mandi names
        mandi_pattern = r'([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:Mandi|Market|APMC)'
        mandi_names = re.findall(mandi_pattern, text)
        
        # Create structured data
        mandi_prices = []
        current_date = datetime.now().strftime("%Y-%m-%d")
        
        if prices:
            # Use the first price found as current price
            current_price = int(prices[0].replace(',', ''))
            min_price = int(current_price * 0.95)  # 5% below current
            max_price = int(current_price * 1.05)  # 5% above current
            
            mandi_name = mandi_names[0] if mandi_names else f"{location} Central Mandi"
            
            mandi_prices.append({
                "mandi_name": mandi_name,
                "price_per_quintal": current_price,
                "min_price": min_price,
                "max_price": max_price,
                "quality": "Grade A",
                "last_updated": current_date,
                "source": "AGMARKNET"
            })
        else:
            # If no prices found, raise exception to force real data
            raise Exception("No real price data found in response")
        
        return {
            "success": True,
            "data": {
                "location": location,
                "crop_name": crop_name,
                "mandi_prices": mandi_prices,
                "last_updated": current_date,
                "note": "Prices are per quintal (100 kg)"
            }
        }
        
    except Exception as e:
        print(f"Error parsing text response: {str(e)}")
        raise e

def get_fallback_prices(location, crop_name, pending=False):
    """
    Provide fallback prices based on crop type and location. If pending=True, add a flag to indicate real data is being fetched.
    """
    # Realistic price ranges based on current market conditions
    price_ranges = {
        'rice': {'base': 1800, 'min': 1700, 'max': 1900},
        'wheat': {'base': 2100, 'min': 2000, 'max': 2200},
        'maize': {'base': 1650, 'min': 1600, 'max': 1700},
        'sugarcane': {'base': 320, 'min': 310, 'max': 330},
        'cotton': {'base': 6500, 'min': 6400, 'max': 6600},
        'pulses': {'base': 4500, 'min': 4400, 'max': 4600},
        'oilseeds': {'base': 3800, 'min': 3700, 'max': 3900},
        'vegetables': {'base': 2500, 'min': 2400, 'max': 2600},
        'fruits': {'base': 3500, 'min': 3400, 'max': 3600},
        'tea': {'base': 2800, 'min': 2700, 'max': 2900},
        'coffee': {'base': 4200, 'min': 4100, 'max': 4300},
        'spices': {'base': 5500, 'min': 5400, 'max': 5600}
    }
    
    crop_lower = crop_name.lower()
    price_data = None
    
    for crop_key, prices in price_ranges.items():
        if crop_key in crop_lower or crop_lower in crop_key:
            price_data = prices
            break
    
    if not price_data:
        price_data = {'base': 2000, 'min': 1950, 'max': 2050}
    
    current_date = datetime.now().strftime("%Y-%m-%d")
    
    result = {
        "success": True,
        "data": {
            "location": location,
            "crop_name": crop_name,
            "mandi_prices": [
                {
                    "mandi_name": f"{location} Central Mandi",
                    "price_per_quintal": price_data['base'],
                    "min_price": price_data['min'],
                    "max_price": price_data['max'],
                    "quality": "Grade A",
                    "last_updated": current_date,
                    "source": "Estimated Market Rate"
                }
            ],
            "last_updated": current_date,
            "note": "Prices are per quintal (100 kg) - Estimated based on current market trends"
        }
    }
    if pending:
        result['data']['pending'] = True
    return result

def get_market_insights(crop_name, location):
    """
    Get market insights and trends using Gemini API
    """
    prompt = f"""
    Provide brief market insights for {crop_name} in {location}, India. Include:
    1. Current price trend (rising/falling/stable)
    2. Best time to sell
    3. Market demand outlook
    4. Trading volume status
    
    Keep it concise and practical for farmers.
    """
    
    try:
        insights = ask_gemini(prompt)
        return insights
    except:
        return "Market data analysis temporarily unavailable. Consider selling during peak demand seasons."

def get_popular_crops():
    """
    Return list of popular crops for dropdown
    """
    return [
        'Rice', 'Wheat', 'Maize', 'Sugarcane', 'Cotton', 
        'Pulses', 'Oilseeds', 'Vegetables', 'Fruits',
        'Tea', 'Coffee', 'Spices'
    ] 