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

    print("\n📩 Customer Message:\n")
    print(message)

    # ------------------------------------------------------
    # Load Prompt
    # ------------------------------------------------------

    with open(
        "prompts/customer_prompt.txt",
        "r",
        encoding="utf-8"
    ) as file:

        prompt = file.read()

    prompt = prompt.replace("{message}", message)

    print("\n" + "-" * 80)
    print("📝 Prompt Sent To AI")
    print("-" * 80)

    print(prompt)

    # ------------------------------------------------------
    # Call OpenRouter
    # ------------------------------------------------------

    response = generate_response(prompt)

    print("\n" + "-" * 80)
    print("🧠 RAW AI RESPONSE")
    print("-" * 80)

    print(response)

    try:

        # --------------------------------------------------
        # Parse JSON using Utility
        # --------------------------------------------------

        data = parse_json_response(response)

        print("\n" + "-" * 80)
        print("✅ JSON PARSED")
        print("-" * 80)

        print(json.dumps(data, indent=4))

        # --------------------------------------------------
        # Build Standard Output
        # --------------------------------------------------

        result = OrderedDict()

        result["intent"] = data.get(
            "intent",
            "Unknown"
        )

        result["sentiment"] = data.get(
            "sentiment",
            "Neutral"
        )

        result["emotion"] = data.get(
            "emotion",
            "Neutral"
        )

        result["priority"] = data.get(
            "priority",
            "Medium"
        )

        entities = data.get(
            "entities",
            {}
        )

        result["entities"] = OrderedDict([
            (
                "product",
                entities.get("product", "")
            ),
            (
                "issue",
                entities.get("issue", "")
            ),
            (
                "duration",
                entities.get("duration", "")
            )
        ])

        print("\n" + "-" * 80)
        print("✅ PARSED RESULT")
        print("-" * 80)

        print(json.dumps(result, indent=4))

        print("\n" + "=" * 80)
        print("✅ CUSTOMER AGENT COMPLETED")
        print("=" * 80)

        return result

    except Exception as e:

        print("\n" + "=" * 80)
        print("❌ CUSTOMER AGENT ERROR")
        print("=" * 80)

        print(e)

        return {
            "intent": "Unknown",
            "sentiment": "Neutral",
            "emotion": "Neutral",
            "priority": "Medium",
            "entities": {
                "product": "",
                "issue": "",
                "duration": ""
            },
            "error": str(e),
            "raw_response": response
        }