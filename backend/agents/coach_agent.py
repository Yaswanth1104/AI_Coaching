import json
from pathlib import Path

from agents.knowledge_agent import search_knowledge
from services.openrouter_service import generate_response
from utils.json_parser import parse_json_response


# ==========================================================
# Coach Agent
# ==========================================================

def generate_coach_suggestion(message, knowledge=None):
    """
    Generate AI coaching suggestions.

    Parameters:
        message:
            Customer message.

        knowledge:
            Knowledge retrieved by the Knowledge Recommendation
            Agent.

            If knowledge is not provided, this function will
            retrieve knowledge itself. This allows the agent
            to work both independently and inside LangGraph.

    Returns:
        {
            recommended_response,
            suggested_actions,
            coaching_tips,
            confidence
        }
    """

    print("\n" + "=" * 80)
    print("🤖 COACH AGENT")
    print("=" * 80)

    print("\n📩 Customer Message:")
    print(message)

    # ======================================================
    # Greetings (Skip AI)
    # ======================================================

    greetings = [
        "hi",
        "hello",
        "hey",
        "hii",
        "good morning",
        "good afternoon",
        "good evening",
        "hello ai coach"
    ]

    if message.lower().strip() in greetings:

        print("\n👋 Greeting Detected")

        return {
            "recommended_response":
                "Hello! Welcome to Customer Support. "
                "How can I assist you today?",

            "suggested_actions": [
                "Ask the customer to explain the issue.",
                "Collect complete information."
            ],

            "coaching_tips": [
                "Be polite.",
                "Understand the customer's problem."
            ],

            "confidence": 100
        }

    # ======================================================
    # Knowledge Recommendation Agent (RAG)
    # ======================================================

    # If LangGraph already retrieved knowledge,
    # use that knowledge directly.
    #
    # If this agent is called independently,
    # retrieve knowledge here as a fallback.

    if knowledge is None:

        print("\n📚 No knowledge supplied.")
        print("Running Knowledge Recommendation Agent...")

        knowledge = search_knowledge(message)

    else:

        print("\n📚 Using knowledge supplied by LangGraph.")

    # Safety check
    if not isinstance(knowledge, dict):

        print("\n⚠️ Invalid knowledge format.")

        knowledge = {
            "topic": "General Support",
            "troubleshooting": [],
            "sources": [],
            "escalation": False
        }

    print("\n📚 Knowledge Retrieved\n")

    print(
        json.dumps(
            knowledge,
            indent=4
        )
    )

    # ======================================================
    # Prepare Knowledge Context
    # ======================================================

    troubleshooting = knowledge.get(
        "troubleshooting",
        []
    )

    # Ensure troubleshooting is always a list
    if not isinstance(troubleshooting, list):

        troubleshooting = [
            str(troubleshooting)
        ]

    knowledge_context = "\n".join(
        str(item)
        for item in troubleshooting
    )

    # If no knowledge was retrieved
    if not knowledge_context.strip():

        knowledge_context = (
            "No specific troubleshooting knowledge "
            "was retrieved for this issue."
        )

    # ======================================================
    # Load Coach Prompt
    # ======================================================

    prompt_path = (
        Path(__file__).parent.parent
        / "prompts"
        / "coach_prompt.txt"
    )

    with open(
        prompt_path,
        "r",
        encoding="utf-8"
    ) as file:

        prompt = file.read()

    # ======================================================
    # Insert Customer Message
    # ======================================================

    prompt = prompt.replace(
        "{message}",
        message
    )

    # ======================================================
    # Insert Retrieved Knowledge
    # ======================================================

    prompt = prompt.replace(
        "{knowledge}",
        knowledge_context
    )

    # ======================================================
    # Call LLM
    # ======================================================

    response = generate_response(prompt)

    print("\n🧠 RAW AI RESPONSE\n")
    print(response)

    # ======================================================
    # Handle Empty AI Response
    # ======================================================

    if response is None:

        print("\n❌ AI returned no response.")

        return {
            "recommended_response":
                "I'm sorry, I couldn't generate a response.",

            "suggested_actions": [],

            "coaching_tips": [],

            "confidence": 0
        }

    # ======================================================
    # Parse JSON Response
    # ======================================================

    try:

        coach = parse_json_response(response)

        # ==================================================
        # Handle JSON Returned As String
        # ==================================================

        if isinstance(coach, str):

            coach = json.loads(coach)

        # ==================================================
        # Handle Nested JSON
        # ==================================================

        if (
            isinstance(coach, dict)
            and isinstance(
                coach.get("recommended_response"),
                str
            )
        ):

            nested = (
                coach["recommended_response"]
                .strip()
            )

            if (
                nested.startswith("{")
                and nested.endswith("}")
            ):

                try:

                    nested_json = json.loads(
                        nested
                    )

                    if isinstance(
                        nested_json,
                        dict
                    ):

                        coach = nested_json

                except Exception:

                    pass

        # ==================================================
        # Validate Coach Object
        # ==================================================

        if not isinstance(coach, dict):

            raise ValueError(
                "Coach response must be a dictionary."
            )

        # ==================================================
        # Default Values
        # ==================================================

        coach.setdefault(
            "recommended_response",
            "I'm sorry, I couldn't generate a response."
        )

        coach.setdefault(
            "suggested_actions",
            []
        )

        coach.setdefault(
            "coaching_tips",
            []
        )

        coach.setdefault(
            "confidence",
            90
        )

        # ==================================================
        # Validate Output Types
        # ==================================================

        if not isinstance(
            coach["recommended_response"],
            str
        ):

            coach["recommended_response"] = str(
                coach["recommended_response"]
            )

        if not isinstance(
            coach["suggested_actions"],
            list
        ):

            coach["suggested_actions"] = []

        if not isinstance(
            coach["coaching_tips"],
            list
        ):

            coach["coaching_tips"] = []

        try:

            coach["confidence"] = int(
                coach["confidence"]
            )

        except (TypeError, ValueError):

            coach["confidence"] = 90

        # Keep confidence between 0 and 100
        coach["confidence"] = max(
            0,
            min(
                100,
                coach["confidence"]
            )
        )

        # ==================================================
        # Final Coach Output
        # ==================================================

        print("\n========== FINAL COACH ==========")

        print(
            json.dumps(
                coach,
                indent=4
            )
        )

        print("=================================")

        print("\n" + "=" * 80)
        print("✅ COACH AGENT COMPLETED")
        print("=" * 80)

        return coach

    # ======================================================
    # JSON Parsing Error
    # ======================================================

    except Exception as e:

        print("\n❌ COACH JSON PARSE ERROR")
        print(e)

        return {
            "recommended_response":
                response.strip(),

            "suggested_actions": [],

            "coaching_tips": [],

            "confidence": 80
        }