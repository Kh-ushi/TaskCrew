import React, { useState, useEffect } from "react";
import "./CreateTaskModal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

function CreateTaskModal({ isOpen, onClose, onCreate, taskInfo, handleEdit }) {
  const [formData, setFormData] = useState({
    title: taskInfo?.title || "",
    description: taskInfo?.description || "",
    projectId: taskInfo?.projectId || "",
    assignedInput: "",
    assignedTo: taskInfo?.assignedTo || [],
    priority: taskInfo?.priority || "Medium",
    status: taskInfo?.status || "todo",
    startTime: taskInfo?.startTime ? taskInfo.startTime.slice(0, 16) : "",
    endTime: taskInfo?.endTime ? taskInfo.endTime.slice(0, 16) : "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddAssignee = () => {
    const val = formData.assignedInput.trim();
    if (val) {
      setFormData({
        ...formData,
        assignedTo: [...formData.assignedTo, val],
        assignedInput: "",
      });
    }
  };

  const handleRemoveAssignee = (idx) => {
    setFormData({
      ...formData,
      assignedTo: formData.assignedTo.filter((_, i) => i !== idx),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskInfo) {
      handleEdit({ ...formData });
    } else {
      onCreate({ ...formData });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="ctm-overlay">
      <div className="ctm-modal">
        <div className="ctm-header">
          <h3>{taskInfo ? "Edit Task" : "Create New Task"}</h3>
          <FontAwesomeIcon icon={faTimes} className="ctm-close" onClick={onClose} />
        </div>
        <form className="ctm-body" onSubmit={handleSubmit}>
          <label>Title*</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />

          {/* <label>Project ID*</label>
          <input
            name="projectId"
            value={formData.projectId}
            onChange={handleChange}
            required
          /> */}

          <div className="ctm-grid">
            <div>
              <label>Start Time*</label>
              <input
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>End Time*</label>
              <input
                type="datetime-local"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <label>Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="ctm-select"
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>

          <label>Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="ctm-select"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <label>Assignees (user ID/email)</label>
          <div className="ctm-member-input">
            <input
              name="assignedInput"
              value={formData.assignedInput}
              onChange={handleChange}
              placeholder="user@example.com"
            />
            <button
              type="button"
              className="ctm-add-btn"
              onClick={handleAddAssignee}
            >
              Add
            </button>
          </div>
          <div className="ctm-members-list">
            {formData.assignedTo.map((a, idx) => (
              <span key={idx} className="ctm-tag">
                {a}
                <span
                  className="ctm-tag-close"
                  onClick={() => handleRemoveAssignee(idx)}
                >
                  &times;
                </span>
              </span>
            ))}
          </div>

          <div className="ctm-footer">
            <button
              type="button"
              className="ctm-btn ctm-btn--outline"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="ctm-btn ctm-btn--primary">
              {taskInfo ? "Save" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTaskModal;