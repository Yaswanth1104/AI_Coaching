import "./Sidebar.css";

import {
    LayoutDashboard,
    Plus,
    Database,
    BarChart3,
    FileText,
    Settings,
    Bot,
    UserCircle,
} from "lucide-react";


/* =========================================================
   SIDEBAR NAVIGATION
========================================================= */

const navigation = [
    {
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
    },

    {
        id: "new-session",
        label: "New Session",
        icon: Plus,
    },

    {
        id: "knowledge",
        label: "Knowledge Base",
        icon: Database,
    },

    {
        id: "reports",
        label: "Reports",
        icon: FileText,
    },

    {
        id: "analytics",
        label: "Analytics",
        icon: BarChart3,
    },

    {
        id: "settings",
        label: "Settings",
        icon: Settings,
    },

    {
        id: "profile",
        label: "Profile",
        icon: UserCircle,
    },
];


/* =========================================================
   SIDEBAR
========================================================= */

function Sidebar({
    activePage,
    setActivePage,
}) {

    return (

        <aside className="sidebar">

            {/* =================================================
                BRAND
            ================================================= */}

            <div className="sidebar-brand">

                <div className="brand-icon">

                    <Bot
                        size={22}
                        strokeWidth={2}
                    />

                </div>


                <div className="brand-copy">

                    <strong>
                        AI Coach
                    </strong>

                    <span>
                        Support Intelligence
                    </span>

                </div>

            </div>


            {/* =================================================
                NAVIGATION
            ================================================= */}

            <nav
                className="sidebar-nav"
                aria-label="Main navigation"
            >

                <div className="nav-section-label">
                    WORKSPACE
                </div>


                {navigation.map(
                    ({
                        id,
                        label,
                        icon: Icon,
                    }) => (

                        <button
                            key={id}
                            type="button"
                            className={`nav-item ${
                                activePage === id
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                setActivePage(id)
                            }
                        >

                            <Icon
                                size={18}
                                strokeWidth={2}
                            />

                            <span>
                                {label}
                            </span>

                        </button>

                    )
                )}

            </nav>


            {/* =================================================
                FOOTER
            ================================================= */}

            <div className="sidebar-footer">

                <div className="system-status">

                    <span className="system-status-dot" />

                    <div>

                        <strong>
                            AI services
                        </strong>

                        <span>
                            Ready
                        </span>

                    </div>

                </div>

            </div>

        </aside>

    );
}


export default Sidebar;