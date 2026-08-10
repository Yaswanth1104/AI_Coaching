from flask import Blueprint, jsonify
from services.history_service import read_history

analytics_bp = Blueprint(
    "analytics",
    __name__
)


@analytics_bp.route(
    "/analytics",
    methods=["GET"]
)
def analytics():

    history = read_history()

    total = len(history)

    positive = 0
    neutral = 0
    negative = 0

    total_quality = 0

    for item in history:

        sentiment = (
            item.get("understanding", {})
            .get("sentiment", "")
            .lower()
        )

        if sentiment == "positive":
            positive += 1

        elif sentiment == "negative":
            negative += 1

        else:
            neutral += 1

        total_quality += (
            item.get("quality", {})
            .get("overall_score", 0)
        )

    average_quality = (
        round(total_quality / total, 2)
        if total > 0 else 0
    )

    return jsonify({
        "total_conversations": total,
        "average_quality": average_quality,
        "positive": positive,
        "neutral": neutral,
        "negative": negative
    })