import json
from collections import OrderedDict

from services.openrouter_service import generate_response
from utils.json_parser import parse_json_response


# ==========================================================
# Customer Understanding Agent
# ==========================================================

def analyze_customer_message(message):
    """
    Analyze a customer support message.

    Returns:
    {
        intent,
        sentiment,
        emotion,
        priority,
        entities
    }
    """

    print("\n" + "=" * 80)
    print("🤖 CUSTOMER UNDERSTANDING AGENT")
    print("=" * 80)

    # ======================================================
    # Safety
    # ======================================================

    if not isinstance(message, str):
        message = str(message)

    message = message.strip()

    # ======================================================
    # Extract Current Customer Message
    # ======================================================
    #
    # LangGraph is currently sending previous conversation
    # together with the current message.
    #
    # We only send the current message to OpenRouter.
    #
    # ======================================================

    if "Current Customer Message:" in message:

        message = message.split(
            "Current Customer Message:",
            1
        )[1].strip()

        if "Important:" in message:

            message = message.split(
                "Important:",
                1
            )[0].strip()

    # ======================================================
    # Remove accidental extra sections
    # ======================================================

    if "Previous Conversation:" in message:

        parts = message.split(
            "Previous Conversation:"
        )

        if len(parts) > 1:

            message = parts[-1].strip()

    # ======================================================
    # Final Customer Message
    # ======================================================

    print("\n📩 Current Customer Message:")
    print(message)

    # ======================================================
    # Empty Message
    # ======================================================

    if not message:

        print("\n⚠️ Empty customer message.")

        return {
            "intent": "General Inquiry",
            "sentiment": "neutral",
            "emotion": "neutral",
            "priority": "low",
            "entities": {
                "product": "",
                "issue": "",
                "duration": ""
            }
        }

    # ======================================================
    # Greeting Detection
    # ======================================================

    greetings = {
        "hi",
        "hello",
        "hey",
        "hii",
        "hiii",
        "good morning",
        "good afternoon",
        "good evening",
        "hello ai coach",
        "hi ai coach",
        "hey ai coach"
    }

    normalized_message = (
        message.lower()
        .strip()
        .rstrip("!.?")
    )

    if normalized_message in greetings:

        print("\n👋 Greeting detected.")
        print("⏭️ Skipping OpenRouter call.")

        result = OrderedDict()

        result["intent"] = "General Inquiry"
        result["sentiment"] = "neutral"
        result["emotion"] = "neutral"
        result["priority"] = "low"

        result["entities"] = OrderedDict([
            ("product", ""),
            ("issue", ""),
            ("duration", "")
        ])

        print("\n" + "-" * 80)
        print("✅ GREETING RESULT")
        print("-" * 80)

        print(
            json.dumps(
                result,
                indent=4
            )
        )

        print("\n" + "=" * 80)
        print("✅ CUSTOMER AGENT COMPLETED")
        print("=" * 80)

        return result

    # ======================================================
    # Compact Prompt
    # ======================================================
    #
    # IMPORTANT:
    # Do NOT load customer_prompt.txt here.
    #
    # The previous prompt was very large and the logs showed:
    #
    # Prompt tokens limit exceeded: 1055 > 361
    #
    # So we keep this prompt extremely small.
    #
    # ======================================================

    prompt = f"""
Classify this customer message.

Message: {message}

Return ONLY compact valid JSON.

intent: Report Internet Issue | Billing Complaint | Refund Request | Password Reset | Login Problem | Delivery Delay | Payment Failure | Subscription Issue | General Inquiry

sentiment: positive | neutral | negative

emotion: neutral | frustration | anger | confusion | concern | satisfaction

priority: low | medium | high

Use high priority only for prolonged outage, repeated failed attempts, serious impact, urgent issue, strong anger with serious unresolved problem, or escalation.

Return:
{{"intent":"","sentiment":"","emotion":"","priority":"","entities":{{"product":"","issue":"","duration":""}}}}
""".strip()

    # ======================================================
    # Print Compact Prompt
    # ======================================================

    print("\n" + "-" * 80)
    print("📝 COMPACT PROMPT SENT TO AI")
    print("-" * 80)

    print(prompt)

    # ======================================================
    # Call OpenRouter
    # ======================================================

    response = generate_response(prompt)

    print("\n" + "-" * 80)
    print("🧠 RAW AI RESPONSE")
    print("-" * 80)

    print(response)

    # ======================================================
    # Handle Empty Response
    # ======================================================

    if response is None:

        print("\n❌ AI returned no response.")

        return {
            "intent": "General Inquiry",
            "sentiment": "neutral",
            "emotion": "neutral",
            "priority": "medium",
            "entities": {
                "product": "",
                "issue": "",
                "duration": ""
            },
            "error": "AI returned no response."
        }

    # ======================================================
    # Parse JSON
    # ======================================================

    try:

        data = parse_json_response(response)

        # ==================================================
        # JSON Returned As String
        # ==================================================

        if isinstance(data, str):

            data = json.loads(data)

        # ==================================================
        # Validate Object
        # ==================================================

        if not isinstance(data, dict):

            raise ValueError(
                "Customer Understanding response "
                "must be a JSON object."
            )

        # ==================================================
        # Build Standard Result
        # ==================================================

        result = OrderedDict()

        result["intent"] = str(
            data.get(
                "intent",
                "General Inquiry"
            )
        )

        result["sentiment"] = str(
            data.get(
                "sentiment",
                "neutral"
            )
        ).lower()

        result["emotion"] = str(
            data.get(
                "emotion",
                "neutral"
            )
        ).lower()

        result["priority"] = str(
            data.get(
                "priority",
                "medium"
            )
        ).lower()

        # ==================================================
        # Entities
        # ==================================================

        entities = data.get(
            "entities",
            {}
        )

        if not isinstance(
            entities,
            dict
        ):
            entities = {}

        result["entities"] = OrderedDict([
            (
                "product",
                str(
                    entities.get(
                        "product",
                        ""
                    )
                )
            ),
            (
                "issue",
                str(
                    entities.get(
                        "issue",
                        ""
                    )
                )
            ),
            (
                "duration",
                str(
                    entities.get(
                        "duration",
                        ""
                    )
                )
            )
        ])

        # ==================================================
        # Validate Sentiment
        # ==================================================

        valid_sentiments = {
            "positive",
            "neutral",
            "negative"
        }

        if result["sentiment"] not in valid_sentiments:

            result["sentiment"] = "neutral"

        # ==================================================
        # Validate Emotion
        # ==================================================

        valid_emotions = {
            "neutral",
            "frustration",
            "anger",
            "confusion",
            "concern",
            "satisfaction"
        }

        if result["emotion"] not in valid_emotions:

            result["emotion"] = "neutral"

        # ==================================================
        # Validate Priority
        # ==================================================

        valid_priorities = {
            "low",
            "medium",
            "high"
        }

        if result["priority"] not in valid_priorities:

            result["priority"] = "medium"

        # ==================================================
        # Validate Intent
        # ==================================================

        valid_intents = {
            "Report Internet Issue",
            "Billing Complaint",
            "Refund Request",
            "Password Reset",
            "Login Problem",
            "Delivery Delay",
            "Payment Failure",
            "Subscription Issue",
            "General Inquiry"
        }

        if result["intent"] not in valid_intents:

            result["intent"] = "General Inquiry"

        # ==================================================
        # Final Result
        # ==================================================

        print("\n" + "-" * 80)
        print("✅ JSON PARSED")
        print("-" * 80)

        print(
            json.dumps(
                result,
                indent=4
            )
        )

        print("\n" + "=" * 80)
        print("✅ CUSTOMER AGENT COMPLETED")
        print("=" * 80)

        return result

    # ======================================================
    # JSON Parsing Error
    # ======================================================

    except Exception as e:

        print("\n" + "=" * 80)
        print("❌ CUSTOMER AGENT ERROR")
        print("=" * 80)

        print(e)

        return {
            "intent": "General Inquiry",
            "sentiment": "neutral",
            "emotion": "neutral",
            "priority": "medium",
            "entities": {
                "product": "",
                "issue": "",
                "duration": ""
            },
            "error": str(e),
            "raw_response": response
        }