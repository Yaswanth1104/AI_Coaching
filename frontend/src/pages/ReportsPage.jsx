import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";

import {
    getHistory,
    deleteReport
} from "../services/api";

import "./ReportsPage.css";


/* =========================================================
   REPORTS PAGE
========================================================= */

function ReportsPage() {

    const [history, setHistory] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [selectedReport, setSelectedReport] =
        useState(null);

    const [deleteTarget, setDeleteTarget] =
        useState(null);

    const [deleting, setDeleting] =
        useState(false);

    const [deleteError, setDeleteError] =
        useState("");


    /* =====================================================
       LOAD HISTORY
    ===================================================== */

    useEffect(() => {

        const loadHistory = async () => {

            try {

                const response =
                    await getHistory();

                setHistory(
                    Array.isArray(response?.history)
                        ? response.history
                        : []
                );

            } catch (error) {

                console.error(
                    "Failed to load reports:",
                    error
                );

                setHistory([]);

            } finally {

                setLoading(false);

            }

        };


        loadHistory();

    }, []);


    /* =====================================================
       BASIC DATA HELPERS
    ===================================================== */

    const getQuality = (item) => {

        const score =
            item?.quality?.overall_score ??
            item?.post_interaction_summary
                ?.resolution_quality_score;

        if (
            score === undefined ||
            score === null ||
            score === ""
        ) {

            return "—";

        }

        return score;

    };


    const getIntent = (item) => {

        return (
            item?.understanding?.intent ||
            item?.post_interaction_summary?.customer_intent ||
            "Unknown"
        );

    };


    const getSentiment = (item) => {

        return (
            item?.understanding?.sentiment ||
            "Unknown"
        );

    };


    const getCustomerMessage = (item) => {

        return (
            item?.customer_message ||
            item?.message ||
            "No customer message recorded."
        );

    };


    /* =====================================================
       REPORT ID
    ===================================================== */

    const getReportId = (
        item,
        index
    ) => {

        return (
            item?.report_id ||
            item?.id ||
            `CONV-${String(index + 1).padStart(4, "0")}`
        );

    };


    /* =====================================================
       ACTUAL BACKEND ID
       
       Important:
       Fallback CONV-0001 is only display ID.
       Delete API requires real stored ID.
    ===================================================== */

    const getActualReportId = (item) => {

        return (
            item?.report_id ||
            item?.id ||
            null
        );

    };


    /* =====================================================
       ANALYSIS SUMMARY
    ===================================================== */

    const getAnalysisSummary = (item) => {

        const summary =
            item?.post_interaction_summary
                ?.conversation_summary;

        if (
            summary &&
            typeof summary === "string"
        ) {

            return summary;

        }


        if (
            item?.summary &&
            typeof item.summary === "string"
        ) {

            return item.summary;

        }


        if (
            item?.analysis?.summary &&
            typeof item.analysis.summary === "string"
        ) {

            return item.analysis.summary;

        }


        return "Analysis summary is not available.";

    };


    /* =====================================================
       ESCALATION RISK
    ===================================================== */

    const getEscalationRisk = (item) => {

        const escalation =
            item?.escalation || {};


        return (
            escalation?.risk_level ||
            escalation?.risk ||
            escalation?.escalation_risk ||
            item?.escalation_risk ||
            item?.risk ||
            "Low"
        );

    };


    /* =====================================================
       ESCALATION REASON
    ===================================================== */

    const getEscalationReason = (item) => {

        const escalation =
            item?.escalation || {};


        return (
            escalation?.reason ||
            escalation?.explanation ||
            escalation?.risk_reason ||
            item?.escalation_reason ||
            item?.supervisor?.escalation_reason ||
            "No escalation reason recorded."
        );

    };


    /* =====================================================
       RESOLUTION STATUS
    ===================================================== */

    const getResolutionStatus = (item) => {

        return (
            item?.post_interaction_summary
                ?.resolution_status ||
            item?.supervisor?.decision ||
            "Pending"
        );

    };


    /* =====================================================
       SENTIMENT JOURNEY
    ===================================================== */

    const getSentimentJourney = (item) => {

        return (
            item?.post_interaction_summary
                ?.sentiment_journey ||
            getSentiment(item)
        );

    };


    /* =====================================================
       STRENGTHS
    ===================================================== */

    const getStrengths = (item) => {

        const strengths =
            item?.post_interaction_summary
                ?.strengths;

        return Array.isArray(strengths)
            ? strengths
            : [];

    };


    /* =====================================================
       IMPROVEMENTS
    ===================================================== */

    const getImprovements = (item) => {

        const improvements =
            item?.post_interaction_summary
                ?.improvements;

        return Array.isArray(improvements)
            ? improvements
            : [];

    };


    /* =====================================================
       COACHING RECOMMENDATIONS
    ===================================================== */

    const getCoachingRecommendations = (
        item
    ) => {

        const recommendations =
            item?.post_interaction_summary
                ?.coaching_recommendations;

        return Array.isArray(
            recommendations
        )
            ? recommendations
            : [];

    };


    /* =====================================================
       COACH RESPONSE
    ===================================================== */

    const getCoachResponse = (item) => {

        return (
            item?.coach?.recommended_response ||
            "No recommended response recorded."
        );

    };


    /* =====================================================
       FORMAT VALUE
    ===================================================== */

    const formatText = (value) => {

        if (
            value === undefined ||
            value === null ||
            value === ""
        ) {

            return "Not available";

        }


        return String(value);

    };


    /* =====================================================
       DELETE - OPEN CONFIRMATION
    ===================================================== */

    const openDeleteConfirmation = (
        item,
        index
    ) => {

        setDeleteError("");

        setDeleteTarget({
            item,
            index
        });

    };


    /* =====================================================
       DELETE - CANCEL
    ===================================================== */

    const cancelDelete = () => {

        if (deleting) {
            return;
        }

        setDeleteTarget(null);

        setDeleteError("");

    };


    /* =====================================================
       DELETE - CONFIRM
    ===================================================== */

    const handleDelete = async () => {

        if (
            !deleteTarget ||
            deleting
        ) {

            return;

        }


        const {
            item,
            index
        } = deleteTarget;


        const actualReportId =
            getActualReportId(item);


        /* -------------------------------------------------
           Old record without ID
           
           Backend cannot safely delete it by fallback
           display ID.
        ------------------------------------------------- */

        if (!actualReportId) {

            setDeleteError(
                "This is an older report without a stored report ID. Please create a new report before deleting it."
            );

            return;

        }


        try {

            setDeleting(true);

            setDeleteError("");


            await deleteReport(
                actualReportId
            );


            /* -------------------------------------------------
               Remove from frontend immediately
            ------------------------------------------------- */

            setHistory(
                (currentHistory) =>
                    currentHistory.filter(
                        (historyItem) => {

                            const historyId =
                                getActualReportId(
                                    historyItem
                                );

                            return (
                                historyId !==
                                actualReportId
                            );

                        }
                    )
            );


            /* -------------------------------------------------
               Close View modal if same report
            ------------------------------------------------- */

            if (
                selectedReport &&
                getActualReportId(
                    selectedReport.item
                ) === actualReportId
            ) {

                setSelectedReport(
                    null
                );

            }


            setDeleteTarget(
                null
            );


        } catch (error) {

            console.error(
                "Failed to delete report:",
                error
            );


            const backendMessage =
                error?.response?.data?.error;


            setDeleteError(
                backendMessage ||
                "Failed to delete the report. Please try again."
            );


        } finally {

            setDeleting(false);

        }

    };


    /* =====================================================
       PDF HELPERS
    ===================================================== */

    const addPDFSection = (
        doc,
        title,
        content,
        y
    ) => {

        const pageHeight = 280;


        if (y > pageHeight) {

            doc.addPage();

            y = 20;

        }


        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.setFontSize(11);

        doc.setTextColor(
            33,
            102,
            243
        );

        doc.text(
            title,
            20,
            y
        );


        y += 8;


        doc.setFont(
            "helvetica",
            "normal"
        );

        doc.setFontSize(10);

        doc.setTextColor(
            67,
            88,
            116
        );


        const lines =
            doc.splitTextToSize(
                String(content),
                165
            );


        if (
            y +
                lines.length * 5 >
            pageHeight
        ) {

            doc.addPage();

            y = 20;

        }


        doc.text(
            lines,
            20,
            y
        );


        return (
            y +
            lines.length * 5 +
            12
        );

    };


    /* =====================================================
       DOWNLOAD PDF
    ===================================================== */

    const downloadPDF = (
        item,
        index
    ) => {

        const doc =
            new jsPDF();


        const reportId =
            getReportId(
                item,
                index
            );


        const quality =
            getQuality(item);


        const intent =
            getIntent(item);


        const sentiment =
            getSentiment(item);


        const customerMessage =
            getCustomerMessage(item);


        const summary =
            getAnalysisSummary(item);


        const escalationRisk =
            getEscalationRisk(item);


        const escalationReason =
            getEscalationReason(item);


        const resolutionStatus =
            getResolutionStatus(item);


        const sentimentJourney =
            getSentimentJourney(item);


        const coachResponse =
            getCoachResponse(item);


        const strengths =
            getStrengths(item);


        const improvements =
            getImprovements(item);


        const recommendations =
            getCoachingRecommendations(item);


        /* =================================================
           PDF HEADER
        ================================================= */

        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.setFontSize(20);

        doc.setTextColor(
            16,
            35,
            63
        );

        doc.text(
            "AI Coach",
            20,
            22
        );


        doc.setFont(
            "helvetica",
            "normal"
        );

        doc.setFontSize(9);

        doc.setTextColor(
            95,
            112,
            140
        );

        doc.text(
            "Support Intelligence",
            20,
            29
        );


        doc.setDrawColor(
            220,
            228,
            238
        );

        doc.line(
            20,
            36,
            190,
            36
        );


        /* =================================================
           TITLE
        ================================================= */

        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.setFontSize(16);

        doc.setTextColor(
            16,
            35,
            63
        );

        doc.text(
            "Conversation Analysis Report",
            20,
            50
        );


        doc.setFont(
            "helvetica",
            "normal"
        );

        doc.setFontSize(9);

        doc.setTextColor(
            100,
            115,
            135
        );

        doc.text(
            `Report ID: ${reportId}`,
            20,
            58
        );


        /* =================================================
           REPORT OVERVIEW
        ================================================= */

        doc.setFillColor(
            247,
            249,
            252
        );

        doc.setDrawColor(
            225,
            232,
            241
        );

        doc.roundedRect(
            20,
            68,
            170,
            42,
            4,
            4,
            "FD"
        );


        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.setFontSize(8);

        doc.setTextColor(
            80,
            100,
            125
        );

        doc.text(
            "QUALITY",
            28,
            79
        );

        doc.text(
            "INTENT",
            68,
            79
        );

        doc.text(
            "SENTIMENT",
            112,
            79
        );

        doc.text(
            "ESCALATION",
            157,
            79
        );


        doc.setFontSize(10);

        doc.setTextColor(
            16,
            35,
            63
        );


        doc.text(
            `${quality}%`,
            28,
            91
        );


        doc.text(
            String(intent).slice(
                0,
                18
            ),
            68,
            91
        );


        doc.text(
            String(sentiment).slice(
                0,
                18
            ),
            112,
            91
        );


        doc.text(
            String(escalationRisk).slice(
                0,
                15
            ),
            157,
            91
        );


        /* =================================================
           REPORT SECTIONS
        ================================================= */

        let y = 126;


        y = addPDFSection(
            doc,
            "CUSTOMER MESSAGE",
            customerMessage,
            y
        );


        y = addPDFSection(
            doc,
            "ANALYSIS SUMMARY",
            summary,
            y
        );


        y = addPDFSection(
            doc,
            "CUSTOMER INTENT",
            intent,
            y
        );


        y = addPDFSection(
            doc,
            "SENTIMENT JOURNEY",
            sentimentJourney,
            y
        );


        y = addPDFSection(
            doc,
            "RESOLUTION STATUS",
            resolutionStatus,
            y
        );


        y = addPDFSection(
            doc,
            "ESCALATION RISK",
            escalationRisk,
            y
        );


        y = addPDFSection(
            doc,
            "ESCALATION REASON",
            escalationReason,
            y
        );


        y = addPDFSection(
            doc,
            "RECOMMENDED RESPONSE",
            coachResponse,
            y
        );


        /* =================================================
           STRENGTHS
        ================================================= */

        if (
            strengths.length > 0
        ) {

            y = addPDFSection(
                doc,
                "STRENGTHS",
                strengths
                    .map(
                        (strength) =>
                            `• ${strength}`
                    )
                    .join("\n"),
                y
            );

        }


        /* =================================================
           IMPROVEMENTS
        ================================================= */

        if (
            improvements.length > 0
        ) {

            y = addPDFSection(
                doc,
                "IMPROVEMENTS",
                improvements
                    .map(
                        (improvement) =>
                            `• ${improvement}`
                    )
                    .join("\n"),
                y
            );

        }


        /* =================================================
           COACHING RECOMMENDATIONS
        ================================================= */

        if (
            recommendations.length > 0
        ) {

            y = addPDFSection(
                doc,
                "COACHING RECOMMENDATIONS",
                recommendations
                    .map(
                        (recommendation) =>
                            `• ${recommendation}`
                    )
                    .join("\n"),
                y
            );

        }


        /* =================================================
           PDF FOOTER
        ================================================= */

        const pageCount =
            doc.getNumberOfPages();


        for (
            let page = 1;
            page <= pageCount;
            page++
        ) {

            doc.setPage(
                page
            );


            doc.setDrawColor(
                225,
                232,
                241
            );

            doc.line(
                20,
                282,
                190,
                282
            );


            doc.setFont(
                "helvetica",
                "normal"
            );

            doc.setFontSize(8);

            doc.setTextColor(
                130,
                145,
                165
            );


            doc.text(
                "AI Coach • Support Intelligence",
                20,
                289
            );


            doc.text(
                `Page ${page} of ${pageCount}`,
                165,
                289
            );

        }


        /* =================================================
           DOWNLOAD
        ================================================= */

        doc.save(
            `${reportId}-conversation-report.pdf`
        );

    };


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <section className="reports-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="reports-header">

                <div>

                    <span className="eyebrow">
                        HISTORY
                    </span>


                    <h1>
                        Conversation Reports
                    </h1>


                    <p>
                        Review previous customer
                        interactions and their
                        analysis outcomes.
                    </p>

                </div>


                {!loading &&
                    history.length > 0 && (

                    <div className="reports-count">

                        {history.length}{" "}

                        {
                            history.length === 1
                                ? "Report"
                                : "Reports"
                        }

                    </div>

                )}

            </div>


            {/* =================================================
                LOADING
            ================================================= */}

            {loading && (

                <div className="reports-state">

                    <div className="reports-spinner" />

                    <h2>
                        Loading Reports
                    </h2>


                    <p>
                        Fetching conversation
                        analysis reports...
                    </p>

                </div>

            )}


            {/* =================================================
                EMPTY
            ================================================= */}

            {!loading &&
                history.length === 0 && (

                <div className="reports-state">

                    <div className="empty-icon">
                        📄
                    </div>


                    <h2>
                        No Reports Available
                    </h2>


                    <p>
                        Conversation reports will
                        appear here after customer
                        interactions are analyzed.
                    </p>

                </div>

            )}


            {/* =================================================
                REPORT GRID
            ================================================= */}

            {!loading &&
                history.length > 0 && (

                <div className="reports-grid">

                    {history.map(
                        (
                            item,
                            index
                        ) => {

                            const reportId =
                                getReportId(
                                    item,
                                    index
                                );


                            const actualReportId =
                                getActualReportId(
                                    item
                                );


                            const quality =
                                getQuality(
                                    item
                                );


                            const intent =
                                getIntent(
                                    item
                                );


                            const sentiment =
                                getSentiment(
                                    item
                                );


                            const customerMessage =
                                getCustomerMessage(
                                    item
                                );


                            const summary =
                                getAnalysisSummary(
                                    item
                                );


                            const escalationRisk =
                                getEscalationRisk(
                                    item
                                );


                            const resolutionStatus =
                                getResolutionStatus(
                                    item
                                );


                            return (

                                <article
                                    className="report-document"
                                    key={
                                        actualReportId ||
                                        `report-${index}`
                                    }
                                >

                                    {/* DOCUMENT HEADER */}

                                    <div className="document-header">

                                        <div>

                                            <span className="document-label">
                                                CONVERSATION REPORT
                                            </span>


                                            <h2>
                                                Conversation{" "}
                                                {index + 1}
                                            </h2>


                                            <span className="report-id">
                                                {reportId}
                                            </span>

                                        </div>


                                        <div className="quality-badge">

                                            <small>
                                                QUALITY
                                            </small>


                                            <strong>
                                                {quality}%
                                            </strong>

                                        </div>

                                    </div>


                                    <div className="document-divider" />


                                    {/* CUSTOMER MESSAGE */}

                                    <div className="conversation-preview">

                                        <span>
                                            CUSTOMER MESSAGE
                                        </span>


                                        <p>
                                            {customerMessage}
                                        </p>

                                    </div>


                                    {/* DETAILS */}

                                    <div className="report-details">

                                        <div className="detail-item">

                                            <span>
                                                Intent
                                            </span>


                                            <strong
                                                title={
                                                    formatText(
                                                        intent
                                                    )
                                                }
                                            >
                                                {
                                                    formatText(
                                                        intent
                                                    )
                                                }
                                            </strong>

                                        </div>


                                        <div className="detail-item">

                                            <span>
                                                Sentiment
                                            </span>


                                            <strong
                                                title={
                                                    formatText(
                                                        sentiment
                                                    )
                                                }
                                            >
                                                {
                                                    formatText(
                                                        sentiment
                                                    )
                                                }
                                            </strong>

                                        </div>


                                        <div className="detail-item">

                                            <span>
                                                Escalation
                                            </span>


                                            <strong
                                                title={
                                                    formatText(
                                                        escalationRisk
                                                    )
                                                }
                                            >
                                                {
                                                    formatText(
                                                        escalationRisk
                                                    )
                                                }
                                            </strong>

                                        </div>

                                    </div>


                                    {/* SUMMARY */}

                                    <div
                                        className="conversation-preview"
                                        style={{
                                            marginTop:
                                                "18px"
                                        }}
                                    >

                                        <span>
                                            ANALYSIS SUMMARY
                                        </span>


                                        <p>
                                            {summary}
                                        </p>

                                    </div>


                                    {/* RESOLUTION */}

                                    <div className="report-details">

                                        <div className="detail-item">

                                            <span>
                                                Resolution
                                            </span>


                                            <strong>
                                                {
                                                    resolutionStatus
                                                }
                                            </strong>

                                        </div>


                                        <div className="detail-item">

                                            <span>
                                                Quality
                                            </span>


                                            <strong>
                                                {quality}%
                                            </strong>

                                        </div>


                                        <div className="detail-item">

                                            <span>
                                                Report
                                            </span>


                                            <strong
                                                title={reportId}
                                            >
                                                {reportId}
                                            </strong>

                                        </div>

                                    </div>


                                    {/* ACTIONS */}

                                    <div className="document-actions">

                                        <button
                                            type="button"
                                            className="view-btn"
                                            onClick={() =>
                                                setSelectedReport({
                                                    item,
                                                    index
                                                })
                                            }
                                        >
                                            👁 View Report
                                        </button>


                                        <button
                                            type="button"
                                            className="download-btn"
                                            onClick={() =>
                                                downloadPDF(
                                                    item,
                                                    index
                                                )
                                            }
                                        >
                                            ↓ Download PDF
                                        </button>


                                        <button
                                            type="button"
                                            className="delete-btn"
                                            disabled={
                                                !actualReportId
                                            }
                                            title={
                                                actualReportId
                                                    ? "Delete this report"
                                                    : "This older report has no stored report ID"
                                            }
                                            onClick={() =>
                                                openDeleteConfirmation(
                                                    item,
                                                    index
                                                )
                                            }
                                        >
                                            🗑 Delete
                                        </button>

                                    </div>

                                </article>

                            );

                        }
                    )}

                </div>

            )}


            {/* =================================================
                VIEW REPORT MODAL
            ================================================= */}

            {selectedReport && (

                <div
                    className="report-modal-overlay"
                    onClick={() =>
                        setSelectedReport(
                            null
                        )
                    }
                >

                    <div
                        className="report-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        {/* MODAL HEADER */}

                        <div className="modal-header">

                            <div>

                                <span className="document-label">
                                    CONVERSATION REPORT
                                </span>


                                <h2>
                                    Conversation{" "}
                                    {selectedReport.index + 1}
                                </h2>

                            </div>


                            <button
                                type="button"
                                className="modal-close"
                                onClick={() =>
                                    setSelectedReport(
                                        null
                                    )
                                }
                            >
                                ×
                            </button>

                        </div>


                        {/* MODAL BODY */}

                        <div className="modal-body">

                            {/* META */}

                            <div className="modal-report-meta">

                                <div>

                                    <span>
                                        Report ID
                                    </span>


                                    <strong>
                                        {
                                            getReportId(
                                                selectedReport.item,
                                                selectedReport.index
                                            )
                                        }
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Quality
                                    </span>


                                    <strong>
                                        {
                                            getQuality(
                                                selectedReport.item
                                            )
                                        }%
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Intent
                                    </span>


                                    <strong>
                                        {
                                            getIntent(
                                                selectedReport.item
                                            )
                                        }
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Sentiment
                                    </span>


                                    <strong>
                                        {
                                            getSentiment(
                                                selectedReport.item
                                            )
                                        }
                                    </strong>

                                </div>

                            </div>


                            {/* CUSTOMER MESSAGE */}

                            <div className="modal-section">

                                <span>
                                    CUSTOMER MESSAGE
                                </span>


                                <p>
                                    {
                                        getCustomerMessage(
                                            selectedReport.item
                                        )
                                    }
                                </p>

                            </div>


                            {/* ANALYSIS SUMMARY */}

                            <div className="modal-section">

                                <span>
                                    ANALYSIS SUMMARY
                                </span>


                                <p>
                                    {
                                        getAnalysisSummary(
                                            selectedReport.item
                                        )
                                    }
                                </p>

                            </div>


                            {/* SENTIMENT JOURNEY */}

                            <div className="modal-section">

                                <span>
                                    SENTIMENT JOURNEY
                                </span>


                                <p>
                                    {
                                        getSentimentJourney(
                                            selectedReport.item
                                        )
                                    }
                                </p>

                            </div>


                            {/* RESOLUTION STATUS */}

                            <div className="modal-section">

                                <span>
                                    RESOLUTION STATUS
                                </span>


                                <p>
                                    {
                                        getResolutionStatus(
                                            selectedReport.item
                                        )
                                    }
                                </p>

                            </div>


                            {/* ESCALATION RISK */}

                            <div className="modal-section">

                                <span>
                                    ESCALATION RISK
                                </span>


                                <p>
                                    {
                                        getEscalationRisk(
                                            selectedReport.item
                                        )
                                    }
                                </p>

                            </div>


                            {/* ESCALATION REASON */}

                            <div className="modal-section">

                                <span>
                                    ESCALATION REASON
                                </span>


                                <p>
                                    {
                                        getEscalationReason(
                                            selectedReport.item
                                        )
                                    }
                                </p>

                            </div>


                            {/* RECOMMENDED RESPONSE */}

                            <div className="modal-section">

                                <span>
                                    RECOMMENDED RESPONSE
                                </span>


                                <p>
                                    {
                                        getCoachResponse(
                                            selectedReport.item
                                        )
                                    }
                                </p>

                            </div>


                            {/* STRENGTHS */}

                            {getStrengths(
                                selectedReport.item
                            ).length > 0 && (

                                <div className="modal-section">

                                    <span>
                                        STRENGTHS
                                    </span>


                                    <ul>

                                        {getStrengths(
                                            selectedReport.item
                                        ).map(
                                            (
                                                strength,
                                                strengthIndex
                                            ) => (

                                                <li
                                                    key={
                                                        strengthIndex
                                                    }
                                                >
                                                    {strength}
                                                </li>

                                            )
                                        )}

                                    </ul>

                                </div>

                            )}


                            {/* IMPROVEMENTS */}

                            {getImprovements(
                                selectedReport.item
                            ).length > 0 && (

                                <div className="modal-section">

                                    <span>
                                        IMPROVEMENTS
                                    </span>


                                    <ul>

                                        {getImprovements(
                                            selectedReport.item
                                        ).map(
                                            (
                                                improvement,
                                                improvementIndex
                                            ) => (

                                                <li
                                                    key={
                                                        improvementIndex
                                                    }
                                                >
                                                    {improvement}
                                                </li>

                                            )
                                        )}

                                    </ul>

                                </div>

                            )}


                            {/* COACHING RECOMMENDATIONS */}

                            {getCoachingRecommendations(
                                selectedReport.item
                            ).length > 0 && (

                                <div className="modal-section">

                                    <span>
                                        COACHING RECOMMENDATIONS
                                    </span>


                                    <ul>

                                        {getCoachingRecommendations(
                                            selectedReport.item
                                        ).map(
                                            (
                                                recommendation,
                                                recommendationIndex
                                            ) => (

                                                <li
                                                    key={
                                                        recommendationIndex
                                                    }
                                                >
                                                    {
                                                        recommendation
                                                    }
                                                </li>

                                            )
                                        )}

                                    </ul>

                                </div>

                            )}

                        </div>


                        {/* MODAL FOOTER */}

                        <div className="modal-footer">

                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() =>
                                    setSelectedReport(
                                        null
                                    )
                                }
                            >
                                Close
                            </button>


                            <button
                                type="button"
                                className="download-btn"
                                onClick={() =>
                                    downloadPDF(
                                        selectedReport.item,
                                        selectedReport.index
                                    )
                                }
                            >
                                ↓ Download PDF
                            </button>


                            {getActualReportId(
                                selectedReport.item
                            ) && (

                                <button
                                    type="button"
                                    className="delete-btn"
                                    onClick={() => {

                                        const item =
                                            selectedReport.item;

                                        const index =
                                            selectedReport.index;

                                        setSelectedReport(
                                            null
                                        );

                                        openDeleteConfirmation(
                                            item,
                                            index
                                        );

                                    }}
                                >
                                    🗑 Delete
                                </button>

                            )}

                        </div>

                    </div>

                </div>

            )}


            {/* =================================================
                DELETE CONFIRMATION MODAL
            ================================================= */}

            {deleteTarget && (

                <div
                    className="report-modal-overlay"
                    onClick={
                        deleting
                            ? undefined
                            : cancelDelete
                    }
                >

                    <div
                        className="delete-confirm-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <div className="delete-confirm-icon">
                            🗑
                        </div>


                        <h2>
                            Delete Conversation Report?
                        </h2>


                        <p>
                            This will permanently remove
                            this conversation report from
                            your history.
                        </p>


                        <div className="delete-confirm-report">

                            <span>
                                REPORT
                            </span>


                            <strong>
                                {
                                    getReportId(
                                        deleteTarget.item,
                                        deleteTarget.index
                                    )
                                }
                            </strong>

                        </div>


                        {deleteError && (

                            <div
                                className="delete-error"
                                role="alert"
                            >
                                ⚠️ {deleteError}
                            </div>

                        )}


                        <div className="delete-confirm-actions">

                            <button
                                type="button"
                                className="cancel-btn"
                                disabled={deleting}
                                onClick={
                                    cancelDelete
                                }
                            >
                                Cancel
                            </button>


                            <button
                                type="button"
                                className="delete-confirm-btn"
                                disabled={deleting}
                                onClick={
                                    handleDelete
                                }
                            >

                                {deleting ? (

                                    <>
                                        <span className="button-spinner" />
                                        Deleting...
                                    </>

                                ) : (

                                    <>
                                        🗑 Delete Report
                                    </>

                                )}

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </section>

    );

}


export default ReportsPage;