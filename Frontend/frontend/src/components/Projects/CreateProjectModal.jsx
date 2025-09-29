import React, { useState } from "react";
import "./CreateProjectModal.css";
import { FiX, FiUsers, FiCalendar } from "react-icons/fi";

const CreateProjectModal = ({ isOpen, onClose, onSubmit, editProject }) => {
    const [formData, setFormData] = useState({
        name: editProject ? editProject.name : "",
        description: editProject ? editProject.description : "",
        status: editProject ? editProject.status : "active",
        state: editProject ? editProject.state : "to-do",
        startDate: editProject ? editProject.startDate?.slice(0, 10) : "",
        endDate: editProject ? editProject.endDate?.slice(0, 10) : "",
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        { editProject ? onSubmit(formData, editProject._id) : onSubmit(formData) };
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="project-modal">
                <div className="modal-header">
                    <h2>Create New Project 🚀</h2>
                    <button className="close-btn" onClick={onClose}>
                        <FiX size={22} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    {/* 🏷️ Project Name */}
                    <div className="form-group">
                        <label>Project Name <span className="required">*</span></label>
                        <input
                            type="text"
                            name="name"
                            placeholder="e.g. TaskCrew Web App"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            minLength={3}
                            maxLength={100}
                        />
                    </div>

                    {/* 📜 Description */}
                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            placeholder="Brief description of the project goals and scope..."
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            maxLength={500}
                        />
                    </div>

                    {/* 📊 Status */}
                    <div className="form-group">
                        <label>Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="active">Active</option>
                            <option value="archived">Archived</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>State</label>
                        <select
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                        >
                            <option value="to-do">TO-DO</option>
                            <option value="in-progress">IN-PROGRESS</option>
                            <option value="completed">COMPLETED</option>

                        </select>

                    </div>

                    {/* 📅 Dates */}
                    <div className="date-row">
                        <div className="form-group">
                            <label>
                                <FiCalendar /> Start Date <span className="required">*</span>
                            </label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                <FiCalendar /> End Date
                            </label>
                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                min={formData.startDate} // ensures it's ≥ startDate
                            />
                        </div>
                    </div>


                    {/* ✅ Submit */}
                    <button type="submit" className="submit-btn">
                        {editProject ? "Edit Project" : "Create Project"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateProjectModal;
