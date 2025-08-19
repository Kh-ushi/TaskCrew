import React, { useEffect, useRef, useState } from "react";
import "./CreateSpaceModal.css";

/**
 * Props:
 * - open: boolean
 * - onClose: () => void
 * - onSubmit: (payload) => void
 */
export default function CreateSpaceModal({ open = false, onClose, onSubmit }) {
    const dialogRef = useRef(null);
    const [form, setForm] = useState({
        name: "",
        description: "",
        visibility: "private", // Private | Organization
        inviteEmails: [""],
        // color: "#00E5FF",
    });
    const [error, setError] = useState(null);

    const handleOnClose=()=>{
        onClose?.();
        setForm({
            name: "",
            description: "",
            visibility: "private", // Private | Organization
            inviteEmails: [""],
            // color: "#00E5FF",
        });
    }

    useEffect(() => {
        if (!open) return;
        const onKey = (e) => {
            if (e.key === "Escape") handleOnClose();
        };
        window.addEventListener("keydown", onKey);
        // auto-focus first field
        const input = dialogRef.current?.querySelector("input[name='name']");
        input?.focus();
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
    const setInvite = (i, v) =>
        set("inviteEmails", form.inviteEmails.map((e, idx) => (idx === i ? v : e)));
    const addInvite = () => set("inviteEmails", [...form.inviteEmails, ""]);
    const removeInvite = (i) =>
        set("inviteEmails", form.inviteEmails.filter((_, idx) => idx !== i));

    const submit = (e) => {
        e.preventDefault();
        setError(null);
        if (!form.name.trim()) {
            setError("Please enter a space name.");
            return;
        }
        const payload = {
            name: form.name.trim(),
            description: form.description.trim(),
            visibility: form.visibility,
            inviteEmails: form.inviteEmails
                .map((s) => s.trim())
                .filter(Boolean),
            color: form.color,
        };
        onSubmit?.(payload);
    };

    if (!open) return null;

    return (
        <div className="cs-overlay" onClick={handleOnClose} aria-modal="true" role="dialog">
            <div
                className="cs-card"
                onClick={(e) => e.stopPropagation()}
                ref={dialogRef}
            >
                <div className="cs-head">
                    <h2 className="cs-title">Create Space</h2>
                    <button className="cs-close" aria-label="Close" onClick={handleOnClose}>×</button>
                </div>

                <form className="cs-form" onSubmit={submit}>
                    {error && <div className="cs-error" aria-live="polite">{error}</div>}

                    <div className="cs-grid">
                        {/* Name */}
                        <div className="cs-field span-2">
                            <label htmlFor="cs-name">Space name</label>
                            <input
                                id="cs-name"
                                name="name"
                                type="text"
                                placeholder="e.g., Marketing, Design, Engineering"
                                value={form.name}
                                onChange={(e) => set("name", e.target.value)}
                                required
                            />
                        </div>

                        {/* Description */}
                        <div className="cs-field span-2">
                            <label htmlFor="cs-desc">Description (optional)</label>
                            <textarea
                                id="cs-desc"
                                placeholder="What is this space for?"
                                value={form.description}
                                onChange={(e) => set("description", e.target.value)}
                                rows={3}
                            />
                        </div>

                        {/* Visibility */}
                        <div className="cs-field">
                            <label htmlFor="cs-visibility">Visibility</label>
                            <select
                                id="cs-visibility"
                                value={form.visibility}
                                onChange={(e) => set("visibility", e.target.value)}
                            >
                                <option value="private">Private</option>
                                <option value="org">Organization</option>
                            </select>
                        </div>

                        {/* Color */}
                        {/* <div className="cs-field">
                            <label htmlFor="cs-color">Color</label>
                            <input
                                id="cs-color"
                                type="color"
                                value={form.color}
                                onChange={(e) => set("color", e.target.value)}
                                className="cs-color"
                            />
                        </div> */}

                        {/* Invites */}
                        <div className="cs-field span-2">
                            <label>Invite teammates (optional)</label>
                            <div className="cs-invites">
                                {form.inviteEmails.map((email, i) => (
                                    <div className="cs-invite-row" key={i}>
                                        <input
                                            type="email"
                                            placeholder="teammate@company.com"
                                            value={email}
                                            onChange={(e) => setInvite(i, e.target.value)}
                                        />
                                        {form.inviteEmails.length > 1 && (
                                            <button
                                                type="button"
                                                className="cs-mini cs-danger"
                                                onClick={() => removeInvite(i)}
                                                aria-label="Remove"
                                            >
                                                −
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <button type="button" className="cs-add" onClick={addInvite}>
                                + Add another
                            </button>
                        </div>
                    </div>

                    <div className="cs-actions">
                        <button type="button" className="cs-btn" onClick={handleOnClose}>
                            Cancel
                        </button>
                        <button className="cs-btn cs-primary" type="submit">
                            Create Space
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
