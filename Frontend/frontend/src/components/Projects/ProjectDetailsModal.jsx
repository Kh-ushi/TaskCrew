import React, { useState, useEffect } from "react";
import "./ProjectDetailsModal.css";
import { FiX, FiPlus, FiUserPlus } from "react-icons/fi";
import axios from "axios";

const ProjectDetailsModal = ({ project, onClose }) => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [editTask, setEditTask] = useState(null);

    useEffect(() => {
        if (editTask) {
            setTaskForm({
                title: editTask.title || "",
                description: editTask.description || "",
                startDate: editTask.startDate
                    ? new Date(editTask.startDate).toISOString().split("T")[0]
                    : "",
                endDate: editTask.endDate
                    ? new Date(editTask.endDate).toISOString().split("T")[0]
                    : "",
                priority: editTask.priority || "medium",
                status: editTask.status || "to-do",
            });
        }
    }, [editTask]);


    const [taskForm, setTaskForm] = useState({
        title: "",
        startDate: "",
        endDate: "",
        priority: "medium",
        status: "to-do",
    });
    const [tasks, setTasks] = useState([]);

    useEffect(() => {

        const fetchTasks = async () => {
            try {

                const token = localStorage.getItem("accessToken");
                const { data } = await axios.get(`${BACKEND_URL}/api/task/project/${project._id}`, {
                    headers: {
                        authorization: `Bearer ${token}`
                    }
                });
                console.log(data);
                setTasks(data?.tasks || []);
            }
            catch (error) {
                console.log(error);
            }
        }
        fetchTasks();

    }, []);

    const handleTaskSubmit = async (e) => {
        e.preventDefault();

        console.log(taskForm);

        try {
            const token = localStorage.getItem("accessToken");
            const { data } = await axios.post(`${BACKEND_URL}/api/task/project/${project._id}`, taskForm, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            });
            const { message, task } = data;
            setTasks((prev) => [...prev, task]);
            alert(message);
            setTaskForm({
                title: "",
                startDate: "",
                endDate: "",
                priority: "medium",
                status: "to-do",
            });
            setShowTaskForm(false);
        }
        catch (error) {
            console.log(error);
        }

    };

    const handleEditTask = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("accessToken");
            const { data } = await axios.put(`${BACKEND_URL}/api/task/${editTask._id}`, taskForm, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            });

            const { message, task } = data;
            setTasks((prev) => (
                prev.map((p) => {
                    if (p._id == task._id) return task;
                    return p;
                })
            ));
            alert(message);
            setShowTaskForm(false);

        }
        catch (error) {
            console.log(error);
        }
    };

    const handleDeleteTask = async (task) => {
        try {
            const token = localStorage.getItem("accessToken");
            const { data } = await axios.delete(`${BACKEND_URL}/api/task/${task._id}`, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });

            console.log(data);

            const { task: deletedTask, message } = data;

            setTasks((prev) => prev.filter((p) => p._id !== deletedTask._id));

            alert(message);
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <div className="project-modal-overlay" onClick={onClose}>
            <div className="project-modal" onClick={(e) => e.stopPropagation()}>
                {/* 🔝 Header */}
                <header className="project-header">
                    <div>
                        <h2>{project.name}</h2>
                        <p>{project.description}</p>
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <FiX />
                    </button>
                </header>

                {/* 📅 Meta */}
                <div className="project-meta">
                    <div>📅 Start: {new Date(project.startDate).toLocaleDateString()}</div>
                    <div>📅 End: {new Date(project.endDate).toLocaleDateString()}</div>
                    <div className="completion">
                        ✅ Completion: <strong>{project.completion || 0}%</strong>
                    </div>
                </div>

                {/* ➕ Add Task Button */}
                <div className="task-control">
                    <button
                        className="add-task-btn"
                        onClick={() => {
                            setEditTask(null);
                            setTaskForm({
                                title: "",
                                startDate: "",
                                endDate: "",
                                priority: "medium",
                                status: "to-do",
                            })
                            setShowTaskForm((prev) => !prev);
                        }}
                    >
                        <FiPlus /> {showTaskForm ? "Cancel" : "Add Task"}
                    </button>
                </div>

                {/* 📥 New Task Form */}
                {showTaskForm && (
                    <form className="task-form" onSubmit={editTask ? handleEditTask : handleTaskSubmit}>
                        <div className="form-group">
                            <label>Task Name</label>
                            <input
                                type="text"
                                value={taskForm.title}
                                onChange={(e) =>
                                    setTaskForm({ ...taskForm, title: e.target.value })
                                }
                                required
                            />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Start Date</label>
                                <input
                                    type="date"
                                    value={taskForm.startDate}
                                    onChange={(e) =>
                                        setTaskForm({ ...taskForm, startDate: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>End Date</label>
                                <input
                                    type="date"
                                    value={taskForm.endDate}
                                    onChange={(e) =>
                                        setTaskForm({ ...taskForm, endDate: e.target.value })
                                    }
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Priority</label>
                                <select
                                    value={taskForm.priority}
                                    onChange={(e) =>
                                        setTaskForm({ ...taskForm, priority: e.target.value })
                                    }
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Status</label>
                                <select
                                    value={taskForm.status}
                                    onChange={(e) =>
                                        setTaskForm({ ...taskForm, status: e.target.value })
                                    }
                                >
                                    <option value="to-do">To-do</option>
                                    <option value="in-progress">In-progress</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                        </div>
                        <button type="submit" className="submit-task-btn">
                            {editTask ? "Edit Task" : "Save Task"}
                        </button>
                    </form>
                )}

                {/* 📋 Task Cards */}
                <div className="tasks-grid">
                    {tasks?.map((task) => (
                        <div className="task-card" key={task._id}>
                            <div className="task-header">
                                <h3>{task.title}</h3>
                                <div className="task-actions">
                                    <button className="task-icon edit" onClick={() => {
                                        setEditTask(task);
                                        setShowTaskForm(true);
                                    }}>
                                        ✏️
                                    </button>
                                    <button className="task-icon delete" onClick={() => handleDeleteTask(task)}>
                                        🗑️
                                    </button>
                                    <span className={`status ${task.status.toLowerCase()}`}>
                                        {task.status}
                                    </span>
                                </div>
                            </div>

                            <div className="task-meta">
                                <p>
                                    📆 {new Date(task.startDate).toLocaleDateString()} -{" "}
                                    {new Date(task.endDate).toLocaleDateString()}
                                </p>
                                <p>
                                    🔥 Priority: <strong>{task.priority}</strong>
                                </p>
                            </div>

                            <div className="assignees">
                                {task.assignees?.slice(0, 4).map((u) => (
                                    <img
                                        key={u._id}
                                        src={u.avatar || `https://i.pravatar.cc/40?u=${u._id}`}
                                        alt={u.name}
                                        title={u.name}
                                    />
                                ))}
                                <button className="add-assignee">
                                    <FiUserPlus />
                                </button>
                            </div>

                            <div className="task-progress">
                                <div
                                    className="task-progress-bar"
                                    style={{ width: `${task.completion || 0}%` }}
                                ></div>
                            </div>
                            <span className="task-completion">{task.completion || 0}% Complete</span>
                        </div>

                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProjectDetailsModal;
