from flask import Blueprint, jsonify, request

from services.profile_service import (
    get_profile,
    update_profile,
)


# ==========================================================
# Profile Blueprint
# ==========================================================

profile_bp = Blueprint(
    "profile",
    __name__,
)


# ==========================================================
# GET PROFILE
# ==========================================================

@profile_bp.route(
    "/profile",
    methods=["GET"]
)
def profile():

    try:

        profile_data = get_profile()

        return jsonify({
            "success": True,
            "profile": profile_data,
        })

    except Exception as e:

        print("\nPROFILE GET ERROR:")
        print(e)

        return jsonify({
            "success": False,
            "error": str(e),
        }), 500


# ==========================================================
# UPDATE PROFILE
# ==========================================================

@profile_bp.route(
    "/profile",
    methods=["PUT"]
)
def update_profile_route():

    try:

        data = request.get_json(
            silent=True
        )

        if not data:

            return jsonify({
                "success": False,
                "error": "No JSON data received.",
            }), 400


        updated_profile = update_profile(
            data
        )


        print("\n" + "=" * 80)
        print("PROFILE UPDATED")
        print("=" * 80)

        print(updated_profile)


        return jsonify({
            "success": True,
            "message": "Profile updated successfully.",
            "profile": updated_profile,
        })


    except Exception as e:

        print("\nPROFILE UPDATE ERROR:")
        print(e)

        return jsonify({
            "success": False,
            "error": str(e),
        }), 500