import { useMemo, useState } from "react";
import {
    BookOpen,
    Network,
    CreditCard,
    ShieldCheck,
    Headphones,
    Settings,
    Search,
    Plus,
    Pencil,
    Trash2,
    X,
    Save,
} from "lucide-react";

import "./KnowledgePage.css";


/* =========================================================
   DEFAULT KNOWLEDGE
========================================================= */

const DEFAULT_KNOWLEDGE = [
    {
        id: 1,
        title: "Internet Connectivity Issues",
        category: "Network",
        description:
            "Troubleshooting steps for internet connectivity problems, including checking router status, cables, WAN connection, and network availability.",
        updated: "Today",
    },
    {
        id: 2,
        title: "Router Troubleshooting",
        category: "Network",
        description:
            "Steps for diagnosing router issues, including restarting the router, checking indicator lights, verifying cables, and checking WAN connectivity.",
        updated: "Today",
    },
    {
        id: 3,
        title: "Billing & Payment Support",
        category: "Billing",
        description:
            "Guidelines for handling billing questions, payment failures, incorrect charges, invoices, and payment-related customer concerns.",
        updated: "Yesterday",
    },
    {
        id: 4,
        title: "Password Reset Guide",
        category: "Account",
        description:
            "Instructions for helping customers reset their account password and recover access securely.",
        updated: "Yesterday",
    },
    {
        id: 5,
        title: "Network Configuration",
        category: "Network",
        description:
            "Guidelines for basic network configuration, connection settings, DNS configuration, and troubleshooting network access.",
        updated: "2 days ago",
    },
    {
        id: 6,
        title: "General Customer Support Policies",
        category: "Support",
        description:
            "General customer support policies covering communication, escalation, customer assistance, and support procedures.",
        updated: "3 days ago",
    },
];


/* =========================================================
   CATEGORY ICON
========================================================= */

const getCategoryIcon = (category) => {
    switch (category) {
        case "Network":
            return Network;

        case "Billing":
            return CreditCard;

        case "Account":
            return ShieldCheck;

        case "Support":
            return Headphones;

        default:
            return BookOpen;
    }
};


/* =========================================================
   KNOWLEDGE PAGE
========================================================= */

