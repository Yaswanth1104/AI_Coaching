function SettingsPage() {
    return (
        <section className="page-shell">
            <div className="page-shell-header">
                <span className="eyebrow">CONFIGURATION</span>
                <h1>Settings</h1>
                <p>
                    Review the application configuration and service status.
                </p>
            </div>

            <div className="settings-grid">
                <section className="settings-card">
                    <h2>AI Analysis</h2>
                    <p>
                        Conversation analysis is enabled for customer support
                        workflows.
                    </p>

                    <div className="settings-row">
                        <span>Analysis service</span>
                        <span className="settings-pill">Enabled</span>
                    </div>
                </section>

                <section className="settings-card">
                    <h2>Knowledge Retrieval</h2>
                    <p>
                        Relevant support knowledge can be retrieved during
                        conversation analysis.
                    </p>

                    <div className="settings-row">
                        <span>Knowledge service</span>
                        <span className="settings-pill">Ready</span>
                    </div>
                </section>

                <section className="settings-card">
                    <h2>Conversation Storage</h2>
                    <p>
                        Conversation history is available through the Reports
                        section.
                    </p>

                    <div className="settings-row">
                        <span>History</span>
                        <span className="settings-pill">Available</span>
                    </div>
                </section>

                <section className="settings-card">
                    <h2>Application</h2>
                    <p>
                        AI Coach support workspace for customer service
                        analysis and quality monitoring.
                    </p>

                    <div className="settings-row">
                        <span>Environment</span>
                        <span className="settings-pill">Local</span>
                    </div>
                </section>
            </div>
        </section>
    );
}

export default SettingsPage;
