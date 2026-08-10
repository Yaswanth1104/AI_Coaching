import json
import os
import uuid
from datetime import datetime


# ==========================================================
# History File
# ==========================================================
#
# Vercel/serverless functions cannot reliably write to the
# deployed project directory.
#
# /tmp is writable during the function execution.
#
# NOTE:
# /tmp storage is temporary and is NOT permanent production
# storage. For permanent history, use MongoDB/PostgreSQL/etc.
# ==========================================================

HISTORY_FILE = "/tmp/conversations.json"


# ==========================================================
# Ensure History File Exists
# ==========================================================

def ensure_history_file():

    directory = os.path.dirname(HISTORY_FILE)

    if directory:
        os.makedirs(
            directory,
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

        # --------------------------------------------------
        # Validate History Format
        # --------------------------------------------------

        if not isinstance(
            history,
            list
        ):

            return []

        # --------------------------------------------------
        # Add IDs to Old Conversations
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

            if not report_id:

                item["id"] = create_report_id()

                history_changed = True

        # --------------------------------------------------
        # Save Updated History
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
    # Only Conversations Belonging To This Session
    # ------------------------------------------------------

    session_history = [

        item

        for item in history

        if isinstance(
            item,
            dict
        )
        and item.get(
            "session_id"
        ) == session_id
    ]

    # ------------------------------------------------------
    # Return Latest Conversations
    # ------------------------------------------------------

    if limit is None:
        return session_history

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

    # ------------------------------------------------------
    # Validate Session ID
    # ------------------------------------------------------

    if not session_id:

        raise ValueError(
            "session_id is required "
            "to save conversation."
        )

    # ------------------------------------------------------
    # Ensure History File
    # ------------------------------------------------------

    ensure_history_file()

    # ------------------------------------------------------
    # Create Unique Report ID
    # ------------------------------------------------------

    report_id = create_report_id()

    # ------------------------------------------------------
    # Build Conversation Object
    # ------------------------------------------------------

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

    # ------------------------------------------------------
    # Read Existing History
    # ------------------------------------------------------

    history = read_history()

    # ------------------------------------------------------
    # Add Current Conversation
    # ------------------------------------------------------

    history.append(
        conversation
    )

    # ------------------------------------------------------
    # Save Updated History
    # ------------------------------------------------------

    try:

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

    except OSError as e:

        print("\n" + "=" * 80)
        print("HISTORY SAVE ERROR")
        print("=" * 80)
        print(e)

        raise

    # ------------------------------------------------------
    # Debug
    # ------------------------------------------------------

    print("\n" + "=" * 80)
    print("CONVERSATION SAVED")
    print("=" * 80)

    print(
        f"Report ID: {report_id}"
    )

    print(
        f"Session ID: {session_id}"
    )

    print("=" * 80)

    # ------------------------------------------------------
    # Return Saved Conversation
    # ------------------------------------------------------

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

        if not isinstance(
            item,
            dict
        ):

            continue

        if str(
            item.get(
                "id",
                ""
            )
        ) == str(
            report_id
        ):

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
            item.get(
                "id",
                ""
            )
        ) != str(
            report_id
        )
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

    try:

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

    except OSError as e:

        print("\n" + "=" * 80)
        print("DELETE HISTORY ERROR")
        print("=" * 80)
        print(e)

        return False

    # ------------------------------------------------------
    # Debug
    # ------------------------------------------------------

    print("\n" + "=" * 80)
    print("CONVERSATION DELETED")
    print("=" * 80)

    print(
        f"Report ID: {report_id}"
    )

    print("=" * 80)

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
    # Keep Conversations From Other Sessions
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

    try:

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

    except OSError as e:

        print("\n" + "=" * 80)
        print("CLEAR SESSION HISTORY ERROR")
        print("=" * 80)
        print(e)

        return

    print("\n" + "=" * 80)
    print("SESSION HISTORY CLEARED")
    print("=" * 80)

    print(
        f"Session ID: {session_id}"
    )

    print("=" * 80)


# ==========================================================
# Clear Complete Conversation History
# ==========================================================

def clear_all_conversation_history():

    ensure_history_file()

    try:

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

    except OSError as e:

        print("\n" + "=" * 80)
        print("CLEAR ALL HISTORY ERROR")
        print("=" * 80)
        print(e)

        return

    print("\n" + "=" * 80)
    print("ALL CONVERSATION HISTORY CLEARED")
    print("=" * 80)