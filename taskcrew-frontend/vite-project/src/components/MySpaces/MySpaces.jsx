import React from "react";
import "./MySpaces.css";

function SpaceTile({ name, description, members = 0, onOpen }) {
  return (
    <button className="ms-tile" type="button" onClick={onOpen} aria-label={`Open space ${name}`}>
      <div className="ms-header">
        <div className="ms-badge" aria-hidden />
        <h3 className="ms-name">{name}</h3>
      </div>
      {description && <p className="ms-desc">{description}</p>}
      <div className="ms-meta">
        <span className="ms-chip">{members} member{members === 1 ? "" : "s"}</span>
      </div>
    </button>
  );
}

export default function MySpaces({
  spaces = [

    // { id: "sp1", name: "Acme Corp — Marketing", description: "Campaign briefs & assets", membersCount: 12 },
    // { id: "sp2", name: "Nimbus Health — Product", description: "Roadmap & sprints", membersCount: 9 },
    // { id: "sp3", name: "BluePeak Finance — Ops", description: "Compliance & reporting", membersCount: 7 },
    // // Private / personal spaces
    // { id: "sp4", name: "Khushi — Personal", description: "Notes & planning", membersCount: 1 },
    // { id: "sp5", name: "Freelance — Clients", description: "Proposals & invoices", membersCount: 3 },
  ],
  onOpenSpace = (s) => alert(`Open space: ${s.name}`),
  onCreateSpace = () => alert("Create new space"),
}) {
    
  const hasSpaces = Array.isArray(spaces) && spaces.length > 0;

  return (
    <section className="ms-wrap">
      <header className="ms-hero">
        <div>
          <h1 className="ms-title">My Spaces</h1>
          <p className="ms-subtitle">Client & private spaces you’re a member of.</p>
        </div>
        <div className="ms-actions">
          <button className="ms-btn ms-btn-primary" onClick={onCreateSpace}>
            Create New Space
          </button>
        </div>
      </header>

      {hasSpaces ? (
        <div className="ms-grid">
          {spaces.map((s) => (
            <SpaceTile
              key={s.id}
              name={s.name}
              description={s.description}
              members={s.membersCount ?? 0}
              onOpen={() => onOpenSpace(s)}
            />
          ))}
        </div>
      ) : (
        <div className="ms-empty" role="status" aria-live="polite">
          <div className="ms-empty-card">
            <div className="ms-empty-icon" aria-hidden>🗂️</div>
            <h2 className="ms-empty-title">No spaces yet</h2>
            <p className="ms-empty-text">
              You’re not part of any space in this organization.
            </p>
            <button className="ms-btn ms-btn-primary" onClick={onCreateSpace}>
              Create New Space
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

