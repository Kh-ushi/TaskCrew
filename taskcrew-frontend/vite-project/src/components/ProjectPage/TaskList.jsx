// TaskList.jsx
import React from "react";

// Example usage:


export default function TaskList({ tasks = [] }) {
  const prClass = (p) => `chip chip-${(p || "Low").toLowerCase()}`;

  return (
    <div className="task-list">
      {tasks.length === 0 && (
        <div className="task-list-empty">No tasks yet</div>
      )}

      {tasks.map((t) => (
        <div key={t.id} className="task-row">
          {/* left block: title + labels */}
          <div className="tl-main">
            <div className="tl-title">
              <span className="tl-text">{t.title}</span>
              <span className={prClass(t.priority)}>{t.priority || "Low"}</span>
              {t.status && <span className="tl-status">{t.status}</span>}
            </div>

            <div className="tl-dates">
              <span className="date">
                <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d="M7 2v2H5a2 2 0 0 0-2 2v2h18V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2H7Zm14 8H3v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V10Zm-9 3h2v2h-2v-2Z"/>
                </svg>
                <span>{t.startDate}</span>
              </span>
              <span className="date sep">→</span>
              <span className="date">
                <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d="M7 2v2H5a2 2 0 0 0-2 2v2h18V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2H7Zm14 8H3v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V10Zm-9 3h2v2h-2v-2Z"/>
                </svg>
                <span>{t.endDate}</span>
              </span>
            </div>
          </div>

          {/* right block: assignees + actions */}
          <div className="tl-right">
            <div className="avatars" title={(t.assignees || []).join(", ")}>
              {(t.assignees || []).slice(0, 3).map((i, idx) => (
                <span key={idx} className="avatar">{i}</span>
              ))}
              {(t.assignees || []).length > 3 && (
                <span className="avatar more">+{t.assignees.length - 3}</span>
              )}

              {/* assign */}
              <button className="icon-btn" title="Assign">
                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d="M12 12a5 5 0 1 0-5-5a5 5 0 0 0 5 5Zm-9 9a8.94 8.94 0 0 1 9-9a8.94 8.94 0 0 1 9 9Z"/>
                </svg>
              </button>
            </div>

            <div className="actions">
              {/* edit */}
              <button className="icon-btn" title="Edit">
                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d="m3 17.25V21h3.75L17.81 9.94l-3.75-3.75ZM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83l3.75 3.75Z"/>
                </svg>
              </button>
              {/* delete */}
              <button className="icon-btn danger" title="Delete">
                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d="M6 7h12l-1 14H7L6 7Zm3-3h6l1 2H8l1-2Z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
