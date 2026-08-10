from flask import Blueprint, jsonify, request

# ==========================================================
# LangGraph Workflow
# ==========================================================

from graph.support_graph import support_graph


# ==========================================================
# Conversation History / Memory
# ==========================================================

from services.history_service import (
    save_conversation,
    get_conversation_context
)


# ==========================================================
# Blueprint
# ==========================================================

analyze_bp = Blueprint(
    "analyze",
    __name__
)


# ==========================================================
# Analyze Conversation Route
# ==========================================================

@analyze_bp.route(
    "/analyze",
    methods=["POST"]
)
def analyze():

    try:

        print("\n" + "=" * 80)
        print("NEW ANALYSIS REQUEST")
        print("=" * 80)

        # ==================================================
        # 1. Read Request
        # ==================================================

        data = request.get_json(
            silent=True
        )

        if not data:

            return jsonify({
                "success": False,
                "error": "No JSON received."
            }), 400

        # ==================================================
        # 2. Read Session ID
        # ==================================================

        session_id = data.get(
            "session_id",
            ""
        )

        if not isinstance(
            session_id,
            str
        ):

            return jsonify({
                "success": False,
                "error": "Session ID must be a string."
            }), 400

        session_id = session_id.strip()

        if session_id == "":

            return jsonify({
                "success": False,
                "error": "Session ID is required."
            }), 400

        # ==================================================
        # 3. Read Customer Message
        # ==================================================

        message = data.get(
            "message",
            ""
        )

        if not isinstance(
            message,
            str
        ):

            return jsonify({
                "success": False,
                "error": "Customer message must be a string."
            }), 400

        message = message.strip()

        if message == "":

            return jsonify({
                "success": False,
                "error": "Customer message is required."
            }), 400

        print("\nSession ID:")
        print(session_id)

        print("\nCustomer Message:")
        print(message)

        # ==================================================
        # 4. Load Previous Conversation Memory
        # ==================================================

        conversation_context = (
            get_conversation_context(
                session_id=session_id,
                limit=5
            )
        )

        print("\n" + "=" * 80)
        print("CONVERSATION MEMORY")
        print("=" * 80)

        print(
            conversation_context
        )

        # ==================================================
        # 5. Run LangGraph Workflow
        # ==================================================

        print("\n" + "=" * 80)
        print("STARTING LANGGRAPH WORKFLOW")
        print("=" * 80)

        result = support_graph.invoke({

            "message":
                message,

            "conversation_context":
                conversation_context

        })

        print("\n" + "=" * 80)
        print("LANGGRAPH WORKFLOW COMPLETED")
        print("=" * 80)

        # ==================================================
        # 6. Get Agent Results
        # ==================================================

        understanding = result.get(
            "understanding",
            {}
        )

        knowledge = result.get(
            "knowledge",
            {}
        )

        coach = result.get(
            "coach",
            {}
        )

        quality = result.get(
            "quality",
            {}
        )

        escalation = result.get(
            "escalation",
            {}
        )

        supervisor = result.get(
            "supervisor",
            {}
        )

        post_interaction_summary = (
            result.get(
                "post_interaction_summary",
                {}
            )
        )

        # ==================================================
        # 7. Safe Defaults
        # ==================================================

        if not isinstance(
            understanding,
            dict
        ):

            understanding = {}

        if not isinstance(
            knowledge,
            dict
        ):

            knowledge = {}

        if not isinstance(
            coach,
            dict
        ):

            coach = {}

        if not isinstance(
            quality,
            dict
        ):

            quality = {}

        if not isinstance(
            escalation,
            dict
        ):

            escalation = {}

        if not isinstance(
            supervisor,
            dict
        ):

            supervisor = {}

        if not isinstance(
            post_interaction_summary,
            dict
        ):

            post_interaction_summary = {}

        # ==================================================
        # 8. Debug Final State
        # ==================================================

        print("\n" + "=" * 80)
        print("LANGGRAPH FINAL STATE")
        print("=" * 80)

        print("\nCustomer Understanding:")
        print(understanding)

        print("\nKnowledge:")
        print(knowledge)

        print("\nCoach:")
        print(coach)

        print("\nQuality:")
        print(quality)

        print("\nEscalation:")
        print(escalation)

        print("\nSupervisor:")
        print(supervisor)

        print("\nPost-Interaction Summary:")
        print(
            post_interaction_summary
        )

        # ==================================================
        # 9. Validate Coach Output
        # ==================================================

        if not coach:

            raise ValueError(
                "Coach Agent returned an empty response."
            )

        if (
            "recommended_response"
            not in coach
        ):

            raise ValueError(
                "Coach Agent did not return "
                "recommended_response."
            )

        # ==================================================
        # 10. Save Current Conversation
        #
        # IMPORTANT:
        # Save post_interaction_summary also.
        # ==================================================

        saved_conversation = save_conversation(

            session_id=
                session_id,

            customer_message=
                message,

            understanding=
                understanding,

            coach=
                coach,

            quality=
                quality,

            supervisor=
                supervisor,

            escalation=
                escalation,

            post_interaction_summary=
                post_interaction_summary
        )

        print(
            "\nConversation saved successfully."
        )

        print(
            f"Session ID: {session_id}"
        )

        # ==================================================
        # 11. Get Report ID
        # ==================================================

        report_id = saved_conversation.get(
            "id",
            ""
        )

        # ==================================================
        # 12. Response Sent To Frontend
        # ==================================================

        response_data = {

            "success":
                True,

            "session_id":
                session_id,

            "report_id":
                report_id,

            "understanding":
                understanding,

            "knowledge":
                knowledge,

            "coach":
                coach,

            "quality":
                quality,

            "escalation":
                escalation,

            "supervisor":
                supervisor,

            "post_interaction_summary":
                post_interaction_summary
        }

        print("\n" + "=" * 80)
        print("RESPONSE SENT TO FRONTEND")
        print("=" * 80)

        print(
            response_data
        )

        return jsonify(
            response_data
        )

    # ======================================================
    # Error Handling
    # ======================================================

    except Exception as e:

        print("\n" + "=" * 80)
        print("ANALYZE ROUTE ERROR")
        print("=" * 80)

        import traceback

        traceback.print_exc()

        return jsonify({

            "success":
                False,

            "error":
                str(e)

        }), 500