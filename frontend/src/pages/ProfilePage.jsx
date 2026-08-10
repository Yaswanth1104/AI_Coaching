import { useEffect, useState } from "react";

import "./ProfilePage.css";


/* =========================================================
   BACKEND API
========================================================= */

const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    "http://127.0.0.1:5000";


/* =========================================================
   DEFAULT PROFILE
========================================================= */

const DEFAULT_PROFILE = {
    fullName: "Yaswanth Gude",
    email: "yaswanth@example.com",
    phone: "",
    role: "Support Employee",
    department: "Customer Support",
    bio:
        "Customer support professional using AI-powered tools to improve conversation quality and customer experience.",
    accountStatus: "Active",
};


/* =========================================================
   NORMALIZE BACKEND PROFILE
========================================================= */

function normalizeProfile(data = {}) {

    return {
        fullName:
            data.full_name ??
            data.fullName ??
            DEFAULT_PROFILE.fullName,

        email:
            data.email ??
            DEFAULT_PROFILE.email,

        phone:
            data.phone ??
            DEFAULT_PROFILE.phone,

        role:
            data.role ??
            DEFAULT_PROFILE.role,

        department:
            data.department ??
            DEFAULT_PROFILE.department,

        bio:
            data.bio ??
            DEFAULT_PROFILE.bio,

        accountStatus:
            data.account_status ??
            data.accountStatus ??
            DEFAULT_PROFILE.accountStatus,
    };
}


/* =========================================================
   PROFILE PAGE
========================================================= */

