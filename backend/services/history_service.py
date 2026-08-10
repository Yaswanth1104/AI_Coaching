import json
import os
import uuid
from datetime import datetime


# ==========================================================
# History File
# ==========================================================

HISTORY_FILE = os.path.join(
    os.path.dirname(__file__),
    "..",
    "history",
    "conversations.json"
)


# ==========================================================
# Ensure History File Exists
# ==========================================================

def ensure_history_file():

    os.makedirs(
        os.path.dirname(HISTORY_FILE),
        exist_ok=True
    )

    if not os.path.exists(HISTORY_FILE):

        with open(
            HISTORY_FILE,
            "w",
            encoding="utf-8"
        ) as file:

            json.dump(
                [],
                file,
                indent=4,
                ensure_ascii=False
            )


# ==========================================================
# Generate New Session ID
# ==========================================================

def create_session_id():

    return str(
        uuid.uuid4()
    )


# ==========================================================
# Generate Report ID
# ==========================================================

def create_report_id():

    return str(
        uuid.uuid4()
    )


# ==========================================================
# Read All Conversation History
#
# IMPORTANT:
# Old conversations may not have an "id".
# This function automatically creates IDs for them.
# ==========================================================

def read_history():

    ensure_history_file()

    try:

        with open(
            HISTORY_FILE,
            "r",
            encoding="utf-8"
        ) as file:

            history = json.load(file)

        if not isinstance(
            history,
            list
        ):

            return []


        # --------------------------------------------------
        # Add IDs to old conversations
        # --------------------------------------------------

        history_changed = False

        for item in history:

            if not isinstance(
                item,
                dict
            ):
                continue

            report_id = item.get(
                "id"
            )

            # Old record does not have ID
            if not report_id:

                item["id"] = create_report_id()

                history_changed = True


        # --------------------------------------------------
        # Save updated history
        # --------------------------------------------------

        if history_changed:

            with open(
                HISTORY_FILE,
                "w",
                encoding="utf-8"
            ) as file:

                json.dump(
                    history,
                    file,
                    indent=4,
                    ensure_ascii=False
                )

            print("\n" + "=" * 80)
            print("OLD CONVERSATION IDs MIGRATED")
            print("=" * 80)

            print(
                "Missing report IDs were generated successfully."
            )


        return history


    except (
        json.JSONDecodeError,
        OSError
    ):

        return []


# ==========================================================
# Get Conversation History For One Session
# ==========================================================

def get_conversation_history(
    session_id,
    limit=5
):

    if not session_id:

        return []

    history = read_history()


    # ------------------------------------------------------
    # Only conversations belonging to this session
    # ------------------------------------------------------

    session_history = [

        item

        for item in history

        if item.get(
            "session_id"
        ) == session_id
    ]


    # ------------------------------------------------------
    # Return latest conversations
    # ------------------------------------------------------

    return session_history[
        -limit:
    ]


# ==========================================================
# Build Conversation Context For One Session
# ==========================================================

def get_conversation_context(
    session_id,
    limit=5
):

    history = get_conversation_history(
        session_id=session_id,
        limit=limit
    )

    if not history:

        return (
            "No previous conversation "
            "context for this session."
        )


    context_parts = []


    for item in history:

        # --------------------------------------------------
        # Customer Message
        # --------------------------------------------------

        customer_message = item.get(
            "customer_message",
            ""
        )


        # --------------------------------------------------
        # Coach Response
        # --------------------------------------------------

        coach = item.get(
            "coach",
            {}
        )

        if not isinstance(
            coach,
            dict
        ):

            coach = {}


        coach_response = coach.get(
            "recommended_response",
            ""
        )


        # --------------------------------------------------
        # Customer Understanding
        # --------------------------------------------------

        understanding = item.get(
            "understanding",
            {}
        )

        if not isinstance(
            understanding,
            dict
        ):

            understanding = {}


        intent = understanding.get(
            "intent",
            ""
        )

        sentiment = understanding.get(
            "sentiment",
            ""
        )

        emotion = understanding.get(
            "emotion",
            ""
        )

        priority = understanding.get(
            "priority",
            ""
        )


        # --------------------------------------------------
        # Entities
        # --------------------------------------------------

        entities = understanding.get(
            "entities",
            {}
        )

        if not isinstance(
            entities,
            dict
        ):

            entities = {}


        product = entities.get(
            "product",
            ""
        )

        issue = entities.get(
            "issue",
            ""
        )

        duration = entities.get(
            "duration",
            ""
        )


        # --------------------------------------------------
        # Build Memory Block
        # --------------------------------------------------

        conversation_text = f"""
Customer: {customer_message}

AI Coach: {coach_response}

Intent: {intent}
Sentiment: {sentiment}
Emotion: {emotion}
Priority: {priority}

Product: {product}
Issue: {issue}
Duration: {duration}
"""


        context_parts.append(
            conversation_text.strip()
        )


    # ------------------------------------------------------
    # Combine Previous Messages
    # ------------------------------------------------------

    return "\n\n".join(
        context_parts
    )


