import json
from pathlib import Path

from services.openrouter_service import generate_response
from utils.json_parser import parse_json_response


# ==========================================================
# Escalation Risk Monitor Agent
# ==========================================================

def analyze_escalation(
    message,
    understanding,
    coach,
    quality
):
    """
    Analyze whether the conversation needs escalation.

    Returns:
    {
        risk_level,
        needs_escalation,
        priority,
        reason
    }
    """

    print("\n" + "=" * 80)
    print("🚨 ESCALATION RISK MONITOR")
    print("=" * 80)

    prompt_path = (
        Path(__file__).parent.parent
        / "prompts"
        / "escalation_prompt.txt"
    )

    with open(
        prompt_path,
        "r",
        encoding="utf-8"
    ) as file:

        prompt = file.read()

    prompt = prompt.replace(
        "{message}",
        message
    )

    prompt = prompt.replace(
        "{understanding}",
        json.dumps(understanding, indent=4)
    )

    prompt = prompt.replace(
        "{quality}",
        json.dumps(quality, indent=4)
    )

    response = generate_response(prompt)

    print("\nRAW RESPONSE\n")
    print(response)

    try:

        escalation = parse_json_response(response)

        escalation.setdefault(
            "risk_level",
            "Low"
        )

        escalation.setdefault(
            "needs_escalation",
            False
        )

        escalation.setdefault(
            "priority",
            "Low"
        )

        escalation.setdefault(
            "reason",
            ""
        )

        print("\nESCALATION RESULT\n")

        print(json.dumps(
            escalation,
            indent=4
        ))

        return escalation

    except Exception as e:

        print(e)

        return {

            "risk_level": "Low",

            "needs_escalation": False,

            "priority": "Low",

            "reason": "Unable to evaluate."

        }