from flask import Blueprint, jsonify

from services.history_service import (
    read_history,
    get_conversation_by_id,
    delete_conversation
)


# ==========================================================
# Blueprint
# ==========================================================

history_bp = Blueprint(
    "history",
    __name__
)


# ==========================================================
# Get Complete Conversation History
# ==========================================================

@history_bp.route(
    "/history",
    methods=["GET"]
)
def get_history():

    try:

        history = read_history()

        return jsonify({

            "success": True,

            "total":
                len(history),

            "history":
                history
        })


    except Exception as e:

        print("\n" + "=" * 80)
        print("GET HISTORY ERROR")
        print("=" * 80)

        print(e)

        return jsonify({

            "success":
                False,

            "error":
                str(e)

        }), 500


# ==========================================================
# Get One Conversation Report
# ==========================================================

@history_bp.route(
    "/history/<report_id>",
    methods=["GET"]
)
def get_report(report_id):

    try:

        report = get_conversation_by_id(
            report_id
        )


        # --------------------------------------------------
        # Report Not Found
        # --------------------------------------------------

        if report is None:

            return jsonify({

                "success":
                    False,

                "error":
                    "Conversation report not found."

            }), 404


        return jsonify({

            "success":
                True,

            "report":
                report
        })


    except Exception as e:

        print("\n" + "=" * 80)
        print("GET REPORT ERROR")
        print("=" * 80)

        print(e)

        return jsonify({

            "success":
                False,

            "error":
                str(e)

        }), 500


# ==========================================================
# Delete One Conversation Report
# ==========================================================

@history_bp.route(
    "/history/<report_id>",
    methods=["DELETE"]
)
def delete_report(report_id):

    try:

        print("\n" + "=" * 80)
        print("DELETE CONVERSATION REPORT")
        print("=" * 80)

        print(
            f"Report ID: {report_id}"
        )


        # --------------------------------------------------
        # Check Report Exists
        # --------------------------------------------------

        report = get_conversation_by_id(
            report_id
        )


        if report is None:

            return jsonify({

                "success":
                    False,

                "error":
                    "Conversation report not found."

            }), 404


        # --------------------------------------------------
        # Delete Report
        # --------------------------------------------------

        deleted = delete_conversation(
            report_id
        )


        if not deleted:

            return jsonify({

                "success":
                    False,

                "error":
                    "Failed to delete conversation report."

            }), 500


        print(
            "Conversation report deleted successfully."
        )

        print("=" * 80)


        return jsonify({

            "success":
                True,

            "message":
                "Conversation report deleted successfully.",

            "report_id":
                report_id
        })


    except Exception as e:

        print("\n" + "=" * 80)
        print("DELETE REPORT ERROR")
        print("=" * 80)

        print(e)

        return jsonify({

            "success":
                False,

            "error":
                str(e)

        }), 500