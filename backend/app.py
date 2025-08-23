from flask import Flask, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
import os
from .routes.crop_recommend import crop_recommend_bp
from .routes.weather import weather_bp
from .routes.tips import tips_bp
from .routes.schemes import schemes_bp
from .routes.chatbot import chatbot_bp
from .routes.crop_health import crop_health_bp
from .routes.dashboard import dashboard_bp
from .routes.satellite_insight import satellite_insight_bp
from .routes.crop_prices import crop_prices_bp
from .routes.marketplace import marketplace_bp
from .routes.auth import auth_bp
from .routes.certification import certification_bp
from .routes.superuser import superuser_bp

# Load environment variables from .env
load_dotenv()

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), '..', 'frontend', 'build'), static_url_path='/')
# Restrict CORS in production via env FRONTEND_ORIGIN; default allows all for dev
frontend_origin = os.getenv('FRONTEND_ORIGIN', '*')
CORS(app, resources={r"/api/*": {"origins": frontend_origin}}, supports_credentials=False)

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
app.register_blueprint(marketplace_bp, url_prefix='/api/marketplace')
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(certification_bp, url_prefix='/api/certification')
app.register_blueprint(superuser_bp, url_prefix='/api/superuser')

# Health check endpoint for Render
@app.get('/health')
def health():
    return {"status": "ok"}, 200

# Serve React build (index.html) for any non-API route
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react(path):
    # Avoid capturing API routes
    if path.startswith('api/'):
        return {"error": "Not found"}, 404
    build_dir = app.static_folder
    index_path = os.path.join(build_dir, 'index.html')
    try:
        # Serve file if it exists, else serve index.html for SPA routing
        if path and os.path.exists(os.path.join(build_dir, path)):
            return send_from_directory(build_dir, path)
        return send_from_directory(build_dir, 'index.html')
    except Exception:
        # If build is missing, show hint
        return ("Frontend build not found. Run 'npm run build' in frontend/ and ensure files are available in frontend/build.", 500)

if __name__ == '__main__':
    # Use environment variable FLASK_DEBUG for local development; default to False for deployment readiness
    debug = os.getenv('FLASK_DEBUG', '0') in ('1', 'true', 'True')
    app.run(host='0.0.0.0', port=int(os.getenv('PORT', '5000')), debug=debug)
