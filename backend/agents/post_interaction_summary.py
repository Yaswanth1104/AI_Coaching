import json

from services.openrouter_service import generate_response
from utils.json_parser import parse_json_response


# ==========================================================
# Post-Interaction Summary Agent
# ==========================================================

def generate_interaction_summary(
    customer_message,
    coach_response,
    understanding=None,
    quality=None,
    escalation=None
):
    """
    Generate a final summary after the customer interaction.

    Returns:
    {
        "conversation_summary": str,
        "customer_intent": str,
        "sentiment_journey": str,
        "resolution_status": str,
        "resolution_quality_score": int,
        "strengths": list,
        "improvements": list,
        "coaching_recommendations": list
    }
    """

    print("\n" + "=" * 80)
    print("POST-INTERACTION SUMMARY AGENT")
    print("=" * 80)

    # ======================================================
    # Safe Input Defaults
    # ======================================================

    understanding = (
        understanding
        if isinstance(understanding, dict)
        else {}
    )

    quality = (
        quality
        if isinstance(quality, dict)
        else {}
    )

    escalation = (
        escalation
        if isinstance(escalation, dict)
        else {}
    )

    # ======================================================
    # Prepare Context
    # ======================================================

    context = {
        "customer_message": customer_message,
        "coach_response": coach_response,
        "customer_understanding": understanding,
        "quality_result": quality,
        "escalation_result": escalation
    }

    # ======================================================
    # Build Prompt
    # ======================================================

    prompt = f"""
You are a Post-Interaction Summary Agent for a customer
support coaching system.

Analyze the completed customer support interaction.

Interaction Data:

{json.dumps(context, indent=2)}

Generate a SHORT post-interaction review.

Return ONLY valid JSON using exactly this structure:

{{
    "conversation_summary": "",
    "customer_intent": "",
    "sentiment_journey": "",
    "resolution_status": "",
    "resolution_quality_score": 0,
    "strengths": [],
    "improvements": [],
    "coaching_recommendations": []
}}

Rules:

- Use only the provided interaction data.

- conversation_summary:
  Maximum 2 short sentences.

- customer_intent:
  Identify the customer's main request.

- sentiment_journey:
  Maximum 1 short sentence.

- resolution_status:
  Must be exactly one of:
  "Resolved", "Pending", "Escalated".

- If needs_escalation is true,
  resolution_status must be "Escalated".

- resolution_quality_score:
  Must be an integer from 0 to 100.
  Use the quality score when available.

- strengths:
  Maximum 2 items.
  Each item must be under 15 words.

- improvements:
  Maximum 2 items.
  Each item must be under 15 words.

- coaching_recommendations:
  Maximum 2 items.
  Each item must be under 15 words.

IMPORTANT:

- Keep the response concise.
- Do not add extra fields.
- Always close the JSON object.
- Return ONLY valid JSON.
- No markdown.
- No code blocks.
- No explanations outside JSON.
"""

    # ======================================================
    # Display Input
    # ======================================================

    print("\nInteraction Data:")

    print(
        json.dumps(
            context,
            indent=4
        )
    )

    # ======================================================
    # Call AI
    # ======================================================

    response = generate_response(
        prompt
    )

    print("\nRAW SUMMARY RESPONSE:")
    print(response)

    # ======================================================
    # Fallback Values
    # ======================================================

    fallback_intent = understanding.get(
        "intent",
        "Unknown"
    )

    fallback_sentiment = understanding.get(
        "sentiment",
        "Neutral"
    )

    fallback_score = quality.get(
        "overall_score",
        0
    )

    escalation_required = escalation.get(
        "needs_escalation",
        False
    )

    # ======================================================
    # Parse Response
    # ======================================================

    try:

        if not response:

            raise ValueError(
                "Summary Agent returned an empty response."
            )

        result = parse_json_response(
            response
        )

        if isinstance(
            result,
            str
        ):

            result = json.loads(
                result
            )

        if not isinstance(
            result,
            dict
        ):

            raise ValueError(
                "Summary Agent returned invalid JSON."
            )

        # ==================================================
        # Standardize Output
        # ==================================================

        result.setdefault(
            "conversation_summary",
            ""
        )

        result.setdefault(
            "customer_intent",
            fallback_intent
        )

        result.setdefault(
            "sentiment_journey",
            fallback_sentiment
        )

        result.setdefault(
            "resolution_status",
            "Pending"
        )

        result.setdefault(
            "resolution_quality_score",
            fallback_score
        )

        result.setdefault(
            "strengths",
            []
        )

        result.setdefault(
            "improvements",
            []
        )

        result.setdefault(
            "coaching_recommendations",
            []
        )

        # ==================================================
        # Protect Empty Values
        # ==================================================

        if not result.get(
            "customer_intent"
        ):

            result["customer_intent"] = (
                fallback_intent
            )

        if not result.get(
            "sentiment_journey"
        ):

            result["sentiment_journey"] = (
                fallback_sentiment
            )

        if not result.get(
            "resolution_quality_score"
        ) and fallback_score:

            result["resolution_quality_score"] = (
                fallback_score
            )

        # ==================================================
        # Validate Resolution Status
        # ==================================================

        valid_statuses = [
            "Resolved",
            "Pending",
            "Escalated"
        ]

        resolution_status = result.get(
            "resolution_status",
            "Pending"
        )

        if resolution_status not in valid_statuses:

            resolution_status = "Pending"

        # Escalation always takes priority
        if escalation_required:

            resolution_status = "Escalated"

        result["resolution_status"] = (
            resolution_status
        )

        # ==================================================
        # Validate Score
        # ==================================================

        try:

            score = int(
                result.get(
                    "resolution_quality_score",
                    fallback_score
                )
            )

            result["resolution_quality_score"] = max(
                0,
                min(
                    100,
                    score
                )
            )

        except (
            ValueError,
            TypeError
        ):

            try:

                result["resolution_quality_score"] = max(
                    0,
                    min(
                        100,
                        int(fallback_score)
                    )
                )

            except (
                ValueError,
                TypeError
            ):

                result["resolution_quality_score"] = 0

        # ==================================================
        # Validate Lists
        # ==================================================

        for field in [
            "strengths",
            "improvements",
            "coaching_recommendations"
        ]:

            if not isinstance(
                result.get(field),
                list
            ):

                result[field] = []

        # ==================================================
        # Final Result
        # ==================================================

        print(
            "\nPOST-INTERACTION SUMMARY RESULT:"
        )

        print(
            json.dumps(
                result,
                indent=4
            )
        )

        print("\n" + "=" * 80)
        print(
            "POST-INTERACTION SUMMARY COMPLETED"
        )
        print("=" * 80)

        return result

    # ======================================================
    # Error Handling
    # ======================================================

    except Exception as e:

        print(
            "\nPOST-INTERACTION SUMMARY ERROR:"
        )

        print(e)

        resolution_status = "Pending"

        if escalation_required:

            resolution_status = "Escalated"

        try:

            fallback_score = int(
                fallback_score
            )

            fallback_score = max(
                0,
                min(
                    100,
                    fallback_score
                )
            )

        except (
            ValueError,
            TypeError
        ):

            fallback_score = 0

        fallback_result = {

            "conversation_summary":
                (
                    "Customer interaction was analyzed "
                    "using the available support results."
                ),

            "customer_intent":
                fallback_intent,

            "sentiment_journey":
                fallback_sentiment,

            "resolution_status":
                resolution_status,

            "resolution_quality_score":
                fallback_score,

            "strengths":
                [],

            "improvements":
                [],

            "coaching_recommendations":
                []
        }

        print(
            "\nUSING SUMMARY FALLBACK:"
        )

        print(
            json.dumps(
                fallback_result,
                indent=4
            )
        )

        return fallback_result