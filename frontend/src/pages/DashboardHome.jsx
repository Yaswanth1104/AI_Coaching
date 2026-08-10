import { useState } from "react";

import ChatWindow from "../components/ChatWindow";
import CustomerUnderstandingCard from "../components/CustomerUnderstandingCard";

import { analyzeMessage } from "../services/api";


/* =========================================================
   SESSION
========================================================= */

function createSessionId() {

    const existing =
        localStorage.getItem("support_session_id");

    if (existing) {
        return existing;
    }

    const id =
        typeof crypto !== "undefined" &&
        typeof crypto.randomUUID === "function"

            ? crypto.randomUUID()

            : `${Date.now()}-${Math.random()
                .toString(36)
                .slice(2)}`;

    localStorage.setItem(
        "support_session_id",
        id
    );

    return id;
}


/* =========================================================
   DASHBOARD HOME
========================================================= */

function DashboardHome() {

    /* =====================================================
       SESSION ID
    ===================================================== */

    const [sessionId] =
        useState(createSessionId);


    /* =====================================================
       CUSTOMER MESSAGE
    ===================================================== */

    const [message, setMessage] =
        useState("");


    /* =====================================================
       CHAT MESSAGES
    ===================================================== */

    const [messages, setMessages] =
        useState([]);


    /* =====================================================
       LOADING
    ===================================================== */

    const [loading, setLoading] =
        useState(false);


    /* =====================================================
       ERROR
    ===================================================== */

    const [error, setError] =
        useState("");


    /* =====================================================
       AI ANALYSIS STATE

       Backend lo 6 agents work avuthayi.

       UI lo Customer Understanding matrame
       display chestham.

       Remaining results future Reports /
       Analytics kosam store chestham.
    ===================================================== */

    const [understanding, setUnderstanding] =
        useState(null);


    const [knowledge, setKnowledge] =
        useState(null);


    const [quality, setQuality] =
        useState(null);


    const [supervisor, setSupervisor] =
        useState(null);


    const [escalation, setEscalation] =
        useState(null);


    const [postInteractionSummary, setPostInteractionSummary] =
        useState(null);


    /* =====================================================
       UPDATE AI ANALYSIS
    ===================================================== */

    const updateAnalysis = (data = {}) => {

        setUnderstanding(
            data.understanding || null
        );


        setKnowledge(
            data.knowledge || null
        );


        setQuality(
            data.quality || null
        );


        setSupervisor(
            data.supervisor || null
        );


        setEscalation(
            data.escalation || null
        );


        setPostInteractionSummary(
            data.post_interaction_summary || null
        );

    };


    /* =====================================================
       ANALYZE CONVERSATION
    ===================================================== */

    const analyzeConversation = async () => {

        const trimmedMessage =
            message.trim();


        /* -------------------------------------------------
           Prevent Empty Message
        ------------------------------------------------- */

        if (
            !trimmedMessage ||
            loading
        ) {

            return;
        }


        try {

            /* ---------------------------------------------
               Clear Previous Error
            --------------------------------------------- */

            setError("");


            /* ---------------------------------------------
               Start Loading
            --------------------------------------------- */

            setLoading(true);


            /* ---------------------------------------------
               ADD CUSTOMER MESSAGE
            --------------------------------------------- */

            const customerMessage = {

                id:
                    `${Date.now()}-customer`,

                sender:
                    "customer",

                text:
                    trimmedMessage,

                timestamp:
                    new Date().toISOString(),

            };


            setMessages(
                (previous) => [

                    ...previous,

                    customerMessage,

                ]
            );


            /* ---------------------------------------------
               CLEAR INPUT
            --------------------------------------------- */

            setMessage("");


            /* ---------------------------------------------
               CALL BACKEND
            --------------------------------------------- */

            const data =
                await analyzeMessage(
                    trimmedMessage,
                    sessionId
                );


            /* ---------------------------------------------
               CHECK BACKEND RESPONSE
            --------------------------------------------- */

            if (!data) {

                throw new Error(
                    "No response received from backend."
                );

            }


            /* ---------------------------------------------
               UPDATE AI ANALYSIS
            --------------------------------------------- */

            updateAnalysis(data);


            /* ---------------------------------------------
               ADD AI COACH RESPONSE
            --------------------------------------------- */

            if (data?.coach) {

                /*
                 * Backend Coach Agent returns:
                 *
                 * {
                 *   recommended_response: "...",
                 *   suggested_actions: [],
                 *   coaching_tips: [],
                 *   confidence: 90
                 * }
                 *
                 * So we must display:
                 *
                 * data.coach.recommended_response
                 */

                let coachText = "";


                /* -----------------------------------------
                   Coach response is an object
                ----------------------------------------- */

                if (
                    typeof data.coach === "object"
                ) {

                    coachText =
                        data.coach.recommended_response ||
                        "";

                }


                /* -----------------------------------------
                   Safety: Coach response is string
                ----------------------------------------- */

                else if (
                    typeof data.coach === "string"
                ) {

                    coachText =
                        data.coach;

                }


                /* -----------------------------------------
                   Fallback
                ----------------------------------------- */

                if (!coachText.trim()) {

                    coachText =
                        "I'm sorry, I couldn't generate a response.";

                }


                /* -----------------------------------------
                   Create Coach Message
                ----------------------------------------- */

                const coachMessage = {

                    id:
                        `${Date.now()}-coach`,

                    sender:
                        "coach",

                    text:
                        coachText,

                    timestamp:
                        new Date().toISOString(),

                };


                /* -----------------------------------------
                   Add Coach Message To Chat
                ----------------------------------------- */

                setMessages(
                    (previous) => [

                        ...previous,

                        coachMessage,

                    ]
                );

            }


        } catch (err) {

            /* ---------------------------------------------
               Console Error
            --------------------------------------------- */

            console.error(
                "Conversation analysis failed:",
                err
            );


            /* ---------------------------------------------
               User Error
            --------------------------------------------- */

            setError(
                err?.message ||
                "Unable to analyze the conversation. Please check the backend connection and try again."
            );


        } finally {

            /* ---------------------------------------------
               Stop Loading
            --------------------------------------------- */

            setLoading(false);

        }

    };


    /* =====================================================
       KEYBOARD SHORTCUT

       Ctrl + Enter
       OR
       Cmd + Enter
    ===================================================== */

    const handleKeyDown = (event) => {

        if (
            event.key === "Enter" &&
            (event.ctrlKey || event.metaKey)
        ) {

            event.preventDefault();

            analyzeConversation();

        }

    };


    /* =====================================================
       UI
    ===================================================== */

    return (

        <section className="dashboard-page">


            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <header className="dashboard-header">

                <div className="dashboard-header-left">

                    <div className="dashboard-eyebrow">

                        <span className="dashboard-eyebrow-dot" />

                        LIVE AI ANALYSIS

                    </div>


                    <h1>
                        Customer Support Workspace
                    </h1>


                    <p>
                        Analyze customer conversations
                        and get real-time AI-powered
                        support insights.
                    </p>

                </div>


                {/* ---------------------------------------------
                   SYSTEM STATUS
                --------------------------------------------- */}

                <div className="session-status">

                    <span className="session-status-dot" />

                    AI system active

                </div>

            </header>


            {/* =================================================
                KPI CARDS
            ================================================= */}

            <section className="dashboard-kpis">


                {/* =================================================
                    CONVERSATION MESSAGES
                ================================================= */}

                <div className="kpi-card">

                    <div className="kpi-top">

                        <div className="kpi-icon">
                            💬
                        </div>


                        <span className="status-badge info">
                            LIVE
                        </span>

                    </div>


                    <div className="kpi-label">
                        Conversation Messages
                    </div>


                    <div className="kpi-value">
                        {messages.length}
                    </div>


                    <div className="kpi-change">
                        Current session
                    </div>

                </div>


                {/* =================================================
                    AI ANALYSIS
                ================================================= */}

                <div className="kpi-card">

                    <div className="kpi-top">

                        <div className="kpi-icon">
                            ✦
                        </div>


                        <span className="status-badge success">
                            ACTIVE
                        </span>

                    </div>


                    <div className="kpi-label">
                        AI Analysis
                    </div>


                    <div className="kpi-value">

                        {
                            understanding
                                ? "Ready"
                                : "Waiting"
                        }

                    </div>


                    <div className="kpi-change">
                        Real-time intelligence
                    </div>

                </div>


                {/* =================================================
                    KNOWLEDGE RETRIEVAL
                ================================================= */}

                <div className="kpi-card">

                    <div className="kpi-top">

                        <div className="kpi-icon">
                            ◈
                        </div>


                        <span className="status-badge info">
                            RAG
                        </span>

                    </div>


                    <div className="kpi-label">
                        Knowledge Retrieval
                    </div>


                    <div className="kpi-value">

                        {
                            knowledge
                                ? "Found"
                                : "Waiting"
                        }

                    </div>


                    <div className="kpi-change">
                        Context-aware support
                    </div>

                </div>


                {/* =================================================
                    QUALITY EVALUATION
                ================================================= */}

                <div className="kpi-card">

                    <div className="kpi-top">

                        <div className="kpi-icon">
                            ✓
                        </div>


                        <span
                            className={
                                quality
                                    ? "status-badge success"
                                    : "status-badge warning"
                            }
                        >

                            {
                                quality
                                    ? "ANALYZED"
                                    : "PENDING"
                            }

                        </span>

                    </div>


                    <div className="kpi-label">
                        Quality Evaluation
                    </div>


                    <div className="kpi-value">

                        {
                            quality
                                ? "Available"
                                : "Pending"
                        }

                    </div>


                    <div className="kpi-change">
                        AI-assisted evaluation
                    </div>

                </div>

            </section>


            {/* =================================================
                MAIN WORKSPACE
            ================================================= */}

            <div className="workspace-grid">


                {/* =================================================
                    LEFT — CUSTOMER CONVERSATION
                ================================================= */}

                <section className="conversation-panel">


                    {/* =================================================
                        PANEL HEADER
                    ================================================= */}

                    <div className="panel-header">

                        <div className="panel-title-group">

                            <span className="panel-kicker">
                                SUPPORT WORKSPACE
                            </span>


                            <h2>
                                Customer Conversation
                            </h2>

                        </div>


                        <span className="panel-badge">

                            {messages.length}

                            {" "}

                            {
                                messages.length === 1
                                    ? "message"
                                    : "messages"
                            }

                        </span>

                    </div>


                    {/* =================================================
                        CHAT WINDOW
                    ================================================= */}

                    <ChatWindow
                        messages={messages}
                    />


                    {/* =================================================
                        MESSAGE COMPOSER
                    ================================================= */}

                    <div className="composer">


                        {/* ---------------------------------------------
                           Composer Label
                        --------------------------------------------- */}

                        <div className="composer-label">

                            <span>
                                Customer message
                            </span>


                            <span>
                                Ctrl + Enter to analyze
                            </span>

                        </div>


                        {/* ---------------------------------------------
                           Textarea
                        --------------------------------------------- */}

                        <textarea

                            rows={4}

                            value={message}

                            onChange={(event) =>
                                setMessage(
                                    event.target.value
                                )
                            }

                            onKeyDown={
                                handleKeyDown
                            }

                            placeholder={
                                "Type or paste the customer's message here..."
                            }

                            aria-label="Customer message"

                            disabled={loading}

                        />


                        {/* ---------------------------------------------
                           Composer Footer
                        --------------------------------------------- */}

                        <div className="composer-footer">


                            <span className="composer-hint">

                                AI will analyze the customer
                                conversation and generate
                                support insights.

                            </span>


                            {/* -----------------------------------------
                               Analyze Button
                            ----------------------------------------- */}

                            <button

                                type="button"

                                onClick={
                                    analyzeConversation
                                }

                                disabled={
                                    loading ||
                                    !message.trim()
                                }

                                className="analyze-button"

                            >

                                {

                                    loading ? (

                                        <>

                                            <span className="button-spinner" />

                                            Analyzing...

                                        </>

                                    ) : (

                                        <>
                                            ✦ Analyze Conversation
                                        </>

                                    )

                                }

                            </button>

                        </div>


                        {/* =================================================
                            ERROR MESSAGE
                        ================================================= */}

                        {error && (

                            <div
                                className="dashboard-error"
                                role="alert"
                            >

                                ⚠️ {error}

                            </div>

                        )}

                    </div>

                </section>


                {/* =================================================
                    RIGHT — AI INSIGHTS
                ================================================= */}

                <aside className="insights-panel">


                    {/* =================================================
                        INSIGHTS HEADER
                    ================================================= */}

                    <div className="insights-heading">

                        <div>

                            <span className="panel-kicker">
                                AI INTELLIGENCE
                            </span>


                            <h2>
                                Conversation Analysis
                            </h2>

                        </div>


                        <span className="status-badge success">
                            AI READY
                        </span>

                    </div>


                    {/* =================================================
                        CUSTOMER UNDERSTANDING ONLY
                        
                        Other agents are NOT displayed separately.
                        They still execute in LangGraph backend.
                    ================================================= */}

                    <CustomerUnderstandingCard
                        analysis={
                            understanding
                        }
                    />

                </aside>

            </div>

        </section>

    );
}


export default DashboardHome;