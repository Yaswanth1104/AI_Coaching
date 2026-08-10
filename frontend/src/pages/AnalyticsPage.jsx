import AnalyticsCard from "../components/AnalyticsCard";

function AnalyticsPage() {
    return (
        <section className="page-shell">
            <div className="page-shell-header">
                <span className="eyebrow">PERFORMANCE</span>
                <h1>Analytics</h1>
                <p>
                    Monitor conversation volume, sentiment distribution, and
                    overall support quality.
                </p>
            </div>

            <AnalyticsCard />
        </section>
    );
}

export default AnalyticsPage;
