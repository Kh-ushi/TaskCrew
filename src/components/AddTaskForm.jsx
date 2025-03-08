import React, { useState, useEffect } from 'react';
import './AddTaskForm.css';
import { 
  Plus, 
  UserPlus, 
  AlertTriangle, 
  Calendar as CalendarIcon, 
  CheckCircle 
} from 'lucide-react';

const AddTaskForm = ({ onSave, onCancel, projectId }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignees: [],
    priority: 'Medium',
    deadline: '',
  });
  const [aiSuggestions, setAiSuggestions] = useState({
    suggestedDeadline: '',
    suggestedPriority: 'Medium',
  });
  const [availableAssignees, setAvailableAssignees] = useState([
    { id: 1, name: 'John Smith', email: 'john@example.com' },
    { id: 2, name: 'Alice Johnson', email: 'alice@example.com' },
    { id: 3, name: 'Bob Williams', email: 'bob@example.com' },
  ]);

  // Simulate AI suggestions based on title length (complexity proxy) and current date
  useEffect(() => {
    const complexity = formData.title.length > 20 ? 'High' : formData.title.length > 10 ? 'Medium' : 'Low';
    const today = new Date();
    const suggestedDeadline = new Date(today.setDate(today.getDate() + (complexity === 'High' ? 14 : 7))).toISOString().split('T')[0];
    setAiSuggestions({
      suggestedDeadline,
      suggestedPriority: complexity,
    });
  }, [formData.title]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAssigneeChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => ({
      id: Number(option.value),
      name: option.text,
    }));
    setFormData({ ...formData, assignees: selectedOptions });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="add-task-modal">
      <div className="add-task-content">
        <h2><Plus size={20} /> Add New Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter task title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter task description"
            />
          </div>

          <div className="form-group">
            <label htmlFor="assignees">Assignees *</label>
            <select
              id="assignees"
              name="assignees"
              multiple
              value={formData.assignees.map(a => a.id)}
              onChange={handleAssigneeChange}
              required
            >
              {availableAssignees.map((assignee) => (
                <option key={assignee.id} value={assignee.id}>
                  {assignee.name}
                </option>
              ))}
            </select>
            <button type="button" className="add-assignee-btn"><UserPlus size={16} /> Add New Assignee</button>
          </div>

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
            <div className="ai-suggestion">
              <AlertTriangle size={16} color="orange" /> AI Suggestion: {aiSuggestions.suggestedPriority}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="deadline">Deadline *</label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              required
            />
            <div className="ai-suggestion">
              <CalendarIcon size={16} color="green" /> AI Suggestion: {aiSuggestions.suggestedDeadline}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="save-btn"><CheckCircle size={16} /> Save Task</button>
            <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskForm;