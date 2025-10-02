import React, { useState } from "react";
import "./AddMemberModal.css";
import { FiX, FiPlus, FiTrash2 } from "react-icons/fi";

const AddMemberModal = ({ isOpen, onClose, onSubmit ,entityType, entity}) => {
  const [email, setEmail] = useState("");
  const [members, setMembers] = useState([]);

  const handleAdd = () => {
    if (email.trim() && !members.includes(email.trim())) {
      setMembers([...members, email.trim()]);
      setEmail("");
    }
  };

  const handleRemove = (member) => {
    setMembers(members.filter((m) => m !== member));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(members);
    setMembers([]);
    // onClose();
  };

  if (!isOpen) return null;

  let entityName="";
  switch (entityType) {
    case "organization":
      entityName = entity.name;
      break;
    case "space":
      entityName = entity.name;
      break;
    default:
      break;
  }

  return (
    <div className="addmember-overlay" onClick={onClose}>
      <div className="addmember-modal" onClick={(e) => e.stopPropagation()}>
        {/* ✨ Header */}
        <div className="addmember-header">
          <h2>{`Invite Members to ${entityName}`}</h2>
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        {/* 📩 Input Section */}
        <form className="addmember-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Member Email</label>
          <div className="input-row">
            <input
              id="email"
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="button" className="add-btn" onClick={handleAdd}>
              <FiPlus /> Add
            </button>
          </div>

          {/* 👥 Members List */}
          <div className="members-list">
            {members.map((member) => (
              <div key={member} className="member-chip">
                <span>{member}</span>
                <button type="button" onClick={() => handleRemove(member)}>
                  <FiTrash2 />
                </button>
              </div>
            ))}
            {members.length === 0 && (
              <p className="empty-hint">No members added yet.</p>
            )}
          </div>

          {/* 📤 Actions */}
          <div className="modal-actions">
            <button type="submit" className="submit-btn">
              Save Members
            </button>
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMemberModal;
