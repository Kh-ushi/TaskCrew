
import "./Dashboard.css";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import AdminDashboard from "./AdminDashboard";
import React, { useState } from "react";

const Dashboard = () => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="dashboard">
            <div className="dashboard-left">
                <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} ></Sidebar>
            </div>
            <div className={`dashboard-right ${collapsed ? 'collapsed-effect' : ''}`}>
                <div className="navbar-container">
                    <Navbar></Navbar>
                </div>
                <div className="dashboard-main-content">
                    <AdminDashboard></AdminDashboard>
                </div>

            </div>
        </div>


    )
}

export default Dashboard;