import React from "react";
import "./NotificationPopup.css";

export default function NotificationPopup({
  open,
  notifications = [],
  onClose,
  onMarkAllRead,
  onJoin,
  onDismiss,
  onToggleRead,
}) {
  if (!open) return null;

  console.log("Notifications:");
  console.log(notifications);

  return (
    <div className="np-overlay" onClick={onClose}>
      <div
        className="np-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Notifications"
      >
        <header className="np-head">
          <h3>Notifications</h3>
          <div className="np-head-actions">
            {notifications.some(n => !n.read) && (
              <button
                className="np-mark"
                type="button"
                onClick={onMarkAllRead}
                aria-label="Mark all as read"
              >
                Mark all as read
              </button>
            )}
            <button className="np-close" onClick={onClose} aria-label="Close">×</button>
          </div>
        </header>

        {notifications.length > 0 ? (
          <ul className="np-list">
            {notifications.map((n) => (
              <li key={n.id} className={`np-item ${n.read ? "" : "unread"}`}>
                <div className="np-left" onClick={() => onToggleRead?.(n.id)}>
                  {!n.read && <span className="np-dot" aria-hidden />}
                  <div className="np-text">{n.title}</div>
                  <div className="np-meta">{n.time}</div>
                </div>

                <div className="np-actions">
                 {n?.isJoin && ( <button
                    className="np-btn np-join"
                    type="button"
                    onClick={() => {onJoin?.(n)}}
                    aria-label="Join"
                  >
                    Join
                  </button>)}
                  <button
                    className="np-icon"
                    type="button"
                    onClick={() => onDismiss?.(n.id)}
                    aria-label="Dismiss notification"
                    title="Dismiss"
                  >
                    ×
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="np-empty">
            <span>📭</span>
            <p>No new notifications</p>
          </div>
        )}
      </div>
    </div>
  );
}
