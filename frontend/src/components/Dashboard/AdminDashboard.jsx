import './AdminDashboard.css';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Dashboard from './Dashboard';
import { useState } from 'react';

const AdminDashboard=()=>{

    const[selectedOption,setSelectedOption]=new useState("Dashboard");

    return(
        <div className='admin-dashboard'>
         <Sidebar selectedOption={selectedOption} setSelectedOption={setSelectedOption}></Sidebar>
         <Navbar></Navbar>
         <div className='main-dashboard-content'>
         <Dashboard></Dashboard>
         </div>
        </div>
    )
};

export default AdminDashboard;