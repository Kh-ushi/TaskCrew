import React, { useState, useEffect } from 'react';
import './AddProjectModal.css';
import Select from 'react-select';

const AddProjectModal = ({ isOpen, onClose,onCreate,error,setError,allUsers,isEdit,selectedProject,handleEdit}) => {

  const teamMembers= allUsers.map((user) => ({
    value: user._id,              
    label: user.name
  }));

  const [form, setForm] = useState({
    name:!isEdit?'':selectedProject.name,
    description:!isEdit?'':selectedProject.description,
    dueDate: !isEdit?'':new Date(selectedProject.dueDate).toISOString().split('T')[0],
    members: !isEdit?[]:selectedProject.members.map((m) => m._id)
  });

  useEffect(() => {
    if (isOpen && !isEdit) {
      setForm({ name: '', description: '', dueDate: '', members: '' });
    }
  }, [isOpen]);

  const handleChange = (e) => {
    setError("");
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();


    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      dueDate: form.dueDate || null,
      memberIds: form.members
    };

    // console.log('Creating project with payload:', payload);

    if(isEdit){
      handleEdit(selectedProject._id, payload);
    }
    else{
      onCreate(payload);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
      <div><p className='model-error'>{error}</p></div>
        <h2 className="modal-title">New Project</h2>
        <form className="modal-form" onSubmit={handleSubmit}>
          <label>
            Name
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="3"
            />
          </label>
          <label>
            Due Date
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
            />
          </label>

          <label>
            Members
            <Select
              isMulti
              name="members"
              options={teamMembers}
              className="basic-multi-select"
              classNamePrefix="select"
              value={teamMembers.filter((m) => form.members.includes(m.value))}
              onChange={(selected) => {
                setForm((f) => ({
                  ...f,
                  members: selected.map((s) => s.value)
                }));
              }}
            />
            </label>

         
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectModal;
