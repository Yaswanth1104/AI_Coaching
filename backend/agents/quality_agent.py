import json


# ==========================================================
# Quality Agent (Rule-Based)
# ==========================================================

def evaluate_response(message, coach_response):

    print("\n" + "=" * 80)
    print("⭐ QUALITY AGENT (PYTHON)")
    print("=" * 80)

    print("\n📩 Customer Message:")
    print(message)

    print("\n🤖 Coach Response:")
    print(coach_response)

    # ------------------------------------------------------
    # Professionalism
    # ------------------------------------------------------

    professionalism = 95

    if len(coach_response) < 30:
        professionalism = 75

    # ------------------------------------------------------
    # Empathy
    # ------------------------------------------------------

    empathy_words = [

        "sorry",
        "understand",
        "apologize",
        "assist",
        "help",
        "happy"

    ]

    empathy = 70

    text = coach_response.lower()

    for word in empathy_words:

        if word in text:

            empathy = 95
            break

    # ------------------------------------------------------
    # Grammar
    # ------------------------------------------------------

    grammar = 95

    if coach_response.endswith("."):
        grammar = 100

    # ------------------------------------------------------
    # Policy Compliance
    # ------------------------------------------------------

    banned_words = [

        "hack",
        "illegal",
        "password",
        "credit card"

    ]

    policy = 100

    for word in banned_words:

        if word in text:

            policy = 70
            break

    # ------------------------------------------------------
    # Overall Score
    # ------------------------------------------------------

    overall = round(

        (
            professionalism +
            empathy +
            grammar +
            policy

        ) / 4

    )

    # ------------------------------------------------------
    # Feedback
    # ------------------------------------------------------

    if overall >= 95:

        feedback = "Excellent customer response."

    elif overall >= 85:

        feedback = "Good response with minor improvements."

    else:

        feedback = "Needs improvement."

    quality = {

        "professionalism": professionalism,

        "empathy": empathy,

        "grammar": grammar,

        "policy_compliance": policy,

        "overall_score": overall,

        "feedback": feedback

    }

    print("\n✅ QUALITY RESULT\n")

    print(

        json.dumps(

            quality,

            indent=4

        )

    )

    print("\n" + "=" * 80)
    print("✅ QUALITY AGENT COMPLETED")
    print("=" * 80)

    return quality