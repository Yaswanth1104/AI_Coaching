import { useState } from "react";

import Sidebar from "../components/Sidebar";
import DashboardHome from "./DashboardHome";
import AnalyticsPage from "./AnalyticsPage";
import ReportsPage from "./ReportsPage";
import KnowledgePage from "./KnowledgePage";
import SettingsPage from "./SettingsPage";
import ProfilePage from "./ProfilePage";

import "./Dashboard.css";


/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard() {

    const [activePage, setActivePage] =
        useState("dashboard");

    const [sessionKey, setSessionKey] =
        useState(0);


    /* =====================================================
       PAGE CHANGE
    ===================================================== */

    const handlePageChange = (page) => {

        /* ---------------------------------------------
           NEW SESSION
        --------------------------------------------- */

        if (page === "new-session") {

            localStorage.removeItem(
                "support_session_id"
            );

            setSessionKey(
                (previous) => previous + 1
            );

            setActivePage(
                "dashboard"
            );

            return;
        }


        /* ---------------------------------------------
           NORMAL PAGE CHANGE
        --------------------------------------------- */

        setActivePage(page);

    };


    /* =====================================================
       RENDER ACTIVE PAGE
    ===================================================== */

    const renderPage = () => {

        switch (activePage) {

            /* -----------------------------------------
               DASHBOARD
            ----------------------------------------- */

            case "dashboard":

                return (
                    <DashboardHome
                        key={sessionKey}
                    />
                );


            /* -----------------------------------------
               ANALYTICS
            ----------------------------------------- */

            case "analytics":

                return (
                    <AnalyticsPage />
                );


            /* -----------------------------------------
               REPORTS
            ----------------------------------------- */

            case "reports":

                return (
                    <ReportsPage />
                );


            /* -----------------------------------------
               KNOWLEDGE BASE
            ----------------------------------------- */

            case "knowledge":

                return (
                    <KnowledgePage />
                );


            /* -----------------------------------------
               SETTINGS
            ----------------------------------------- */

            case "settings":

                return (
                    <SettingsPage />
                );


            /* -----------------------------------------
               PROFILE
            ----------------------------------------- */

            case "profile":

                return (
                    <ProfilePage />
                );


            /* -----------------------------------------
               DEFAULT
            ----------------------------------------- */

            default:

                return (
                    <DashboardHome
                        key={sessionKey}
                    />
                );
        }

    };


    /* =====================================================
       UI
    ===================================================== */

    return (

        <div className="app-shell">


            {/* =================================================
                SIDEBAR
            ================================================= */}

            <Sidebar
                activePage={activePage}
                setActivePage={handlePageChange}
            />


            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <main className="main-content">

                <div className="dashboard-page">

                    {renderPage()}

                </div>

            </main>


        </div>

    );

}


export default Dashboard;