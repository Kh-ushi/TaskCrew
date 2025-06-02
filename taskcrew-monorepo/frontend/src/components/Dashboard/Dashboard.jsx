
import "./Dashboard.css";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import AdminDashboard from "./AdminDashboard";
import TaskPage from "./TaskPage";
import React, { useState } from "react";
import { useParams } from "react-router-dom";

const Dashboard = () => {
    const { id } = useParams(); 
    // console.log("Dashboard ID:", id); 
    const [collapsed, setCollapsed] = useState(false);

    const [activePage, setActivePage] = useState('dashboard');
    const [activeTab, setActiveTab] = useState('List');

    const renderPage = () => {
        switch (activePage) {
            case 'dashboard':
                return <AdminDashboard />;
            case 'tasks':
                return <TaskPage activeTab={activeTab} projectId={id}/>;
            default:
                return <div>Select a page</div>;
        }
    };

    return (
        <div className="dashboard">
            <div className="dashboard-left">
                <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} setActivePage={setActivePage}></Sidebar>
            </div>
            <div className={`dashboard-right ${collapsed ? 'collapsed-effect' : ''}`}>
                <div className="navbar-container">
                    <Navbar activePage={activePage} activeTab={activeTab} setActiveTab={setActiveTab}></Navbar>
                </div>
                <div className="dashboard-main-content">
                    {renderPage()}
                </div>

            </div>
        </div>


    )
}

export default Dashboard;