from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os
from routes.crop_recommend import crop_recommend_bp
from routes.weather import weather_bp
from routes.tips import tips_bp
from routes.schemes import schemes_bp
from routes.chatbot import chatbot_bp
from routes.crop_health import crop_health_bp
from routes.dashboard import dashboard_bp
from routes.satellite_insight import satellite_insight_bp
from routes.crop_prices import crop_prices_bp

# Load environment variables from .env
load_dotenv()

app = Flask(__name__)
CORS(app)

# Register Blueprints
app.register_blueprint(crop_recommend_bp, url_prefix='/api/crop-recommend')
app.register_blueprint(weather_bp, url_prefix='/api/weather')
app.register_blueprint(tips_bp, url_prefix='/api/tips')
app.register_blueprint(schemes_bp, url_prefix='/api/schemes')
app.register_blueprint(chatbot_bp, url_prefix='/api/chatbot')
app.register_blueprint(crop_health_bp, url_prefix='/api/crop-health')
app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
app.register_blueprint(satellite_insight_bp, url_prefix='/api/satellite-insight')
app.register_blueprint(crop_prices_bp, url_prefix='/api/crop-prices')

if __name__ == '__main__':
    app.run(debug=True)
