from flask import Blueprint, jsonify, request

from agents.customer_simulator import simulate_customer
from graph.support_graph import support_graph


# ==========================================================
# Blueprint
# ==========================================================

simulate_bp = Blueprint("simulate", __name__)


# ==========================================================
# Customer Simulation Route
# ==========================================================

@simulate_bp.route("/simulate", methods=["POST"])
def simulate():

    try:

        # ==================================================
        # 1. Read Request
        # ==================================================

        data = request.get_json(silent=True) or {}

        scenario = data.get("scenario", "").strip()
        persona = data.get("persona", "").strip()

        if not scenario:

            return jsonify({
                "success": False,
                "error": "Scenario is required."
            }), 400

        if not persona:

            return jsonify({
                "success": False,
                "error": "Persona is required."
            }), 400

        print("\n" + "=" * 80)
        print("CUSTOMER SIMULATION REQUEST")
        print("=" * 80)

        print("\nScenario:")
        print(scenario)

        print("\nPersona:")
        print(persona)

        # ==================================================
        # 2. Customer Simulator Agent
        # ==================================================

        simulation = simulate_customer(
            scenario,
            persona
        )

        print("\n" + "=" * 80)
        print("CUSTOMER SIMULATION COMPLETED")
        print("=" * 80)

        print(simulation)

        # ==================================================
        # 3. Get Generated Customer Message
        # ==================================================

        if not isinstance(simulation, dict):

            raise ValueError(
                "Customer Simulator returned invalid result."
            )

        customer_message = simulation.get(
            "customer_message",
            ""
        )

        if not isinstance(customer_message, str):

            raise ValueError(
                "Customer Simulator returned invalid customer_message."
            )

        customer_message = customer_message.strip()

        if not customer_message:

            raise ValueError(
                "Customer Simulator did not generate a customer message."
            )

        print("\nGenerated Customer Message:")
        print(customer_message)

        # ==================================================
        # 4. Run LangGraph Coaching Workflow
        # ==================================================

        print("\n" + "=" * 80)
        print("STARTING LANGGRAPH WORKFLOW")
        print("=" * 80)

        analysis = support_graph.invoke({
            "message": customer_message
        })

        print("\n" + "=" * 80)
        print("LANGGRAPH WORKFLOW COMPLETED")
        print("=" * 80)

        # ==================================================
        # 5. Extract Agent Results
        # ==================================================

        understanding = analysis.get(
            "understanding",
            {}
        )

        knowledge = analysis.get(
            "knowledge",
            {}
        )

        coach = analysis.get(
            "coach",
            {}
        )

        quality = analysis.get(
            "quality",
            {}
        )

        escalation = analysis.get(
            "escalation",
            {}
        )

        supervisor = analysis.get(
            "supervisor",
            {}
        )

        post_interaction_summary = analysis.get(
            "post_interaction_summary",
            {}
        )

        # ==================================================
        # 6. Send Complete Result
        # ==================================================

        response_data = {

            "success": True,

            "simulation": simulation,

            "analysis": {

                "understanding": understanding,

                "knowledge": knowledge,

                "coach": coach,

                "quality": quality,

                "escalation": escalation,

                "supervisor": supervisor,

                "post_interaction_summary":
                    post_interaction_summary
            }
        }

        print("\n" + "=" * 80)
        print("SIMULATION + ANALYSIS COMPLETED")
        print("=" * 80)

        return jsonify(response_data)

    except Exception as e:

        print("\n" + "=" * 80)
        print("CUSTOMER SIMULATION ERROR")
        print("=" * 80)

        print(e)

        import traceback
        traceback.print_exc()

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500