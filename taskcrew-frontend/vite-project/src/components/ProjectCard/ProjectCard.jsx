import React from "react";
import "./ProjectCard.css";

function Avatar({ name }) {
  const initials = name
    .split(" ")
    .map((n) => n[0]?.toUpperCase())
    .slice(0, 2)
    .join("");
  return <div className="pc-avatar" title={name}>{initials}</div>;
}

export default function ProjectCard({
  name,
  description,
  members = [],
  status = "In Progress",
  startDate,
  endDate,
  onEdit,
  onDelete,
}) {
  return (
    <article className="pc-card" role="group" aria-label={`Project ${name}`}>
      {/* Status + actions */}
      <header className="pc-head">
        <span className={`pc-status pc-${status.toLowerCase().replace(/\s/g, "")}`}>
          {status}
        </span>

        <div className="pc-actions">
          <button
            className="pc-icon"
            aria-label="Edit project"
            onClick={onEdit}
            type="button"
            title="Edit"
          >
            {/* pencil */}
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Zm2.92 2.83H5v-.92l8.06-8.06.92.92L5.92 20.08ZM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83Z"/>
            </svg>
          </button>
          <button
            className="pc-icon pc-danger"
            aria-label="Delete project"
            onClick={onDelete}
            type="button"
            title="Delete"
          >
            {/* trash */}
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="currentColor" d="M9 3h6a1 1 0 0 1 1 1v1h4v2H4V5h4V4a1 1 0 0 1 1-1Zm1 4h4v12a2 2 0 0 1-2 2h0a2 2 0 0 1-2-2V7Z"/>
            </svg>
          </button>
        </div>
      </header>

      <h3 className="pc-title">{name}</h3>
      <p className="pc-desc">{description}</p>

      {/* Dates */}
      <div className="pc-dates">
        <div className="pc-date">
          <span className="pc-label">Start</span>
          <span className="pc-val">{startDate}</span>
        </div>
        <div className="pc-date">
          <span className="pc-label">End</span>
          <span className="pc-val">{endDate}</span>
        </div>
      </div>

      {/* Members */}
      <div className="pc-footer">
        <div className="pc-avatars">
          {members.slice(0, 4).map((m, i) => (
            <Avatar key={i} name={m} />
          ))}
          {members.length > 4 && (
            <div className="pc-avatar pc-more">+{members.length - 4}</div>
          )}
        </div>
      </div>
    </article>
  );
}
