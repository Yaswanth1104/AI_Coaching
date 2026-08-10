export default function Card({ title, children }) {
    return (
        <section className="ai-card">
            <div className="ai-card-header">
                <h2>{title}</h2>
            </div>
            <div className="ai-card-body">{children}</div>
        </section>
    );
}
