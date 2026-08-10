export default function KnowledgeCard({ knowledge }) {

    if (!knowledge) {
        return null;
    }


    const troubleshooting =
        knowledge.troubleshooting || [];

    const sources =
        knowledge.sources || [];

    const distances =
        knowledge.distances || [];


    /* =====================================================
       BEST RETRIEVAL DISTANCE
    ===================================================== */

    const bestDistance =
        distances.length > 0
            ? Math.min(...distances)
            : null;


    /* =====================================================
       RELEVANCE
    ===================================================== */

    const getRelevance = () => {

        if (bestDistance === null) {
            return "Unknown";
        }

        if (bestDistance <= 0.5) {
            return "Highly Relevant";
        }

        if (bestDistance <= 0.8) {
            return "Relevant";
        }

        return "Low Relevance";
    };


    const relevance =
        getRelevance();


    /* =====================================================
       RELEVANCE CLASS
    ===================================================== */

    const getRelevanceClass = () => {

        if (relevance === "Highly Relevant") {
            return "high";
        }

        if (relevance === "Relevant") {
            return "medium";
        }

        if (relevance === "Low Relevance") {
            return "low";
        }

        return "unknown";
    };


    return (

        <div className="knowledge-card">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="knowledge-header">

                <div>

                    <span className="knowledge-kicker">
                        RAG RETRIEVAL
                    </span>

                    <h2>
                        Knowledge Intelligence
                    </h2>

                </div>


                <span
                    className={
                        `knowledge-relevance ${getRelevanceClass()}`
                    }
                >

                    <span className="relevance-dot" />

                    {relevance}

                </span>

            </div>


            {/* =================================================
                TOPIC
            ================================================= */}

            <div className="knowledge-topic-box">

                <span className="knowledge-label">
                    Detected Topic
                </span>

                <strong>
                    {knowledge.topic ||
                        "General Support"}
                </strong>

            </div>


            {/* =================================================
                RECOMMENDATIONS
            ================================================= */}

            <div className="knowledge-section">

                <div className="knowledge-section-header">

                    <span className="knowledge-label">
                        Recommended Knowledge
                    </span>

                    {troubleshooting.length > 0 && (

                        <span className="knowledge-count">
                            {troubleshooting.length}
                            {" "}
                            {troubleshooting.length === 1
                                ? "result"
                                : "results"}
                        </span>

                    )}

                </div>


                {troubleshooting.length > 0 ? (

                    <div className="knowledge-results">

                        {troubleshooting.map(
                            (item, index) => (

                                <div
                                    className="knowledge-result"
                                    key={index}
                                >

                                    <span className="knowledge-number">
                                        {String(
                                            index + 1
                                        ).padStart(2, "0")}
                                    </span>


                                    <p>
                                        {item}
                                    </p>


                                    <span className="knowledge-arrow">
                                        →
                                    </span>

                                </div>

                            )
                        )}

                    </div>

                ) : (

                    <div className="knowledge-empty">

                        No relevant knowledge was
                        retrieved for this conversation.

                    </div>

                )}

            </div>


            {/* =================================================
                SOURCES
            ================================================= */}

            {sources.length > 0 && (

                <div className="knowledge-section">

                    <span className="knowledge-label">
                        Source Documents
                    </span>


                    <div className="knowledge-sources">

                        {sources.map(
                            (source, index) => (

                                <span
                                    className="knowledge-source-badge"
                                    key={index}
                                    title={source}
                                >

                                    ◈ {source}

                                </span>

                            )
                        )}

                    </div>

                </div>

            )}


            {/* =================================================
                RETRIEVAL METRIC
            ================================================= */}

            {bestDistance !== null && (

                <div className="knowledge-retrieval">

                    <div>

                        <span>
                            Best Retrieval Match
                        </span>

                        <small>
                            ChromaDB distance
                        </small>

                    </div>


                    <strong>
                        {bestDistance.toFixed(3)}
                    </strong>

                </div>

            )}

        </div>

    );
}