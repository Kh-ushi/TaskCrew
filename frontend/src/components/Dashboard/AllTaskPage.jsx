import './AllTaskPage.css';

const AllTaskPage = ({ demoTasks, onClose }) => {
    return (
        <div className="all-task-page">
            <div className="all-task-container">
                <div className="header-section">
                    <h2 className="all-task-heading">All Tasks</h2>
                    <button className="close-icon" onClick={onClose}>✕</button>
                </div>
                <p className="all-task-subtext">View all tasks in this project</p>
                <div className="task-list">
                    {demoTasks.map((el, idx) => {
                        const members = el.assignee.slice(0, 3);
                        const statusColorClass =
                            el.status === "Active"
                                ? "status-active"
                                : el.status === "On Hold"
                                ? "status-on-hold"
                                : "status-completed";

                        return (
                            <div key={idx} className="all-task-card">
                                <div className="all-task-header">
                                    <h2>{el.title}</h2>
                                    <div className="priority-tag">{el.priority}</div>
                                </div>
                                <div className="all-task-desc">
                                    <p>{el.description}</p>
                                </div>
                                <div className="all-task-meta">
                                    <span>{el.startDate}</span>
                                    <span>{el.dueDate}</span>
                                    <span className={`task-status ${statusColorClass}`}>
                                        {el.status}
                                    </span>
                                </div>
                                <div className="members-pics">
                                    {members.map((mem, idx) => (
                                        <img
                                            className="avatar-all-task-img"
                                            src={mem?.avatar || `https://randomuser.me/api/portraits/women/2.jpg`}
                                            key={idx}
                                            alt={`Avatar ${idx}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default AllTaskPage;