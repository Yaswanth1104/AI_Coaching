function ScoreMetric({ title, value }) {
    const score = Number(value) || 0;

    return (
        <div className="quality-metric">
            <div className="quality-metric-header">
                <span>
                    {title}
                </span>

                <strong>
                    {score}%
                </strong>
            </div>

            <div className="quality-track">
                <div
                    className="quality-fill"
                    style={{
                        width: `${Math.min(Math.max(score, 0), 100)}%`,
                    }}
                />
            </div>
        </div>
    );
}

export default function QualityEvaluationCard({ quality }) {
    if (!quality) {
        return null;
    }

    const overallScore = Number(quality.overall_score) || 0;

    return (
        <div className="quality-card">
            <div className="quality-header">
                <div>
                    <span className="quality-kicker">
                        AI EVALUATION
                    </span>

                    <h2>
                        Quality Evaluation
                    </h2>
                </div>

                <div className="quality-score">
                    <strong>
                        {overallScore}%
                    </strong>

                    <span>
                        Overall
                    </span>
                </div>
            </div>

            <div className="quality-metrics">
                <ScoreMetric
                    title="Professionalism"
                    value={quality.professionalism}
                />

                <ScoreMetric
                    title="Empathy"
                    value={quality.empathy}
                />

                <ScoreMetric
                    title="Grammar"
                    value={quality.grammar}
                />

                <ScoreMetric
                    title="Policy Compliance"
                    value={quality.policy_compliance}
                />
            </div>

            <div className="quality-feedback">
                <div className="quality-feedback-header">
                    <span className="feedback-icon">
                        ✦
                    </span>

                    <span>
                        AI Feedback
                    </span>
                </div>

                <p>
                    {quality.feedback || "No feedback available."}
                </p>
            </div>
        </div>
    );
}