import React from "react";
import "./MySpaces.css";
import { Trash2 ,UserRoundPlus} from "lucide-react";

function SpaceTile({ name, description, members = 0, onOpen, onAddMember, onDelete }) {
  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete();
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddMember();
  };

  return (
    <button className="ms-tile" type="button" onClick={onOpen} aria-label={`Open space ${name}`}>
      <div className="ms-header">
        <div className="ms-badge" aria-hidden />
        <h3 className="ms-name">{name}</h3>
      </div>
      {description && <p className="ms-desc">{description}</p>}
      <div className="ms-meta">
        <span className="ms-chip">{members} member{members === 1 ? "" : "s"}</span>
        <div className="ms-icon">
        <UserRoundPlus className="ms-users" onClick={handleAddMember} />
        <Trash2 className="ms-trash" onClick={handleDelete} />
        </div>
      </div>
    </button>
  );
}

export default function MySpaces({
  spaces = [],
  onOpenSpace = (s) => alert(`Open space: ${s.name}`),
  onCreateSpace = () => alert("Create new space"),
  onDeleteSpace = () => alert("Delete space"),
  onAddMember = () => alert("Add member"),
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
              key={s._id}
              name={s.name}
              description={s.description}
              members={s.membersCount ?? 0}
              onOpen={() => onOpenSpace(s)}
              onAddMember={() => onAddMember(s._id)}
              onDelete={() => onDeleteSpace(s._id)}
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

