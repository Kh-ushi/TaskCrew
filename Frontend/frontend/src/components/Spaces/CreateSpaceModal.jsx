import React, { useState } from "react";
import "./CreateSpaceModal.css";
import { FiX } from "react-icons/fi";

const CreateSpaceModal = ({ isOpen, onClose, onSubmit ,editSpace}) => {
  const [spaceData, setSpaceData] = useState({
    name:editSpace?editSpace.name:"",
    description:editSpace?editSpace.description:"",
    members:editSpace?editSpace.members.map((m)=>m.userId.email):[],
  });

  const [emailInput, setEmailInput] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSpaceData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleEmailKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && emailInput.trim() !== "") {
      e.preventDefault();
      const email = emailInput.trim();

      if (!validateEmail(email)) {
        alert("❌ Please enter a valid email");
        return;
      }

      if (spaceData.members.some((m) => m.toLowerCase() === email.toLowerCase())) {
        alert("⚠️ Member already added");
        setEmailInput("");
        return;
      }

      setSpaceData((prev) => ({
        ...prev,
        members: [...prev.members, email],
      }));
      setEmailInput("");
    }
  };

  const removeMember = (email) => {
    setSpaceData((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m !== email),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    editSpace?onSubmit(spaceData,editSpace._id):onSubmit(spaceData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="org-modal">
        {/* ❌ Close Button */}
        <button className="close-btn" onClick={onClose}>
          <FiX />
        </button>

        {/* 🪩 Header */}
        <h1 className="org-title">{editSpace?`Edit ${editSpace.name}`:"Create New Space"}</h1>
        <p className="org-subtitle">Spaces help organize projects, teams, and workflows 🌐</p>

        {/* 📄 Form */}
        <form className="org-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Space Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="e.g. Product Development"
              value={spaceData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Briefly describe what this space is for..."
              value={spaceData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          {/* 📧 Members */}
          <div className="form-group">
            <label>Add Members (Email)</label>
            <div className="members-input-container">
              {spaceData.members.map((email) => (
                <div className="member-tag" key={email}>
                  {email}
                  <span
                    className="remove-member"
                    onClick={() => removeMember(email)}
                  >
                    ×
                  </span>
                </div>
              ))}
              <input
                type="email"
                placeholder="Type email and press Enter"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyDown={handleEmailKeyDown}
              />
            </div>
          </div>

          {/* 🚀 Submit */}
          <button type="submit" className="submit-btn">
            {editSpace?"Edit Space":"Create new Space"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateSpaceModal;
