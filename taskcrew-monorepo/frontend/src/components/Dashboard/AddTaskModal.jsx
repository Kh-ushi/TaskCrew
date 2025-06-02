import './AddTaskModal.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';


const backendURL = import.meta.env.VITE_BACKEND_URL;


const AddTaskModal = ({ isOpen, onClose, handleManualAddition, error, setError }) => {
    const [taskType, setTaskType] = useState('manual');
    const [manualData, setManualData] = useState({
        title: '',
        description: '',
        dueDate: '',
        assignee: ''
    });

    const navigate = useNavigate();

    //MANUAL SETUP
    const [allUsers, setAllUsers] = useState([]);


    const teamMembers = allUsers.map((user) => ({
        value: user._id,
        label: user.name
    }));


    useEffect(() => {

        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }
                const response = await axios.get(`${backendURL}/api/auth/allUsers`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log('Fetched users:', response.data);
                setAllUsers(response.data);
            } catch (error) {
                setError(error.response?.data?.message || 'Error fetching users');
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();

    }, [isOpen]);


    //   AI SETUP

    const [aiPrompt, setAiPrompt] = useState('');

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <p className='error-div'>{error}</p>
                <h2 className="modal-title">Add New Task</h2>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <button
                        className="btn-submit"
                        style={{
                            padding: '0.4rem 0.8rem',
                            fontSize: '0.85rem',
                            background: taskType === 'manual'
                                ? 'linear-gradient(90deg, var(--gradient-start), var(--gradient-end))'
                                : '#eee',
                            color: taskType === 'manual' ? '#fff' : 'var(--text-secondary)',
                        }}
                        onClick={() => setTaskType('manual')}
                    >
                        Manually
                    </button>
                    <button
                        className="btn-submit"
                        style={{
                            padding: '0.4rem 0.8rem',
                            fontSize: '0.85rem',
                            background: taskType === 'auto-generate'
                                ? 'linear-gradient(90deg, var(--gradient-start), var(--gradient-end))'
                                : '#eee',
                            color: taskType === 'auto-generate' ? '#fff' : 'var(--text-secondary)',
                        }}
                        onClick={() => setTaskType('auto-generate')}
                    >
                        Let AI generate it
                    </button>
                </div>

                {taskType === 'manual' && (
                    <form className="modal-form">
                        <label>
                            Task Title
                            <input
                                type="text"
                                value={manualData.title}
                                onChange={(e) => {
                                    setError("");
                                    setManualData({ ...manualData, title: e.target.value });
                                }}
                                required
                            />
                        </label>
                        <label>
                            Description
                            <textarea
                                value={manualData.description}
                                onChange={(e) =>{
                                    setError("");
                                    setManualData({ ...manualData, description: e.target.value })
                                }}
                            />
                        </label>
                        <label>
                            Due Date (optional)
                            <input
                                type="date"
                                value={manualData.dueDate}
                                onChange={(e) =>{
                                    setError("");
                                    setManualData({ ...manualData, dueDate: e.target.value })
                                }}
                            />
                        </label>
                        <label>
                            Assignee (optional)
                            <Select
                                options={teamMembers}
                                className='basic-single'
                                classNamePrefix={'single'}
                                onChange={(selected) => {
                                    setError("");
                                    setManualData((prev) => ({ ...prev, assignee: selected.value }));
                                }}
                            ></Select>
                        </label>

                        <div className="modal-actions">
                            <button type="button" className="btn-cancel" onClick={onClose}>
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn-submit"
                                onClick={() => {
                                    handleManualAddition(manualData);
                                    onClose();
                                }}
                            >
                                Add Task
                            </button>
                        </div>
                    </form>
                )}

                {taskType === 'auto-generate' && (
                    <form className="modal-form">
                        <label>
                            Describe your goal
                            <textarea
                                rows="4"
                                placeholder="Create a task called ‘Refactor auth middleware’, due next Tuesday, assign it to Alice, and tag it backend, security...."
                                value={aiPrompt}
                                onChange={(e) => setAiPrompt(e.target.value)}
                                className='ai-prompt-input'
                            />
                        </label>
                        <div className="modal-actions">
                            <button type="button" className="btn-cancel" onClick={onClose}>
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn-submit"
                                onClick={() => {
                                    //   onAddTask({
                                    //     title: 'AI Generated Task',
                                    //     description: aiPrompt || 'Generated by AI',
                                    //   });
                                    onClose();
                                }}
                            >
                                Generate Task
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AddTaskModal;