function ProfilePage() {

    /* =====================================================
       PROFILE STATE
    ===================================================== */

    const [profile, setProfile] =
        useState(DEFAULT_PROFILE);


    const [formData, setFormData] =
        useState(DEFAULT_PROFILE);


    /* =====================================================
       UI STATE
    ===================================================== */

    const [editMode, setEditMode] =
        useState(false);


    const [loading, setLoading] =
        useState(true);


    const [saving, setSaving] =
        useState(false);


    const [saved, setSaved] =
        useState(false);


    const [error, setError] =
        useState("");


    /* =====================================================
       LOAD PROFILE FROM BACKEND
    ===================================================== */

    useEffect(() => {

        const loadProfile = async () => {

            try {

                setLoading(true);

                setError("");

                const response =
                    await fetch(
                        `${API_BASE_URL}/profile`,
                        {
                            method: "GET",
                            headers: {
                                "Content-Type":
                                    "application/json",
                            },
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok || !data.success) {

                    throw new Error(
                        data.error ||
                        "Unable to load profile."
                    );

                }


                const backendProfile =
                    normalizeProfile(
                        data.profile
                    );


                setProfile(
                    backendProfile
                );


                setFormData(
                    backendProfile
                );


            } catch (err) {

                console.error(
                    "Profile loading failed:",
                    err
                );


                setError(
                    "Unable to load profile from backend."
                );


                /*
                 * Fallback to localStorage only if
                 * backend is unavailable.
                 */

                try {

                    const savedProfile =
                        localStorage.getItem(
                            "ai_coach_profile"
                        );


                    if (savedProfile) {

                        const localProfile =
                            normalizeProfile(
                                JSON.parse(
                                    savedProfile
                                )
                            );


                        setProfile(
                            localProfile
                        );


                        setFormData(
                            localProfile
                        );

                    }

                } catch (localError) {

                    console.error(
                        "Local profile fallback failed:",
                        localError
                    );

                }

            } finally {

                setLoading(false);

            }

        };


        loadProfile();

    }, []);


    /* =====================================================
       EDIT PROFILE
    ===================================================== */

    const handleEdit = () => {

        setFormData(
            profile
        );

        setSaved(false);

        setError("");

        setEditMode(true);

    };


    /* =====================================================
       CLOSE EDIT
    ===================================================== */

    const handleCancel = () => {

        setFormData(
            profile
        );

        setError("");

        setEditMode(false);

    };


    /* =====================================================
       INPUT CHANGE
    ===================================================== */

    const handleChange = (event) => {

        const {
            name,
            value,
        } = event.target;


        setFormData(
            (previous) => ({
                ...previous,
                [name]: value,
            })
        );

    };


    /* =====================================================
       SAVE PROFILE
    ===================================================== */

    const handleSave = async (event) => {

        event.preventDefault();


        if (saving) {
            return;
        }


        try {

            setSaving(true);

            setError("");

            setSaved(false);


            /* ---------------------------------------------
               Prepare Data For Backend
            --------------------------------------------- */

            const payload = {

                full_name:
                    formData.fullName.trim(),

                email:
                    formData.email.trim(),

                phone:
                    formData.phone.trim(),

                role:
                    formData.role.trim(),

                department:
                    formData.department.trim(),

                bio:
                    formData.bio.trim(),

            };


            /* ---------------------------------------------
               PUT /profile
            --------------------------------------------- */

            const response =
                await fetch(
                    `${API_BASE_URL}/profile`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body:
                            JSON.stringify(
                                payload
                            ),
                    }
                );


            const data =
                await response.json();


            if (
                !response.ok ||
                !data.success
            ) {

                throw new Error(
                    data.error ||
                    "Unable to update profile."
                );

            }


            /* ---------------------------------------------
               Normalize Updated Profile
            --------------------------------------------- */

            const updatedProfile =
                normalizeProfile(
                    data.profile
                );


            /* ---------------------------------------------
               Update React State
            --------------------------------------------- */

            setProfile(
                updatedProfile
            );


            setFormData(
                updatedProfile
            );


            /* ---------------------------------------------
               Local Backup
            --------------------------------------------- */

            localStorage.setItem(
                "ai_coach_profile",
                JSON.stringify(
                    updatedProfile
                )
            );


            /* ---------------------------------------------
               Close Modal
            --------------------------------------------- */

            setEditMode(false);

            setSaved(true);


            /* ---------------------------------------------
               Hide Success Message
            --------------------------------------------- */

            setTimeout(() => {

                setSaved(false);

            }, 2500);


        } catch (err) {

            console.error(
                "Profile update failed:",
                err
            );


            setError(
                err.message ||
                "Unable to update profile."
            );

        } finally {

            setSaving(false);

        }

    };


    /* =====================================================
       AVATAR INITIALS
    ===================================================== */

    const getInitials = () => {

        const name =
            profile.fullName
                .trim();


        if (!name) {

            return "YG";

        }


        const parts =
            name.split(
                " "
            ).filter(Boolean);


        if (parts.length === 1) {

            return parts[0]
                .substring(
                    0,
                    2
                )
                .toUpperCase();

        }


        return (
            parts[0][0] +
            parts[parts.length - 1][0]
        ).toUpperCase();

    };


    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {

        return (

            <section className="profile-page">

                <header className="profile-header">

                    <div>

                        <div className="profile-eyebrow">

                            <span className="profile-eyebrow-dot" />

                            ACCOUNT

                        </div>


                        <h1>
                            My Profile
                        </h1>


                        <p>
                            Loading your profile information...
                        </p>

                    </div>

                </header>


                <div className="profile-section">

                    <div className="profile-bio">

                        Loading profile...

                    </div>

                </div>

            </section>

        );

    }


    /* =====================================================
       PROFILE VIEW
    ===================================================== */

    return (

        <section className="profile-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <header className="profile-header">

                <div>

                    <div className="profile-eyebrow">

                        <span className="profile-eyebrow-dot" />

                        ACCOUNT

                    </div>


                    <h1>
                        My Profile
                    </h1>


                    <p>
                        Manage your profile information
                        and account details.
                    </p>

                </div>


                <button
                    type="button"
                    className="profile-edit-button"
                    onClick={handleEdit}
                >

                    ✎ Edit Profile

                </button>

            </header>


            {/* =================================================
                ERROR MESSAGE
            ================================================= */}

            {error && (

                <div
                    className="profile-success"
                    style={{
                        color: "#dc2626",
                    }}
                >

                    ⚠️ {error}

                </div>

            )}


            {/* =================================================
                SUCCESS MESSAGE
            ================================================= */}

            {saved && (

                <div className="profile-success">

                    <span>✓</span>

                    Profile updated successfully.

                </div>

            )}


            {/* =================================================
                PROFILE OVERVIEW
            ================================================= */}

            <section className="profile-overview">

                <div className="profile-avatar">

                    {getInitials()}

                </div>


                <div className="profile-overview-info">

                    <h2>
                        {profile.fullName}
                    </h2>


                    <p>
                        {profile.role}
                    </p>


                    <span className="profile-department">

                        {profile.department}

                    </span>

                </div>


                <div className="profile-active">

                    <span className="active-dot" />

                    {profile.accountStatus ||
                        "Active"} Account

                </div>

            </section>


            {/* =================================================
                PERSONAL INFORMATION
            ================================================= */}

            <section className="profile-section">

                <div className="profile-section-header">

                    <div>

                        <span className="profile-section-label">
                            PROFILE
                        </span>

                        <h2>
                            Personal Information
                        </h2>

                    </div>

                </div>


                <div className="profile-grid">


                    {/* FULL NAME */}

                    <div className="profile-field">

                        <span>
                            Full Name
                        </span>

                        <strong>
                            {profile.fullName}
                        </strong>

                    </div>


                    {/* EMAIL */}

                    <div className="profile-field">

                        <span>
                            Email
                        </span>

                        <strong>
                            {profile.email}
                        </strong>

                    </div>


                    {/* PHONE */}

                    <div className="profile-field">

                        <span>
                            Phone
                        </span>

                        <strong>

                            {profile.phone ||
                                "Not provided"}

                        </strong>

                    </div>


                    {/* ROLE */}

                    <div className="profile-field">

                        <span>
                            Role
                        </span>

                        <strong>
                            {profile.role}
                        </strong>

                    </div>


                    {/* DEPARTMENT */}

                    <div className="profile-field">

                        <span>
                            Department
                        </span>

                        <strong>
                            {profile.department}
                        </strong>

                    </div>


                    {/* ACCOUNT */}

                    <div className="profile-field">

                        <span>
                            Account Status
                        </span>

                        <strong className="account-active">

                            <span />

                            {profile.accountStatus ||
                                "Active"}

                        </strong>

                    </div>

                </div>

            </section>


            {/* =================================================
                ABOUT
            ================================================= */}

            <section className="profile-section">

                <div className="profile-section-header">

                    <div>

                        <span className="profile-section-label">
                            ABOUT
                        </span>

                        <h2>
                            Professional Bio
                        </h2>

                    </div>

                </div>


                <div className="profile-bio">

                    {profile.bio}

                </div>

            </section>


            {/* =================================================
                EDIT MODAL
            ================================================= */}

            {editMode && (

                <div
                    className="profile-modal-overlay"
                    onMouseDown={(event) => {

                        if (
                            event.target ===
                            event.currentTarget
                        ) {

                            handleCancel();

                        }

                    }}
                >

                    <div className="profile-modal">


                        {/* MODAL HEADER */}

                        <div className="profile-modal-header">

                            <div>

                                <span className="profile-section-label">
                                    ACCOUNT
                                </span>

                                <h2>
                                    Edit Profile
                                </h2>

                            </div>


                            <button
                                type="button"
                                className="profile-close-button"
                                onClick={handleCancel}
                                disabled={saving}
                            >

                                ×

                            </button>

                        </div>


                        {/* FORM */}

                        <form
                            onSubmit={handleSave}
                            className="profile-form"
                        >


                            {/* FULL NAME */}

                            <div className="profile-form-group">

                                <label htmlFor="fullName">
                                    Full Name
                                </label>

                                <input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    value={
                                        formData.fullName
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                    disabled={saving}
                                />

                            </div>


                            {/* EMAIL */}

                            <div className="profile-form-group">

                                <label htmlFor="email">
                                    Email
                                </label>

                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={
                                        formData.email
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                    disabled={saving}
                                />

                            </div>


                            {/* PHONE */}

                            <div className="profile-form-group">

                                <label htmlFor="phone">
                                    Phone
                                </label>

                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    value={
                                        formData.phone
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter phone number"
                                    disabled={saving}
                                />

                            </div>


                            {/* ROLE + DEPARTMENT */}

                            <div className="profile-form-row">


                                <div className="profile-form-group">

                                    <label htmlFor="role">
                                        Role
                                    </label>

                                    <input
                                        id="role"
                                        name="role"
                                        type="text"
                                        value={
                                            formData.role
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        disabled={saving}
                                    />

                                </div>


                                <div className="profile-form-group">

                                    <label htmlFor="department">
                                        Department
                                    </label>

                                    <input
                                        id="department"
                                        name="department"
                                        type="text"
                                        value={
                                            formData.department
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        disabled={saving}
                                    />

                                </div>

                            </div>


                            {/* BIO */}

                            <div className="profile-form-group">

                                <label htmlFor="bio">
                                    Professional Bio
                                </label>

                                <textarea
                                    id="bio"
                                    name="bio"
                                    rows="4"
                                    value={
                                        formData.bio
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Tell us about yourself..."
                                    disabled={saving}
                                />

                            </div>


                            {/* ACTIONS */}

                            <div className="profile-form-actions">

                                <button
                                    type="button"
                                    className="profile-cancel-button"
                                    onClick={handleCancel}
                                    disabled={saving}
                                >

                                    Cancel

                                </button>


                                <button
                                    type="submit"
                                    className="profile-save-button"
                                    disabled={saving}
                                >

                                    {saving ? (

                                        <>
                                            Saving...
                                        </>

                                    ) : (

                                        <>
                                            ✓ Save Changes
                                        </>

                                    )}

                                </button>

                            </div>


                        </form>

                    </div>

                </div>

            )}

        </section>

    );

}


export default ProfilePage;