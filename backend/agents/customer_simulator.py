import json

from services.openrouter_service import generate_response
from utils.json_parser import parse_json_response


# ==========================================================
# Customer Simulator Agent
# ==========================================================

def simulate_customer(
    scenario,
    persona="Normal Customer",
    conversation_history=None
):
    """
    Generate a realistic customer message based on
    scenario, persona and previous conversation.

    Returns:
    {
        "customer_message": str,
        "emotion": str,
        "scenario": str,
        "persona": str
    }
    """

    print("\n" + "=" * 80)
    print("CUSTOMER SIMULATOR AGENT")
    print("=" * 80)

    if conversation_history is None:
        conversation_history = []

    # ======================================================
    # Prepare Conversation History
    # ======================================================

    history_text = ""

    if conversation_history:

        for item in conversation_history:

            sender = item.get(
                "sender",
                "unknown"
            )

            message = item.get(
                "message",
                ""
            )

            history_text += (
                f"{sender}: {message}\n"
            )

    else:

        history_text = "No previous conversation."

    # ======================================================
    # Build Prompt
    # ======================================================

    prompt = f"""
You are a Customer Simulator Agent.

Your job is to simulate a realistic customer in a
customer support conversation.

Scenario:
{scenario}

Customer Persona:
{persona}

Previous Conversation:
{history_text}

Generate the customer's NEXT message.

Rules:

- Stay consistent with the given scenario.
- Act like a real customer.
- Do not act like a support agent.
- Generate only one customer turn.
- Consider the previous conversation.
- The message should be natural and concise.
- Emotion can change depending on the conversation.
- Do not invent a completely unrelated problem.

Return ONLY valid JSON.

Use exactly this format:

{{
    "customer_message": "string",
    "emotion": "neutral | confused | frustrated | angry | satisfied",
    "scenario": "string",
    "persona": "string"
}}
"""

    print("\nScenario:")
    print(scenario)

    print("\nPersona:")
    print(persona)

    # ======================================================
    # Call LLM
    # ======================================================

    response = generate_response(
        prompt
    )

    print("\nRAW SIMULATOR RESPONSE:")
    print(response)

    if response is None:

        return {
            "customer_message":
                "I need help with my issue.",

            "emotion":
                "neutral",

            "scenario":
                scenario,

            "persona":
                persona
        }

    # ======================================================
    # Parse Response
    # ======================================================

    try:

        result = parse_json_response(
            response
        )

        if isinstance(result, str):

            result = json.loads(
                result
            )

        if not isinstance(result, dict):

            raise ValueError(
                "Simulator returned invalid JSON."
            )

        result.setdefault(
            "customer_message",
            "I need help with my issue."
        )

        result.setdefault(
            "emotion",
            "neutral"
        )

        # Keep original configuration values
        result["scenario"] = scenario
        result["persona"] = persona

        print("\nCUSTOMER SIMULATOR RESULT:")

        print(
            json.dumps(
                result,
                indent=4
            )
        )

        print("\n" + "=" * 80)
        print("CUSTOMER SIMULATOR COMPLETED")
        print("=" * 80)

        return result

    except Exception as e:

        print("\nCUSTOMER SIMULATOR ERROR:")
        print(e)

        return {
            "customer_message":
                response.strip(),

            "emotion":
                "neutral",

            "scenario":
                scenario,

            "persona":
                persona
        }