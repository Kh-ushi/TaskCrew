import "./Dashboard.css";
import ProgressSummaryBar from "./ProgressSummaryBar";
import CreateTaskModal from "./CreateTaskModal";
import { useState } from "react";
import api from "../../utils/axiosInstance";


const Dashboard = ({ projectId }) => {
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [taskError, setTaskError] = useState("");

    const handleAddTaskClick = () => {
        setIsTaskModalOpen(true);
    };

    const handleTaskModalClose = () => {
        setIsTaskModalOpen(false);
    };

    const handleCreateTask = async (task) => {
        try {
            task.projectId = projectId;
            const { data } = await api.post("/api/tasks", task);
            handleTaskModalClose();
        }
        catch (error) {
            if (error?.response?.data?.message) {
                setTaskError(error.response.data.message);
            }
            else {
                setTaskError("Failed to create task");
            }
            console.error("Failed to create task", error);
        }

    };

    const handleEditTask = (task) => {
        setIsTaskModalOpen(false);
    };

    return (
        <div className="dashboard">
            <div className="project-space-header">
                <div className="project-space-title">
                    <h1>Hi,Khushi</h1>
                    <h1>Let's Manage Your Team !!</h1>
                </div>
                <div className="add-task-button">
                    <button onClick={handleAddTaskClick}>Add Task &nbsp; +</button>
                </div>
            </div>
            <div><ProgressSummaryBar /></div>
            {isTaskModalOpen && (
                <CreateTaskModal
                    isOpen={isTaskModalOpen}
                    onClose={handleTaskModalClose}
                    onCreate={handleCreateTask}
                    handleEdit={handleEditTask}
                    taskInfo={null}
                    taskError={taskError}
                    setTaskError={setTaskError}
                />
            )}
        </div>
    );
};

export default Dashboard;