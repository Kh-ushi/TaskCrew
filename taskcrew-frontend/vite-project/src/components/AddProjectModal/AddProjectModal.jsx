import React, { useEffect, useRef, useState } from "react";
import "./AddProjectModal.css";

export default function AddProjectModal({
  open = true,
  onClose,
  onSubmit,
  currentUserId,        // ✅ add this
  spaces = [],          // ✅ add this
  defaultSpaceId = ""  // optional: preselect a space
}) {
  const dialogRef = useRef(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    members: [""],
    status: "active",
    startDate: "",
    endDate: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
  
    const firstSpaceId =
      defaultSpaceId ??
      (Array.isArray(spaces) && spaces.length
        ? spaces[0]._id || spaces[0].id || ""
        : "");
  
    setForm({
      name: "",
      description: "",
      members: [""],
      status: "active",
      startDate: "",
      endDate: "",
      ownerId: currentUserId || "",
      spaceId: firstSpaceId,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]); // 👈 ONLY depends on `open`
  

  // ESC & autofocus
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    dialogRef.current?.querySelector("#ap-name")?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setMember = (i, v) =>
    set("members", form.members.map((m, idx) => (idx === i ? v : m)));
  const addMember = () => set("members", [...form.members, ""]);
  const removeMember = (i) =>
    set("members", form.members.filter((_, idx) => idx !== i));

  const submit = (e) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim()) return setError("Please provide a project name.");
    // if (!form.ownerId?.trim()) return setError("Missing owner.");
    if (!form.startDate) return setError("Please select a start date.");

    const start = new Date(form.startDate);
    const end = form.endDate ? new Date(form.endDate) : null;
    if (end && end < start) return setError("End date cannot be before start date.");

    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      ownerId: form.ownerId.trim(),
      members: form.members.map((m) => m.trim()).filter(Boolean),
      status: form.status,
      startDate: start,
      endDate: end || undefined,
      spaceId: form.spaceId || undefined,
    };
    onSubmit?.(payload);
  };

  if (!open) return null;

  return (
    <div className="apm-overlay" onClick={onClose} aria-hidden="true">
      <div
        className="apm-card"
        onClick={(e) => e.stopPropagation()}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="apm-title"
      >
        <div className="apm-head">
          <h2 id="apm-title" className="apm-title">Add Project</h2>
          <button className="apm-close" aria-label="Close" onClick={onClose}>×</button>
        </div>

        <form className="apm-form" onSubmit={submit}>
          {error && <div className="apm-error" aria-live="polite">{error}</div>}

          <div className="apm-grid">
            {/* Name */}
            <div className="apm-field span-2">
              <label htmlFor="ap-name">Project name</label>
              <input
                id="ap-name"
                type="text"
                placeholder="e.g., Website Revamp"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="apm-field span-2">
              <label htmlFor="ap-desc">Description (optional)</label>
              <textarea
                id="ap-desc"
                placeholder="Short description of the project…"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                rows={3}
              />
            </div>

            {/* Space */}
            {/* <div className="apm-field">
              <label htmlFor="ap-space">Space (optional)</label>
              <select
                id="ap-space"
                value={form.spaceId}
                onChange={(e) => set("spaceId", e.target.value)}
              >
                <option value="">— None —</option>
                {spaces.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div> */}

            {/* Status */}
            <div className="apm-field">
              <label htmlFor="ap-status">Status</label>
              <select
                id="ap-status"
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
              >
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* Dates */}
            <div className="apm-field">
              <label htmlFor="ap-start">Start date</label>
              <input
                id="ap-start"
                type="date"
                value={form.startDate}
                onChange={(e) => set("startDate", e.target.value)}
                required
              />
            </div>
            <div className="apm-field">
              <label htmlFor="ap-end">End date (optional)</label>
              <input
                id="ap-end"
                type="date"
                value={form.endDate}
                onChange={(e) => set("endDate", e.target.value)}
                min={form.startDate || undefined}
              />
            </div>

            {/* Members */}
            <div className="apm-field span-2">
              <label>Members (IDs or emails)</label>
              <div className="apm-members">
                {form.members.map((m, i) => (
                  <div className="apm-member-row" key={i}>
                    <input
                      type="text"
                      placeholder="userId or email"
                      value={m}
                      onChange={(e) => setMember(i, e.target.value)}
                    />
                    {form.members.length > 1 && (
                      <button
                        type="button"
                        className="apm-mini apm-danger"
                        onClick={() => removeMember(i)}
                        aria-label="Remove member"
                      >
                        −
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button type="button" className="apm-add" onClick={addMember}>
                + Add another
              </button>
            </div>
          </div>

          <div className="apm-actions">
            <button type="button" className="apm-btn" onClick={onClose}>Cancel</button>
            <button className="apm-btn apm-primary" type="submit">Create Project</button>
          </div>
        </form>
      </div>
    </div>
  );
}
