export default function SupervisorCard({ supervisor }) {
    if (!supervisor) {
        return null;
    }

    const readyToSend = Boolean(supervisor.ready_to_send);
    const escalationRequired = Boolean(supervisor.escalation_required);
    const missingInformation = supervisor.missing_information || [];

    return (
        <div className="supervisor-card">
            <div className="supervisor-header">
                <div>
                    <span className="supervisor-kicker">
                        SUPERVISOR REVIEW
                    </span>

                    <h2>
                        Supervisor Review
                    </h2>
                </div>

                <span
                    className={
                        readyToSend
                            ? "supervisor-status supervisor-status-ready"
                            : "supervisor-status supervisor-status-blocked"
                    }
                >
                    {readyToSend ? "Ready" : "Needs Review"}
                </span>
            </div>

            <div className="supervisor-grid">
                <div className="supervisor-metric">
                    <span>
                        Ready to Send
                    </span>

                    <strong className={readyToSend ? "text-success" : "text-danger"}>
                        {readyToSend ? "Yes" : "No"}
                    </strong>
                </div>

                <div className="supervisor-metric">
                    <span>
                        Escalation
                    </span>

                    <strong className={escalationRequired ? "text-danger" : "text-success"}>
                        {escalationRequired ? "Required" : "Not Required"}
                    </strong>
                </div>

                <div className="supervisor-metric">
                    <span>
                        Priority
                    </span>

                    <strong>
                        {supervisor.priority}
                    </strong>
                </div>
            </div>

            <div className="supervisor-section">
                <h3>
                    Summary
                </h3>

                <p>
                    {supervisor.summary}
                </p>
            </div>

            <div className="supervisor-section">
                <h3>
                    Missing Information
                </h3>

                {missingInformation.length === 0 ? (
                    <p className="supervisor-empty">
                        No missing information.
                    </p>
                ) : (
                    <ul className="supervisor-list">
                        {missingInformation.map((item, index) => (
                            <li key={index}>
                                {item}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}