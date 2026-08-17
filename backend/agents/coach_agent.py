import json
from pathlib import Path

from agents.knowledge_agent import search_knowledge
from services.openrouter_service import generate_response
from utils.json_parser import parse_json_response


# ==========================================================
# Coach Agent
# ==========================================================

def generate_coach_suggestion(message, knowledge=None):

    print("\n" + "=" * 80)
    print("🤖 COACH AGENT")
    print("=" * 80)

    print("\n📩 Original Message:")
    print(message)

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
    # LangGraph may send previous conversation + current
    # customer message together.
    #
    # We only need the actual current message here.
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
    # Clean Previous Conversation
    # ======================================================

    if "Previous Conversation:" in message:

        parts = message.split(
            "Previous Conversation:"
        )

        if len(parts) > 1:

            message = parts[-1].strip()

    # ======================================================
    # Final Message
    # ======================================================

    message = message.strip()

    print("\n📩 Current Customer Message:")
    print(message)

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
        message
        .lower()
        .strip()
        .rstrip("!.?")
    )

    if normalized_message in greetings:

        print("\n👋 Greeting Detected")
        print("⏭️ Skipping OpenRouter call.")

        result = {
            "recommended_response": (
                "Hello! Welcome to Customer Support. "
                "How can I assist you today?"
            ),

            "suggested_actions": [
                "Ask the customer to explain the issue."
            ],

            "coaching_tips": [
                "Be polite and friendly."
            ],

            "confidence": 100
        }

        print("\n========== FINAL COACH ==========")

        print(
            json.dumps(
                result,
                indent=4
            )
        )

        print("=================================")

        return result

    # ======================================================
    # Knowledge Recommendation Agent
    # ======================================================

    if knowledge is None:

        print("\n📚 No knowledge supplied.")
        print("Running Knowledge Recommendation Agent...")

        knowledge = search_knowledge(message)

    else:

        print("\n📚 Using knowledge supplied by LangGraph.")

    # ======================================================
    # Safety Check
    # ======================================================

    if not isinstance(knowledge, dict):

        print("\n⚠️ Invalid knowledge format.")

        knowledge = {
            "topic": "General Support",
            "troubleshooting": [],
            "sources": [],
            "escalation": False
        }

    # ======================================================
    # Knowledge Context
    # ======================================================

    troubleshooting = knowledge.get(
        "troubleshooting",
        []
    )

    if not isinstance(
        troubleshooting,
        list
    ):

        troubleshooting = [
            str(troubleshooting)
        ]

    knowledge_context = "\n".join(
        str(item)
        for item in troubleshooting
    )

    if not knowledge_context.strip():

        knowledge_context = (
            "No specific troubleshooting knowledge "
            "was retrieved."
        )

    print("\n📚 Knowledge Context:")
    print(knowledge_context)

    # ======================================================
    # IMPORTANT TOKEN OPTIMIZATION
    # ======================================================
    #
    # Do NOT load a large coach_prompt.txt.
    #
    # We create a very small prompt because the
    # OpenRouter balance is currently limited.
    #
    # ======================================================

    prompt = f"""
You are a customer support coach.

Customer:
{message}

Knowledge:
{knowledge_context}

Return ONLY valid JSON:

{{
"recommended_response":"",
"suggested_actions":[],
"coaching_tips":[],
"confidence":0
}}

Rules:
- Keep response short.
- Use the knowledge when relevant.
- Do not invent information.
- suggested_actions must be short.
- coaching_tips must be short.
- confidence must be 0-100.
""".strip()

    print("\n" + "-" * 80)
    print("📝 COMPACT COACH PROMPT")
    print("-" * 80)

    print(prompt)

    # ======================================================
    # OpenRouter Call
    # ======================================================

    response = generate_response(prompt)

    print("\n" + "-" * 80)
    print("🧠 RAW COACH RESPONSE")
    print("-" * 80)

    print(response)

    # ======================================================
    # Empty AI Response
    # ======================================================

    if response is None:

        print("\n❌ Coach AI returned no response.")

        return {
            "recommended_response": (
                "I'm sorry, I couldn't generate a response."
            ),
            "suggested_actions": [],
            "coaching_tips": [],
            "confidence": 0
        }

    # ======================================================
    # Parse JSON
    # ======================================================

    try:

        coach = parse_json_response(response)

        # --------------------------------------------------
        # JSON returned as string
        # --------------------------------------------------

        if isinstance(coach, str):

            coach = json.loads(coach)

        # --------------------------------------------------
        # Validate
        # --------------------------------------------------

        if not isinstance(coach, dict):

            raise ValueError(
                "Coach response must be a dictionary."
            )

        # ==================================================
        # Default Values
        # ==================================================

        recommended_response = coach.get(
            "recommended_response",
            ""
        )

        suggested_actions = coach.get(
            "suggested_actions",
            []
        )

        coaching_tips = coach.get(
            "coaching_tips",
            []
        )

        confidence = coach.get(
            "confidence",
            80
        )

        # ==================================================
        # Validate Response
        # ==================================================

        if not isinstance(
            recommended_response,
            str
        ):

            recommended_response = str(
                recommended_response
            )

        if not isinstance(
            suggested_actions,
            list
        ):

            suggested_actions = []

        if not isinstance(
            coaching_tips,
            list
        ):

            coaching_tips = []

        try:

            confidence = int(
                confidence
            )

        except (
            TypeError,
            ValueError
        ):

            confidence = 80

        confidence = max(
            0,
            min(
                100,
                confidence
            )
        )

        # ==================================================
        # Final Result
        # ==================================================

        result = {
            "recommended_response":
                recommended_response,

            "suggested_actions":
                suggested_actions,

            "coaching_tips":
                coaching_tips,

            "confidence":
                confidence
        }

        print("\n========== FINAL COACH ==========")

        print(
            json.dumps(
                result,
                indent=4
            )
        )

        print("=================================")

        print("\n" + "=" * 80)
        print("✅ COACH AGENT COMPLETED")
        print("=" * 80)

        return result

    # ======================================================
    # JSON Error
    # ======================================================

    except Exception as e:

        print("\n❌ COACH JSON PARSE ERROR")
        print(e)

        return {
            "recommended_response":
                response.strip(),

            "suggested_actions": [],

            "coaching_tips": [],

            "confidence": 50,

            "error": str(e)
        }