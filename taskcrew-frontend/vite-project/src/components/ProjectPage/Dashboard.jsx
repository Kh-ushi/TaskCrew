import "./Dashboard.css";
import ProgressSummaryBar from "./ProgressSummaryBar";

const Dashboard = () => {
    return (
        <div className="dashboard">
            <div className="project-space-header">
                <div className="project-space-title">
                    <h1>Hi,Khushi</h1>
                    <h1>Let's Manage Your Team !!</h1>
                </div>
                <div className="add-task-button">
                    <button>Add Task &nbsp; +</button>
                </div>
            </div>
            <div><ProgressSummaryBar /></div>
        </div>
    );
};

export default Dashboard;