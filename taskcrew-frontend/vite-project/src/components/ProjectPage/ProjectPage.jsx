import React, { useMemo, useRef, useState, useEffect } from "react";
import "./ProjectPage.css";
import { Plus, Upload, Trash2, File as FileIcon } from "lucide-react";
import KanbanBoard from "./KanbanBoard";
import TaskList from "./TaskList";
import AddTaskModal from "../AddTaskModal/AddTaskModal";
import api from "../../utils/axiosInstance";

export default function ProjectPage({
    project = { id: "p1", name: "Website Revamp", description: "Modernize landing and blog." },
    files = [
        // demo data
        { id: "f1", name: "requirements.pdf", size: 1200430, uploadedAt: "2025-08-15T10:22:00Z" },
        { id: "f2", name: "wireframes.fig", size: 845902, uploadedAt: "2025-08-19T14:05:00Z" },
    ],
    onAddTask = () => alert("Open task modal (kanban/list coming later)"),
    onUploadFiles = (selected) => alert(`${selected.length} file(s) selected`),
    onDeleteFile = (id) => alert(`Delete file: ${id}`),
}) {
    const [taskView, setTaskView] = useState("kanban");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [toBeEdited, setToBeEdited] = useState(null);

    useEffect(() => {
        // Fetch tasks from API or use demo data
        const fetchTasks = async () => {
            console.log("Fetching tasks...");
            try {
                console.log("Fetching tasks for project:");
                console.log(project._id);
                const { data } = await api.get(`/api/tasks/${project._id}`);
                console.log(data);
                setTasks(data);
            } catch (error) {
                console.log("Error fetching tasks:");
                console.error("Error fetching tasks:", error);
            }
        };

        fetchTasks();
    }, [project]);

    const demoKanban = {
        todo: [{ id: "1", title: "Setup project repo", status: "To Do" }],
        inProgress: [{ id: "2", title: "Implement auth", status: "In Progress" }],
        done: [{ id: "3", title: "Setup Docker", status: "Done" }],
    };

    const listTasks = useMemo(() => {
        return Object.entries(demoKanban).flatMap(([_, tasks]) => tasks);
    });

    const fileInputRef = useRef(null);

    const openPicker = () => fileInputRef.current?.click();

    const handleUpload = (e) => {
        const selected = Array.from(e.target.files || []);
        if (!selected.length) return;
        onUploadFiles(selected);
        // reset input so selecting the same file again still triggers change
        e.target.value = "";
    };

    const fmtSize = (bytes) => {
        if (bytes == null) return "-";
        const units = ["B", "KB", "MB", "GB", "TB"];
        let i = 0, v = bytes;
        while (v >= 1024 && i < units.length - 1) { v /= 1024; i++; }
        return `${v.toFixed(v >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
    };

    const fmtDate = (iso) => {
        try {
            const d = new Date(iso);
            return d.toLocaleString();
        } catch { return iso || "-"; }
    };

    const handleSubmit = async (payload) => {

        try {
            const { data } = await api.post(`/api/tasks/${project._id}`, payload);
            console.log(data);
            setTasks((prevTasks) => [...prevTasks, data.task]);
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error creating task:", error);
        }

    };

    const handleEdit=async(payload)=>{
       try{
           const { data } = await api.put(`/api/tasks/${toBeEdited._id}`, payload);
           console.log(data);
           setTasks((prevTasks) => prevTasks.map((task) => task._id === data.task._id ? data.task : task));
           setIsModalOpen(false);
       } catch (error) {
           console.error("Error editing task:", error);
       }
    }


    const handleDelete = async (id) => {
        try {
            await api.delete(`/api/tasks/${id}`);
            setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    return (
        <div className="pp-page">
            {/* Header / hero */}
            <section className="pp-hero">
                <div className="pp-hero-left">
                    <h1 className="pp-title">{project.name}</h1>
                    {project.description && (
                        <p className="pp-subtitle">{project.description}</p>
                    )}
                </div>
                <div className="pp-hero-actions">
                    <button className="pp-btn pp-btn-primary" onClick={() => setIsModalOpen(true)}>
                        <Plus size={16} /> Add Task
                    </button>
                </div>
            </section>

            {/* Content */}
            <main className="pp-content">

                <section className="pp-card">
                    <header className="pp-card-head">
                        <h2 className="pp-card-title">Tasks</h2>
                        <div className="pp-toggle">
                            <button
                                className={`pp-toggle-btn ${taskView == "kanban" ? "is-active" : ""}`}
                                onClick={() => setTaskView("kanban")}
                            >
                                Kanban
                            </button>
                            <button
                                className={`pp-toggle-btn ${taskView == "list" ? "is-active" : ""}`}
                                onClick={() => setTaskView("list")}
                            >
                                List
                            </button>
                        </div>
                    </header>
                    <div style={{ padding: 8, maxHeight: "400px", overflowY: "auto" }}>
                        {taskView === "kanban" ? (
                            <KanbanBoard tasks={tasks} onEdit={() => setIsModalOpen(true)} setToBeEdited={setToBeEdited} onDelete={handleDelete} />
                        ) : (
                            <TaskList tasks={tasks} onEdit={() => setIsModalOpen(true)}  setToBeEdited={setToBeEdited} onDelete={handleDelete} />
                        )}
                    </div>
                </section>

                {/* Files section */}
                <section className="pp-card">
                    <header className="pp-card-head">
                        <h2 className="pp-card-title">Files</h2>
                        <div className="pp-actions">
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                className="pp-file-input"
                                onChange={handleUpload}
                                aria-hidden="true"
                                tabIndex={-1}
                            />
                            <button className="pp-btn" onClick={openPicker}>
                                <Upload size={16} /> Upload
                            </button>
                        </div>
                    </header>

                    {files?.length ? (
                        <ul className="pp-file-list">
                            {files.map((f) => (
                                <li className="pp-file-row" key={f.id}>
                                    <div className="pp-file-left">
                                        <div className="pp-file-ico" aria-hidden>
                                            <FileIcon size={16} />
                                        </div>
                                        <div className="pp-file-meta">
                                            <div className="pp-file-name">{f.name}</div>
                                            <div className="pp-file-sub">
                                                <span>{fmtSize(f.size)}</span>
                                                <span className="dot">•</span>
                                                <span>{fmtDate(f.uploadedAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        className="pp-icon-btn"
                                        aria-label={`Delete ${f.name}`}
                                        onClick={() => onDeleteFile(f.id)}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="pp-empty" role="status" aria-live="polite">
                            <div className="pp-empty-card">
                                <div className="pp-empty-ico" aria-hidden>📂</div>
                                <div className="pp-empty-title">No files yet</div>
                                <div className="pp-empty-text">
                                    Upload briefs, assets, specs, or any related documents.
                                </div>
                                <button className="pp-btn pp-btn-primary" onClick={openPicker}>
                                    <Upload size={16} /> Upload Files
                                </button>
                            </div>
                        </div>
                    )}
                </section>
            </main>
            {isModalOpen && (
                <AddTaskModal
                    open={isModalOpen}
                    onClose={() => {setIsModalOpen(false); setToBeEdited(null);}}
                    onSubmit={handleSubmit}
                    onEdit={handleEdit}
                    project={project}
                    task={toBeEdited}
                />
            )}
        </div>
    );
}
