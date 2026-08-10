from flask import Flask
from flask_cors import CORS

from config.settings import Config

# ==========================================================
# Routes
# ==========================================================

from routes.health import health_bp
from routes.analyze import analyze_bp
from routes.simulate import simulate_bp
from routes.history import history_bp
from routes.analytics import analytics_bp
from routes.profile import profile_bp


# ==========================================================
# Create Flask Application
# ==========================================================

app = Flask(__name__)


# ==========================================================
# Load Configuration
# ==========================================================

app.config.from_object(Config)


# ==========================================================
# Enable CORS
# ==========================================================

CORS(app)


# ==========================================================
# Register API Routes
# ==========================================================

app.register_blueprint(
    health_bp,
    url_prefix="/api"
)

app.register_blueprint(
    analyze_bp,
    url_prefix="/api"
)

app.register_blueprint(
    simulate_bp,
    url_prefix="/api"
)

app.register_blueprint(
    history_bp,
    url_prefix="/api"
)

app.register_blueprint(
    analytics_bp,
    url_prefix="/api"
)

app.register_blueprint(
    profile_bp,
    url_prefix="/api"
)


# ==========================================================
# Start Flask Server
# ==========================================================

if __name__ == "__main__":

    print("\n" + "=" * 80)
    print("AI CUSTOMER SUPPORT COACHING ASSISTANT")
    print("=" * 80)

    print("\nAvailable API Routes:")

    print("GET  /api/health")
    print("POST /api/analyze")
    print("POST /api/simulate")
    print("GET  /api/history")
    print("GET  /api/analytics")
    print("GET  /api/profile")
    print("PUT  /api/profile")

    print("\n" + "=" * 80)

    app.run(
        host=Config.HOST,
        port=Config.PORT,
        debug=Config.DEBUG
    )