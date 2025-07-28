// CreateSpaceModal.jsx
import React, { useState } from "react";
import "./CreateSpaceModal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

 function CreateSpaceModal({ isOpen, onClose, onCreate }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "active",
    memberInput: "",
    members: [],
  });

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddMember = () => {
    const email = formData.memberInput.trim();
    if (email) {
      setFormData({
        ...formData,
        members: [...formData.members, email],
        memberInput: "",
      });
    }
  };

  const handleRemoveMember = idx => {
    setFormData({
      ...formData,
      members: formData.members.filter((_, i) => i !== idx),
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    onCreate({
      name: formData.name,
      description: formData.description,
      startDate: formData.startDate,
      endDate: formData.endDate || null,
      status: formData.status,
      members: formData.members,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="csm-overlay">
      <div className="csm-modal">
        <div className="csm-header">
          <h3>Create New Space</h3>
          <FontAwesomeIcon
            icon={faTimes}
            className="csm-close"
            onClick={onClose}
          />
        </div>
        <form className="csm-body" onSubmit={handleSubmit}>
          <label>Name*</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />

          <div className="csm-grid">
            <div>
              <label>Start Date*</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <label>Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="status-select"
          >
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>

          <label>Members (email)</label>
          <div className="csm-member-input">
            <input
              name="memberInput"
              value={formData.memberInput}
              onChange={handleChange}
              placeholder="user@example.com"
            />
            <button
              type="button"
              className="csm-add-btn"
              onClick={handleAddMember}
            >
              Add
            </button>
          </div>
          <div className="csm-members-list">
            {formData.members.map((m, i) => (
              <span key={i} className="csm-tag">
                {m}
                <span
                  className="csm-tag-close"
                  onClick={() => handleRemoveMember(i)}
                >
                  &times;
                </span>
              </span>
            ))}
          </div>

          <div className="csm-footer">
            <button
              type="button"
              className="csm-btn csm-btn--outline"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="csm-btn csm-btn--primary">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


export default CreateSpaceModal;