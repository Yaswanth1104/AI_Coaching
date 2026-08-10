# ==========================================================
# Profile Service
# ==========================================================

# In-memory profile storage for now.
# Later this can be replaced with MongoDB/database storage.

_profile = {
    "full_name": "Gude Yaswanth",
    "email": "yaswanthgude565@gmail.com",
    "phone": "7730902051",
    "role": "Support Employee",
    "department": "Customer Support",
    "bio": (
        "Customer support professional using AI-powered tools "
        "to improve conversation quality and customer experience."
    ),
    "account_status": "Active",
}


# ==========================================================
# Get Profile
# ==========================================================

def get_profile():
    """
    Return the current user profile.
    """

    return _profile.copy()


# ==========================================================
# Update Profile
# ==========================================================

def update_profile(data):
    """
    Update allowed profile fields.

    Only existing editable fields can be updated.
    """

    editable_fields = [
        "full_name",
        "email",
        "phone",
        "role",
        "department",
        "bio",
    ]

    for field in editable_fields:

        if field in data:

            value = data[field]

            if isinstance(value, str):

                value = value.strip()

            _profile[field] = value

    return _profile.copy()