export default function EscalationCard({ escalation }) {
    if (!escalation) {
        return null;
    }

    const riskLevel = escalation.risk_level || "Low";
    const needsEscalation = Boolean(escalation.needs_escalation);
    const priority = escalation.priority || "Low";

    const normalizedRisk = riskLevel.toLowerCase();

    const riskClass =
        normalizedRisk === "high"
            ? "risk-high"
            : normalizedRisk === "medium"
                ? "risk-medium"
                : "risk-low";

    return (
        <div className="escalation-card">
            <div className="escalation-header">
                <div>
                    <span className="escalation-kicker">
                        ESCALATION RISK
                    </span>

                    <h2>
                        Escalation Risk
                    </h2>
                </div>

                <span className={`escalation-badge ${riskClass}`}>
                    {riskLevel}
                </span>
            </div>

            <div className="escalation-grid">
                <div className="escalation-metric">
                    <span>
                        Risk Level
                    </span>

                    <strong className={riskClass}>
                        {riskLevel}
                    </strong>
                </div>

                <div className="escalation-metric">
                    <span>
                        Needs Escalation
                    </span>

                    <strong className={needsEscalation ? "text-danger" : "text-success"}>
                        {needsEscalation ? "Yes" : "No"}
                    </strong>
                </div>

                <div className="escalation-metric">
                    <span>
                        Priority
                    </span>

                    <strong>
                        {priority}
                    </strong>
                </div>
            </div>

            <div className="escalation-reason">
                <h3>
                    Reason
                </h3>

                <p>
                    {escalation.reason || "No escalation risk detected."}
                </p>
            </div>
        </div>
    );
}