function KnowledgePage() {

    /* -------------------------------------------------------
       KNOWLEDGE DATA
    ------------------------------------------------------- */

    const [knowledgeItems, setKnowledgeItems] = useState(() => {

        const saved =
            localStorage.getItem(
                "ai_coach_knowledge"
            );

        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (error) {
                console.error(
                    "Unable to load knowledge:",
                    error
                );
            }
        }

        return DEFAULT_KNOWLEDGE;
    });


    /* -------------------------------------------------------
       SEARCH
    ------------------------------------------------------- */

    const [searchTerm, setSearchTerm] =
        useState("");


    /* -------------------------------------------------------
       CATEGORY FILTER
    ------------------------------------------------------- */

    const [activeFilter, setActiveFilter] =
        useState("All");


    /* -------------------------------------------------------
       MODAL
    ------------------------------------------------------- */

    const [modalOpen, setModalOpen] =
        useState(false);


    /* -------------------------------------------------------
       EDITING
    ------------------------------------------------------- */

    const [editingId, setEditingId] =
        useState(null);


    /* -------------------------------------------------------
       FORM
    ------------------------------------------------------- */

    const [formData, setFormData] =
        useState({
            title: "",
            category: "Network",
            description: "",
        });


    /* =========================================================
       SAVE KNOWLEDGE TO LOCAL STORAGE
    ========================================================= */

    const saveKnowledge = (items) => {

        setKnowledgeItems(items);

        localStorage.setItem(
            "ai_coach_knowledge",
            JSON.stringify(items)
        );
    };


    /* =========================================================
       OPEN ADD MODAL
    ========================================================= */

    const handleAddKnowledge = () => {

        setEditingId(null);

        setFormData({
            title: "",
            category: "Network",
            description: "",
        });

        setModalOpen(true);
    };


    /* =========================================================
       OPEN EDIT MODAL
    ========================================================= */

    const handleEdit = (item) => {

        setEditingId(item.id);

        setFormData({
            title: item.title,
            category: item.category,
            description: item.description,
        });

        setModalOpen(true);
    };


    /* =========================================================
       CLOSE MODAL
    ========================================================= */

    const handleCloseModal = () => {

        setModalOpen(false);

        setEditingId(null);

        setFormData({
            title: "",
            category: "Network",
            description: "",
        });
    };


    /* =========================================================
       FORM CHANGE
    ========================================================= */

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


    /* =========================================================
       SAVE / UPDATE KNOWLEDGE
    ========================================================= */

    const handleSubmit = (event) => {

        event.preventDefault();

        const title =
            formData.title.trim();

        const description =
            formData.description.trim();

        if (!title || !description) {
            return;
        }


        /* -----------------------------------------------------
           UPDATE EXISTING
        ----------------------------------------------------- */

        if (editingId !== null) {

            const updatedItems =
                knowledgeItems.map(
                    (item) => {

                        if (
                            item.id ===
                            editingId
                        ) {
                            return {
                                ...item,
                                title,
                                category:
                                    formData.category,
                                description,
                                updated:
                                    "Just now",
                            };
                        }

                        return item;
                    }
                );

            saveKnowledge(updatedItems);

            handleCloseModal();

            return;
        }


        /* -----------------------------------------------------
           CREATE NEW
        ----------------------------------------------------- */

        const newItem = {
            id:
                Date.now(),

            title,

            category:
                formData.category,

            description,

            updated:
                "Just now",
        };


        const updatedItems = [
            newItem,
            ...knowledgeItems,
        ];


        saveKnowledge(
            updatedItems
        );

        handleCloseModal();
    };


    /* =========================================================
       DELETE KNOWLEDGE
    ========================================================= */

    const handleDelete = (id) => {

        const item =
            knowledgeItems.find(
                (knowledge) =>
                    knowledge.id === id
            );

        if (!item) {
            return;
        }


        const confirmed =
            window.confirm(
                `Delete "${item.title}"?`
            );


        if (!confirmed) {
            return;
        }


        const updatedItems =
            knowledgeItems.filter(
                (knowledge) =>
                    knowledge.id !== id
            );


        saveKnowledge(
            updatedItems
        );
    };


    /* =========================================================
       FILTERED KNOWLEDGE
    ========================================================= */

    const filteredItems =
        useMemo(() => {

            const search =
                searchTerm
                    .trim()
                    .toLowerCase();


            return knowledgeItems.filter(
                (item) => {

                    const matchesCategory =
                        activeFilter ===
                        "All" ||
                        item.category ===
                            activeFilter;


                    const matchesSearch =
                        !search ||
                        item.title
                            .toLowerCase()
                            .includes(search) ||
                        item.description
                            .toLowerCase()
                            .includes(search) ||
                        item.category
                            .toLowerCase()
                            .includes(search);


                    return (
                        matchesCategory &&
                        matchesSearch
                    );
                }
            );

        }, [
            knowledgeItems,
            searchTerm,
            activeFilter,
        ]);


    /* =========================================================
       STATISTICS
    ========================================================= */

    const totalResources =
        knowledgeItems.length;

    const networkCount =
        knowledgeItems.filter(
            (item) =>
                item.category ===
                "Network"
        ).length;

    const supportCount =
        knowledgeItems.filter(
            (item) =>
                item.category ===
                "Support"
        ).length;


    /* =========================================================
       FILTERS
    ========================================================= */

    const filters = [
        "All",
        "Network",
        "Billing",
        "Account",
        "Support",
    ];


    /* =========================================================
       UI
    ========================================================= */

    return (

        <section className="knowledge-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <header className="knowledge-header">

                <div>

                    <div className="page-eyebrow">

                        <span className="status-dot" />

                        KNOWLEDGE MANAGEMENT

                    </div>


                    <h1>
                        Knowledge Base
                    </h1>


                    <p>
                        Manage the support knowledge
                        used by the AI intelligence
                        pipeline during conversations.
                    </p>

                </div>


                <button
                    type="button"
                    className="add-knowledge-btn"
                    onClick={
                        handleAddKnowledge
                    }
                >

                    <Plus
                        size={17}
                        strokeWidth={2}
                    />

                    Add Knowledge

                </button>

            </header>


            {/* =================================================
                STATISTICS
            ================================================= */}

            <section className="knowledge-stats">

                {/* Total */}

                <div className="knowledge-stat-card">

                    <div className="stat-icon">

                        <BookOpen
                            size={21}
                        />

                    </div>

                    <div>

                        <span>
                            Total Resources
                        </span>

                        <strong>
                            {totalResources}
                        </strong>

                    </div>

                </div>


                {/* Network */}

                <div className="knowledge-stat-card">

                    <div className="stat-icon">

                        <Network
                            size={21}
                        />

                    </div>

                    <div>

                        <span>
                            Network
                        </span>

                        <strong>
                            {networkCount}
                        </strong>

                    </div>

                </div>


                {/* Support */}

                <div className="knowledge-stat-card">

                    <div className="stat-icon">

                        <Headphones
                            size={21}
                        />

                    </div>

                    <div>

                        <span>
                            Support
                        </span>

                        <strong>
                            {supportCount}
                        </strong>

                    </div>

                </div>

            </section>


            {/* =================================================
                SEARCH + FILTER
            ================================================= */}

            <section className="knowledge-toolbar">

                {/* Search */}

                <div className="knowledge-search">

                    <Search
                        size={17}
                        strokeWidth={2}
                    />

                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(event) =>
                            setSearchTerm(
                                event.target.value
                            )
                        }
                        placeholder="Search knowledge..."
                    />


                    {searchTerm && (

                        <button
                            type="button"
                            className="clear-search"
                            onClick={() =>
                                setSearchTerm("")
                            }
                            aria-label="Clear search"
                        >

                            <X size={15} />

                        </button>

                    )}

                </div>


                {/* Filters */}

                <div className="knowledge-filters">

                    {filters.map(
                        (filter) => (

                            <button
                                key={filter}
                                type="button"
                                className={
                                    `filter-btn ${
                                        activeFilter ===
                                        filter
                                            ? "active"
                                            : ""
                                    }`
                                }
                                onClick={() =>
                                    setActiveFilter(
                                        filter
                                    )
                                }
                            >
                                {filter}
                            </button>

                        )
                    )}

                </div>

            </section>


            {/* =================================================
                SECTION HEADING
            ================================================= */}

            <div className="knowledge-section-heading">

                <div>

                    <span>
                        KNOWLEDGE RESOURCES
                    </span>

                    <h2>
                        Support Documentation
                    </h2>

                </div>


                <strong>
                    {filteredItems.length} resources
                </strong>

            </div>


            {/* =================================================
                KNOWLEDGE CARDS
            ================================================= */}

            {filteredItems.length > 0 ? (

                <div className="knowledge-grid">

                    {filteredItems.map(
                        (item) => {

                            const Icon =
                                getCategoryIcon(
                                    item.category
                                );


                            return (

                                <article
                                    key={item.id}
                                    className="knowledge-card"
                                >

                                    {/* Card Top */}

                                    <div className="knowledge-card-top">

                                        <div className="knowledge-icon">

                                            <Icon
                                                size={20}
                                                strokeWidth={2}
                                            />

                                        </div>


                                        <span className="category-badge">
                                            {item.category}
                                        </span>

                                    </div>


                                    {/* Content */}

                                    <div className="knowledge-card-content">

                                        <h3>
                                            {item.title}
                                        </h3>

                                        <p>
                                            {item.description}
                                        </p>

                                    </div>


                                    {/* Footer */}

                                    <div className="knowledge-card-footer">

                                        <span>
                                            Updated{" "}
                                            {item.updated}
                                        </span>


                                        <div className="knowledge-actions">

                                            <button
                                                type="button"
                                                className="edit-btn"
                                                onClick={() =>
                                                    handleEdit(
                                                        item
                                                    )
                                                }
                                            >

                                                <Pencil
                                                    size={13}
                                                />

                                                Edit

                                            </button>


                                            <button
                                                type="button"
                                                className="delete-btn"
                                                onClick={() =>
                                                    handleDelete(
                                                        item.id
                                                    )
                                                }
                                            >

                                                <Trash2
                                                    size={13}
                                                />

                                                Delete

                                            </button>

                                        </div>

                                    </div>

                                </article>

                            );

                        }
                    )}

                </div>

            ) : (

                /* =================================================
                   EMPTY STATE
                ================================================= */

                <div className="knowledge-empty">

                    <Search
                        size={32}
                        strokeWidth={1.5}
                    />

                    <h3>
                        No knowledge found
                    </h3>

                    <p>
                        Try a different search term
                        or category.
                    </p>

                </div>

            )}


            {/* =================================================
                AI RETRIEVAL INFO
            ================================================= */}

            <div className="retrieval-info">

                <div className="retrieval-icon">

                    <BookOpen
                        size={19}
                    />

                </div>


                <div>

                    <strong>
                        AI Retrieval Ready
                    </strong>

                    <p>
                        Relevant knowledge resources
                        are retrieved automatically
                        when a customer conversation
                        is analyzed.
                    </p>

                </div>

            </div>


            {/* =================================================
                ADD / EDIT MODAL
            ================================================= */}

            {modalOpen && (

                <div
                    className="knowledge-modal-overlay"
                    onMouseDown={(event) => {

                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            handleCloseModal();
                        }

                    }}
                >

                    <div className="knowledge-modal">

                        {/* Modal Header */}

                        <div className="knowledge-modal-header">

                            <div>

                                <span>
                                    KNOWLEDGE MANAGEMENT
                                </span>

                                <h2>
                                    {editingId !== null
                                        ? "Edit Knowledge"
                                        : "Add Knowledge"}
                                </h2>

                            </div>


                            <button
                                type="button"
                                className="modal-close-btn"
                                onClick={
                                    handleCloseModal
                                }
                                aria-label="Close"
                            >

                                <X size={18} />

                            </button>

                        </div>


                        {/* Form */}

                        <form
                            onSubmit={
                                handleSubmit
                            }
                        >

                            {/* Title */}

                            <div className="form-group">

                                <label htmlFor="knowledge-title">
                                    Knowledge Title
                                </label>

                                <input
                                    id="knowledge-title"
                                    name="title"
                                    type="text"
                                    value={
                                        formData.title
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter knowledge title"
                                    required
                                />

                            </div>


                            {/* Category */}

                            <div className="form-group">

                                <label htmlFor="knowledge-category">
                                    Category
                                </label>

                                <select
                                    id="knowledge-category"
                                    name="category"
                                    value={
                                        formData.category
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >

                                    <option value="Network">
                                        Network
                                    </option>

                                    <option value="Billing">
                                        Billing
                                    </option>

                                    <option value="Account">
                                        Account
                                    </option>

                                    <option value="Support">
                                        Support
                                    </option>

                                </select>

                            </div>


                            {/* Description */}

                            <div className="form-group">

                                <label htmlFor="knowledge-description">
                                    Description
                                </label>

                                <textarea
                                    id="knowledge-description"
                                    name="description"
                                    value={
                                        formData.description
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter troubleshooting steps, support guidelines, or other useful information..."
                                    required
                                />

                            </div>


                            {/* Actions */}

                            <div className="modal-actions">

                                <button
                                    type="button"
                                    className="modal-cancel-btn"
                                    onClick={
                                        handleCloseModal
                                    }
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="modal-save-btn"
                                >

                                    <Save
                                        size={15}
                                    />

                                    {editingId !== null
                                        ? "Save Changes"
                                        : "Add Knowledge"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </section>
    );
}


export default KnowledgePage;