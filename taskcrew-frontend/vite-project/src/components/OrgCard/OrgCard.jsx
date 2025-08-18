import React from "react";
import "./OrgCard.css";


export default function OrgCard({
    orgName,
    domain = "",
    planType = "Free",
    ownerName,
    onOpen,
    onManage,
}) {
    return (
        <article className="oc-card" role="group" aria-label={`Organization ${orgName}`}>
            <header className="oc-head">
                <div className="oc-brand">
                    <h3 className="oc-title">{orgName}</h3>
                </div>

                <span className={`oc-plan oc-${planType.toLowerCase()}`}>{planType}</span>
            </header>

            {domain && (
                <div className="oc-row">
                    <span className="oc-label">Domain</span>
                    <span className="oc-value">{domain}</span>
                </div>
            )}


            {ownerName && (
                <div className="oc-row">
                    <span className="oc-label">Owner</span>
                    <span className="oc-value">{ownerName}</span>
                </div>
            )}


            <footer className="oc-actions">
                <button className="oc-btn oc-primary" type="button" onClick={onOpen}>
                    Open
                </button>
                <button className="oc-btn oc-ghost" type="button" onClick={onManage}>
                    Manage
                </button>
            </footer>
        </article>
    );
}
