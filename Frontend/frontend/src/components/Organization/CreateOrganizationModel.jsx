import React, { useState } from "react";
import "./CreateOrganizationModel.css";

const CreateOrganizationModal = ({ isOpen, onClose, onSubmit, editOrg }) => {

  const [formData, setFormData] = useState({
    name: editOrg ? editOrg.name : "",
    description: editOrg ? editOrg.description : "",
    members: editOrg ? editOrg.members.map((m) => m.userId.email) : []
  });

  const [emailInput, setEmailInput] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleEmailKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && emailInput.trim() !== "") {
      e.preventDefault();
      const email = emailInput.trim();

      if (!validateEmail(email)) {
        alert("❌ Please enter a valid email address");
        return;
      }

      if (formData.members.includes(email)) {
        alert("⚠️ This member is already added");
        setEmailInput("");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        members: [...prev.members, email],
      }));
      setEmailInput("");
    }
  };


  const removeMember = (email) => {
    setFormData((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m !== email),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    editOrg ? onSubmit(formData, editOrg._id) : onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="org-modal">
        <button className="close-btn" onClick={onClose}>✕</button>

        {!editOrg && <h2 className="org-title">Create New Organization</h2>}
        {editOrg && <h2 className="org-title">{`Edit ${editOrg.name}`}</h2>}

        {!editOrg && <p className="org-subtitle">
          Bring your team together and start collaborating 🚀
        </p>
        }

        <form className="org-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Organization Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="e.g. TaskCrew Labs"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description (optional)</label>
            <textarea
              id="description"
              name="description"
              placeholder="A short summary about your organization..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="members">Add Members (Gmail)</label>
            <div className="members-input-container">
              {formData.members.map((email, index) => (
                <div key={index} className="member-tag">
                  {email}
                  <span className="remove-member" onClick={() => removeMember(email)}>
                    ✕
                  </span>
                </div>
              ))}

              <input
                type="email"
                id="members"
                placeholder="Type email and press Enter"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyDown={handleEmailKeyDown}
              />
            </div>
          </div>

          <button type="submit" className="submit-btn">
            {editOrg ? "Edit Organization" : "Create Organization"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateOrganizationModal;
