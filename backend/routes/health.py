from flask import Blueprint, jsonify

# ==========================================================
# Health Blueprint
# ==========================================================

health_bp = Blueprint(
    "health",
    __name__
)


# ==========================================================
# Health Check Route
# ==========================================================

@health_bp.route(
    "/health",
    methods=["GET"]
)
def health():

    return jsonify({
        "message": "AI Customer Support Coaching Assistant API",
        "status": "Running"
    })