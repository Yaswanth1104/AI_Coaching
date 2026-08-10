import json


# ==========================================================
# Supervisor Agent - Final Decision Maker
# ==========================================================

def supervisor_review(
    message,
    understanding,
    coach,
    quality,
    escalation
):

    print("\n" + "=" * 80)
    print("👨‍💼 SUPERVISOR AGENT - FINAL REVIEW")
    print("=" * 80)

    # ======================================================
    # Get Values Safely
    # ======================================================

    score = quality.get(
        "overall_score",
        0
    )

    priority = str(
        understanding.get(
            "priority",
            "medium"
        )
    ).lower()

    sentiment = str(
        understanding.get(
            "sentiment",
            "neutral"
        )
    ).lower()

    # ======================================================
    # Escalation Agent Results
    # ======================================================

    escalation_required = escalation.get(
        "needs_escalation",
        False
    )

    escalation_risk = str(
        escalation.get(
            "risk_level",
            "low"
        )
    ).lower()

    escalation_reason = escalation.get(
        "reason",
        ""
    )

    # ======================================================
    # Default Decision
    # ======================================================

    decision = "approve"

    risk = "low"

    needs_escalation = False

    ready_to_send = True

    feedback = (
        "Response passed final supervisor review."
    )

    # ======================================================
    # Rule 1 - Escalation Agent Requested Escalation
    # ======================================================

    if escalation_required:

        decision = "escalate"

        risk = escalation_risk

        needs_escalation = True

        ready_to_send = False

        feedback = (
            "Escalation required: "
            + escalation_reason
        )

    # ======================================================
    # Rule 2 - Low Quality Response
    # ======================================================

    elif score < 70:

        decision = "reject"

        risk = "high"

        needs_escalation = True

        ready_to_send = False

        feedback = (
            "Response quality is below the "
            "required threshold."
        )

    # ======================================================
    # Rule 3 - High Priority
    # ======================================================

    elif priority == "high":

        decision = "review"

        risk = "medium"

        ready_to_send = False

        feedback = (
            "High-priority issue requires "
            "additional supervisor review."
        )

    # ======================================================
    # Rule 4 - Negative Sentiment
    # ======================================================

    elif sentiment == "negative":

        risk = "medium"

        feedback = (
            "Customer sentiment is negative, "
            "but the response can proceed."
        )

    # ======================================================
    # Final Supervisor Result
    # ======================================================

    supervisor = {

        "decision": decision,

        "risk": risk,

        "needs_escalation":
            needs_escalation,

        "feedback":
            feedback,

        "final_score":
            score,

        "ready_to_send":
            ready_to_send,

        "escalation_required":
            needs_escalation,

        "priority":
            priority,

        "escalation_reason":
            escalation_reason,

        "missing_information":
            [],

        "summary":
            "Final conversation review completed."
    }

    # ======================================================
    # Debug
    # ======================================================

    print("\nFINAL SUPERVISOR RESULT")

    print(
        json.dumps(
            supervisor,
            indent=4
        )
    )

    print("\n" + "=" * 80)
    print("✅ FINAL SUPERVISOR REVIEW COMPLETED")
    print("=" * 80)

    return supervisor