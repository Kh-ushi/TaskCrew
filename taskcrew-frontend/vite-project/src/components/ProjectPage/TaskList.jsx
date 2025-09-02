import React from "react";
// import PropTypes from "prop-types";
import "./TaskList.css";
import dayjs from "dayjs";


/**
 * TaskList
 * Renders a compact list of tasks with title, priority, dates, assignees, and actions.
 *
 * Props:
 * - tasks: Array<{
 *     id: string|number,
 *     title: string,
 *     startDate?: string|Date,
 *     endDate?: string|Date,
 *     priority?: 'Low'|'Medium'|'High',
 *     assignees?: string[],   // e.g., ["KG","RS"] initials or short names
 *     status?: string
 * }>
 * - onAssign?: (task) => void
 * - onEdit?: (task) => void
 * - onDelete?: (task) => void
 * - onRowClick?: (task) => void
 */

export default function TaskList({
  tasks = [],
  onAssign,
  onEdit,
  onDelete,
  onRowClick,
  setToBeEdited
}) {
  const prClass = (p) => {
    const key = String(p || "Low").toLowerCase();
    return `chip chip-${key}`;
  };

  const formatDate = (d) => {
    if (!d) return "—";
    // Accept ISO string or Date
    const date = typeof d === "string" ? new Date(d) : d;
    if (Number.isNaN(date.getTime())) return "—";
    // Use user locale if available, fallback to en-GB for DD Mon YYYY
    const fmt = new Intl.DateTimeFormat(
      typeof navigator !== "undefined" ? navigator.language : "en-GB",
      { day: "2-digit", month: "short", year: "numeric" }
    );
    return fmt.format(date);
  };

  return (
    <div className="task-list" role="list" aria-label="Tasks">
      {tasks.length === 0 && (
        <div className="task-list-empty">No tasks yet</div>
      )}

      {tasks.map((t) => (
        <div
          key={t._id}
          className="task-row"
          role="listitem"
          onClick={() => onRowClick?.(t)}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onRowClick?.(t);
            }
          }}
        >
          {/* left block: title + labels */}
          <div className="tl-main">
            <div className="tl-title">
              <span className="tl-text" title={t.title}>
                {t.title}
              </span>

              {/* Priority chip */}
              <span className={prClass(t.priority)}>
                {t.priority || "Low"}
              </span>

              {/* Optional status tag */}
              {t.status && (
                <span className="tl-status" title={`Status: ${t.status}`}>
                  {t.status}
                </span>
              )}
            </div>

            {/* Dates */}
            <div className="tl-dates">
              <span className="date" title="Start date">
                <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M7 2v2H5a2 2 0 0 0-2 2v2h18V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2H7Zm14 8H3v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V10Zm-9 3h2v2h-2v-2Z"
                  />
                </svg>
                <span>{dayjs(t.startTime).format("DD MMM YYYY")}</span>
              </span>
              <span className="date sep" aria-hidden="true">→</span>
              <span className="date" title="End date">
                <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M7 2v2H5a2 2 0 0 0-2 2v2h18V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2H7Zm14 8H3v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V10Zm-9 3h2v2h-2v-2Z"
                  />
                </svg>
                <span>{dayjs(t.endTime).format("DD MMM YYYY")}</span>
              </span>
            </div>
          </div>

          {/* right block: assignees + actions */}
          <div className="tl-right" onClick={(e) => e.stopPropagation()}>
            <div
              className="avatars"
              title={(t.assignedTo || []).join(", ")}
              aria-label={`Assignees: ${(t.assignedTo || []).join(", ") || "None"}`}
            >
              {(t.assignedTo || []).slice(0, 3).map((i, idx) => (
                <span key={idx} className="avatar" aria-hidden="true">
                  {i}
                </span>
              ))}
              {(t.assignedTo || []).length > 3 && (
                <span className="avatar more" aria-label={`+${t.assignedTo.length - 3} more`}>
                  +{t.assignedTo.length - 3}
                </span>
              )}

              {/* Assign */}
              <button
                type="button"
                className="icon-btn"
                title="Assign"
                aria-label="Assign"
                onClick={() => onAssign?.(t)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M12 12a5 5 0 1 0-5-5a5 5 0 0 0 5 5Zm-9 9a8.94 8.94 0 0 1 9-9a8.94 8.94 0 0 1 9 9Z"
                  />
                </svg>
              </button>
            </div>

            <div className="actions">
              {/* edit */}
              <button
                type="button"
                className="icon-btn"
                title="Edit"
                aria-label="Edit"
                onClick={() => {onEdit?.(); setToBeEdited(t);}}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="m3 17.25V21h3.75L17.81 9.94l-3.75-3.75ZM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83l3.75 3.75Z"
                  />
                </svg>
              </button>
              {/* delete */}
              <button
                type="button"
                className="icon-btn danger"
                title="Delete"
                aria-label="Delete"
                onClick={() => onDelete?.(t._id)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M6 7h12l-1 14H7L6 7Zm3-3h6l1 2H8l1-2Z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}



