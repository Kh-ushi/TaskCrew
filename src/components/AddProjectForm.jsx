import React, { useState, useEffect } from 'react';
import './AddProjectForm.css';
import { 
  Plus, 
  Users, 
  Tag, 
  Upload, 
  X, 
  CheckCircle 
} from 'lucide-react';

const AddProjectForm = ({ onSave, onCancel, currentUser }) => {
  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    startDate: '',
    endDate: '',
    projectOwner: currentUser?.name || 'Unknown User',
    teamMembers: [],
    roles: {},
    priority: 'Medium',
    status: 'Planned',
    tags: '',
    files: [],
  });

  const [availableMembers, setAvailableMembers] = useState([
    { id: 1, name: 'John Smith' },
    { id: 2, name: 'Alice Johnson' },
    { id: 3, name: 'Bob Williams' },
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTeamMembersChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => ({
      id: Number(option.value),
      name: option.text,
    }));
    setFormData({ ...formData, teamMembers: selectedOptions });
  };

  const handleRoleChange = (memberId, role) => {
    setFormData({
      ...formData,
      roles: {
        ...formData.roles,
        [memberId]: role,
      },
    });
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFormData({ ...formData, files: [...formData.files, ...newFiles] });
  };

  const removeFile = (index) => {
    const updatedFiles = formData.files.filter((_, i) => i !== index);
    setFormData({ ...formData, files: updatedFiles });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.projectName || !formData.startDate || !formData.endDate) {
      alert('Please fill in all required fields.');
      return;
    }
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      alert('End date cannot be earlier than start date.');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="add-project-modal">
      <div className="add-project-content">
        <div className="modal-header">
          <h2><Plus size={20} /> Add New Project</h2>
          <button className="close-btn" onClick={onCancel}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          
          <div className="form-section">
            <h3>Basic Details</h3>
            <div className="form-group">
              <label htmlFor="projectName">Project Name *</label>
              <input
                type="text"
                id="projectName"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                required
                placeholder="Enter project name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter project description"
              />
            </div>
            <div className="form-group">
              <label htmlFor="startDate">Start Date *</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="endDate">End Date *</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          
          <div className="form-section">
            <h3>Team Management</h3>
            <div className="form-group">
              <label htmlFor="projectOwner">Project Owner</label>
              <input
                type="text"
                id="projectOwner"
                name="projectOwner"
                value={formData.projectOwner}
                readOnly
                style={{ backgroundColor: '#f0f0f0' }}
              />
            </div>
            <div className="form-group">
              <label htmlFor="teamMembers">Assign Team Members *</label>
              <select
                id="teamMembers"
                name="teamMembers"
                multiple
                value={formData.teamMembers.map(member => member.id)}
                onChange={handleTeamMembersChange}
                required
              >
                {availableMembers.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>
            {formData.teamMembers.length > 0 && (
              <div className="form-group">
                <label>Roles for Members (Optional)</label>
                {formData.teamMembers.map((member) => (
                  <div key={member.id} className="role-assignment">
                    <span>{member.name}</span>
                    <select
                      value={formData.roles[member.id] || ''}
                      onChange={(e) => handleRoleChange(member.id, e.target.value)}
                    >
                      <option value="">Select Role</option>
                      <option value="Manager">Manager</option>
                      <option value="Developer">Developer</option>
                      <option value="Designer">Designer</option>
                    </select>
                  </div>
                ))}
              </div>
            )}
          </div>

           
          <div className="form-section">
            <h3>Project Settings</h3>
            <div className="form-group">
              <label htmlFor="priority">Priority *</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                required
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="status">Project Status *</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="Planned">Planned</option>
                <option value="Active">Active</option>
                <option value="On Hold">On Hold</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="tags">Tags/Categories (Optional)</label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="e.g., Development, Marketing"
              />
              <small className="help-text">Separate tags with commas</small>
            </div>
          </div>

          
          <div className="form-section">
            <h3>Attachments (Optional)</h3>
            <div className="form-group">
              <label htmlFor="files">Upload Files</label>
              <div className="file-upload">
                <input
                  type="file"
                  id="files"
                  name="files"
                  multiple
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <label htmlFor="files" className="upload-btn">
                  <Upload size={16} /> Choose Files
                </label>
              </div>
              {formData.files.length > 0 && (
                <div className="file-list">
                  {formData.files.map((file, index) => (
                    <div key={index} className="file-item">
                      <span>{file.name}</span>
                      <button type="button" onClick={() => removeFile(index)}><X size={14} /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          
          <div className="form-actions">
            <button type="submit" className="save-btn"><CheckCircle size={16} /> Save Project</button>
            <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectForm;