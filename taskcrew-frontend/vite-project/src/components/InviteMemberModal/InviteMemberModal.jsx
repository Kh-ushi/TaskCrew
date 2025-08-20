import React, { useEffect, useRef, useState } from "react";
import "./InviteMemberModal.css";

/**
 * Props:
 * - open: boolean
 * - onClose: () => void
 * - onSubmit: (payload) => void
 * - orgName?: string   // optional, just for display
 */
export default function InviteMemberModal({ open = false, onClose, onSubmit, orgName }) {
  const dialogRef = useRef(null);
  const [form, setForm] = useState({
    emails: [""],
    role: "Member", // Member | Admin
    message: "",
  });
  const [error, setError] = useState(null);

  // Reset when opened
  useEffect(() => {
    if (!open) return;
    setError(null);
    setForm({ emails: [""], role: "Member", message: "" });
  }, [open]);

  // ESC to close + autofocus first email
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    const input = dialogRef.current?.querySelector("input[name='email-0']");
    input?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setEmail = (i, v) =>
    set("emails", form.emails.map((e, idx) => (idx === i ? v : e)));
  const addEmail = () => set("emails", [...form.emails, ""]);
  const removeEmail = (i) => set("emails", form.emails.filter((_, idx) => idx !== i));

  const submit = (e) => {
    e.preventDefault();
    setError(null);

    const emails = form.emails.map((e) => e.trim()).filter(Boolean);
    if (emails.length === 0) {
      setError("Please enter at least one email.");
      return;
    }
    // simple email check (client-side)
    const bad = emails.find((em) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em));
    if (bad) {
      setError(`Invalid email: ${bad}`);
      return;
    }

    onSubmit?.({
      emails,
      role: form.role,
      message: form.message.trim(),
      orgName,
    });
  };

  if (!open) return null;

  return (
    <div className="im-overlay" onClick={onClose} aria-modal="true" role="dialog">
      <div className="im-card" onClick={(e) => e.stopPropagation()} ref={dialogRef}>
        <div className="im-head">
          <h2 className="im-title">
            Invite members{orgName ? ` to ${orgName}` : ""}
          </h2>
          <button className="im-close" aria-label="Close" onClick={onClose}>×</button>
        </div>

        <form className="im-form" onSubmit={submit}>
          {error && <div className="im-error" aria-live="polite">{error}</div>}

          <div className="im-grid">
            {/* Emails */}
            <div className="im-field span-2">
              <label>Emails</label>
              <div className="im-invites">
                {form.emails.map((email, i) => (
                  <div className="im-invite-row" key={i}>
                    <input
                      type="email"
                      name={`email-${i}`}
                      placeholder="teammate@company.com"
                      value={email}
                      onChange={(e) => setEmail(i, e.target.value)}
                      required={i === 0}
                    />
                    {form.emails.length > 1 && (
                      <button
                        type="button"
                        className="im-mini im-danger"
                        onClick={() => removeEmail(i)}
                        aria-label="Remove"
                      >
                        −
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button type="button" className="im-add" onClick={addEmail}>
                + Add another
              </button>
            </div>

            {/* Role */}
            <div className="im-field">
              <label htmlFor="im-role">Role</label>
              <select
                id="im-role"
                value={form.role}
                onChange={(e) => set("role", e.target.value)}
              >
                <option>Member</option>
                <option>Admin</option>
              </select>
            </div>

            {/* Message */}
            <div className="im-field span-2">
              <label htmlFor="im-message">Message (optional)</label>
              <textarea
                id="im-message"
                placeholder="Add a short note to your invite (optional)…"
                value={form.message}
                onChange={(e) => set("message", e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <div className="im-actions">
            <button type="button" className="im-btn" onClick={onClose}>
              Cancel
            </button>
            <button className="im-btn im-primary" type="submit">
              Send Invites
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