# ==========================================================
# Save Conversation
# ==========================================================

def save_conversation(
    session_id,
    customer_message,
    understanding,
    coach,
    quality,
    supervisor,
    escalation,
    post_interaction_summary=None
):

    if not session_id:

        raise ValueError(
            "session_id is required "
            "to save conversation."
        )


    # ======================================================
    # Create Unique Report ID
    # ======================================================

    report_id = create_report_id()


    # ======================================================
    # Build Conversation Object
    # ======================================================

    conversation = {

        "id":
            report_id,

        "session_id":
            session_id,

        "timestamp":
            datetime.now().strftime(
                "%Y-%m-%d %H:%M:%S"
            ),

        "customer_message":
            customer_message,

        "understanding":
            understanding or {},

        "coach":
            coach or {},

        "quality":
            quality or {},

        "supervisor":
            supervisor or {},

        "escalation":
            escalation or {},

        "post_interaction_summary":
            post_interaction_summary or {}
    }


    # ======================================================
    # Read Existing History
    # ======================================================

    history = read_history()


    # ======================================================
    # Add Current Conversation
    # ======================================================

    history.append(
        conversation
    )


    # ======================================================
    # Save Updated History
    # ======================================================

    with open(
        HISTORY_FILE,
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            history,
            file,
            indent=4,
            ensure_ascii=False
        )


    print("\n" + "=" * 80)
    print("CONVERSATION SAVED")
    print("=" * 80)

    print(
        f"Report ID: {report_id}"
    )

    print(
        f"Session ID: {session_id}"
    )


    # ======================================================
    # Return Saved Conversation
    # ======================================================

    return conversation


# ==========================================================
# Get One Conversation By Report ID
# ==========================================================

def get_conversation_by_id(
    report_id
):

    if not report_id:

        return None


    history = read_history()


    for item in history:

        if str(
            item.get("id", "")
        ) == str(report_id):

            return item


    return None


# ==========================================================
# Delete One Conversation
# ==========================================================

def delete_conversation(
    report_id
):

    if not report_id:

        return False


    history = read_history()


    # ------------------------------------------------------
    # Check Existing Report
    # ------------------------------------------------------

    original_length = len(
        history
    )


    # ------------------------------------------------------
    # Remove Matching Report
    # ------------------------------------------------------

    updated_history = [

        item

        for item in history

        if str(
            item.get("id", "")
        ) != str(report_id)
    ]


    # ------------------------------------------------------
    # Nothing Deleted
    # ------------------------------------------------------

    if len(
        updated_history
    ) == original_length:

        return False


    # ------------------------------------------------------
    # Save Updated History
    # ------------------------------------------------------

    with open(
        HISTORY_FILE,
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            updated_history,
            file,
            indent=4,
            ensure_ascii=False
        )


    print("\n" + "=" * 80)
    print("CONVERSATION DELETED")
    print("=" * 80)

    print(
        f"Report ID: {report_id}"
    )


    return True


# ==========================================================
# Clear One Session
# ==========================================================

def clear_session_history(
    session_id
):

    if not session_id:

        return


    history = read_history()


    # ------------------------------------------------------
    # Keep conversations from other sessions
    # ------------------------------------------------------

    updated_history = [

        item

        for item in history

        if item.get(
            "session_id"
        ) != session_id
    ]


    # ------------------------------------------------------
    # Save Updated History
    # ------------------------------------------------------

    with open(
        HISTORY_FILE,
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            updated_history,
            file,
            indent=4,
            ensure_ascii=False
        )


    print("\n" + "=" * 80)
    print("SESSION HISTORY CLEARED")
    print("=" * 80)

    print(
        f"Session ID: {session_id}"
    )


# ==========================================================
# Clear Complete Conversation History
# ==========================================================

def clear_all_conversation_history():

    ensure_history_file()


    with open(
        HISTORY_FILE,
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            [],
            file,
            indent=4,
            ensure_ascii=False
        )


    print("\n" + "=" * 80)
    print("ALL CONVERSATION HISTORY CLEARED")
    print("=" * 80)