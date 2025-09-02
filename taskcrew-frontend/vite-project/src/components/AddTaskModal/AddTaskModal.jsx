import React, { useEffect, useRef, useState } from "react";
import "./AddTaskModal.css";

/**
 * Props:
 * - open: boolean
 * - onClose: () => void
 * - onSubmit: (payload) => void
 * - projectId: string (required)
 * - currentUserId: string (required) -> createdBy
 * - defaultStatus?: "todo" | "in-progress" | "done" (default "todo")
 * - defaultPriority?: "Low" | "Medium" | "High" (default "Medium")
 * - initialAssignees?: string[]   // optional prefill
 */
export default function AddTaskModal({
  open = false,
  onClose,
  onSubmit = () => { },
  onEdit = () => { },
  project,
  defaultStatus = "todo",
  defaultPriority = "medium",
  initialAssignees = [],
  task = null,
}) {
  const dialogRef = useRef(null);

  const fmtDateTimeLocal = (d) =>
    d ? new Date(d).toISOString().slice(0, 16) : "";

  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    title: task?.title || "",
    description: task?.description || "",
    assignedTo: task?.assignedTo || initialAssignees.length ? initialAssignees : [""],
    status: task?.status || defaultStatus,
    priority: task?.priority || defaultPriority,
    startTime: fmtDateTimeLocal(task?.startTime) || "",
    endTime: fmtDateTimeLocal(task?.endTime) || "",
    dueDate: fmtDateTimeLocal(task?.dueDate) || "",
  });

  // Reset + autofocus on open
  useEffect(() => {
    if (!open) return;
    // setError(null);
    setForm({
      title: task?.title || "",
      description: task?.description || "",
      assignedTo: task?.assignedTo || initialAssignees.length ? initialAssignees : [""],
      status: task?.status || defaultStatus,
      priority: task?.priority || defaultPriority,
      startTime: fmtDateTimeLocal(task?.startTime) || "",
      endTime: fmtDateTimeLocal(task?.endTime) || "",
      dueDate: fmtDateTimeLocal(task?.dueDate) || "",
    });

    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    // autofocus
    requestAnimationFrame(() => {
      dialogRef.current?.querySelector("#tk-title")?.focus();
    });
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setAssignee = (i, v) =>
    set("assignedTo", form.assignedTo.map((x, idx) => (idx === i ? v : x)));
  const addAssignee = () => set("assignedTo", [...form.assignedTo, ""]);
  const removeAssignee = (i) =>
    set("assignedTo", form.assignedTo.filter((_, idx) => idx !== i));

  const submit = (e) => {
    e.preventDefault();
    setError(null);

    if (!project) return setError("Missing project. Please retry.");
    if (!form.title.trim()) return setError("Please enter a task title.");
    if (!form.startTime) return setError("Please select a start time.");
    if (!form.endTime) return setError("Please select an end time.");
    const start = new Date(form.startTime);
    const end = new Date(form.endTime);
    if (end < start) return setError("End time cannot be before start time.");
    if (form.dueDate) {
      const due = new Date(form.dueDate);
      if (due < start)
        return setError("Due date cannot be before the start time.");
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      assignedTo: form.assignedTo.map(s => s.trim()).filter(Boolean), // strings
      status: form.status,             // enum
      priority: form.priority,         // enum
      startTime: start,                // Date
      endTime: end,                    // Date
      dueDate: form.dueDate ? new Date(form.dueDate) : undefined,
    };

    task ? onEdit?.(payload) : onSubmit?.(payload);
  };

  if (!open) return null;

  // For <input type="datetime-local"/date> we need specific formats
  const toLocalInputValue = (d) =>
    d ? new Date(d).toISOString().slice(0, 16) : "";

  return (
    <div className="tk-overlay" onClick={onClose} aria-hidden="true">
      <div
        className="tk-card"
        onClick={(e) => e.stopPropagation()}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tk-title-h"
      >
        <div className="tk-head">
          <h2 id="tk-title-h" className="tk-title">{task ? `Edit Task ${task.title}` : `Add Task to ${project?.name}`}</h2>
          <button className="tk-close" aria-label="Close" onClick={onClose}>×</button>
        </div>

        <form className="tk-form" onSubmit={submit}>
          {error && <div className="tk-error" aria-live="polite">{error}</div>}

          <div className="tk-grid">
            {/* Title */}
            <div className="tk-field span-2">
              <label htmlFor="tk-title">Title</label>
              <input
                id="tk-title"
                type="text"
                placeholder="e.g., Design database schema"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="tk-field span-2">
              <label htmlFor="tk-desc">Description (optional)</label>
              <textarea
                id="tk-desc"
                placeholder="Short description…"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                rows={3}
              />
            </div>

            {/* Status */}
            <div className="tk-field">
              <label htmlFor="tk-status">Status</label>
              <select
                id="tk-status"
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            {/* Priority */}
            <div className="tk-field">
              <label htmlFor="tk-priority">Priority</label>
              <select
                id="tk-priority"
                value={form.priority}
                onChange={(e) => set("priority", e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Start / End */}
            <div className="tk-field">
              <label htmlFor="tk-start">Start time</label>
              <input
                id="tk-start"
                type="datetime-local"
                value={form.startTime}
                onChange={(e) => set("startTime", e.target.value)}
                required
              />
            </div>
            <div className="tk-field">
              <label htmlFor="tk-end">End time</label>
              <input
                id="tk-end"
                type="datetime-local"
                value={form.endTime}
                onChange={(e) => set("endTime", e.target.value)}
                min={form.startTime || undefined}
                required
              />
            </div>

            {/* Due date (optional) */}
            {/* <div className="tk-field">
              <label htmlFor="tk-due">Due date (optional)</label>
              <input
                id="tk-due"
                type="date"
                value={form.dueDate}
                onChange={(e) => set("dueDate", e.target.value)}
                min={form.startTime ? form.startTime.slice(0,10) : undefined}
              />
            </div> */}

            {/* Assignees */}
            <div className="tk-field span-2">
              <label>Assignees (user IDs or emails)</label>
              <div className="tk-assignees">
                {form.assignedTo.map((a, i) => (
                  <div className="tk-assignee-row" key={i}>
                    <input
                      type="text"
                      placeholder="userId or email"
                      value={a}
                      onChange={(e) => setAssignee(i, e.target.value)}
                    />
                    {form.assignedTo.length > 1 && (
                      <button
                        type="button"
                        className="tk-mini tk-danger"
                        onClick={() => removeAssignee(i)}
                        aria-label="Remove assignee"
                      >
                        −
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button type="button" className="tk-add" onClick={addAssignee}>
                + Add another
              </button>
            </div>
          </div>

          <div className="tk-actions">
            <button type="button" className="tk-btn" onClick={onClose}>Cancel</button>
            <button className="tk-btn tk-primary" type="submit">{task ? "Edit Task" : "Create Task"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
