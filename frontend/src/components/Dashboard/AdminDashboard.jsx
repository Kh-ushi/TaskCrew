import './AdminDashboard.css';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Dashboard from './Dashboard';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import CommonNav from '../CommonNav/CommonNav';
import TaskAddForm from '../Forms/TaskAddForm';

const AdminDashboard = () => {

    const location = useLocation();
    const projectDetails = location.state?.projectDetails;
    console.log(projectDetails);

    const [selectedOption, setSelectedOption] = new useState("Dashboard");
    const [isOpenTaskForm, setIsOpenTaskForm] = useState(false);

    return (
        <div className='admin-dashboard'>
            <Sidebar selectedOption={selectedOption} setSelectedOption={setSelectedOption} setIsOpenTaskForm={setIsOpenTaskForm}></Sidebar>
            <div className='admin-navbar-container'><CommonNav afterLogin={false}></CommonNav></div>
            <div className='main-dashboard-content'>
                <Dashboard></Dashboard>
                {isOpenTaskForm && (
                    <TaskAddForm
                        onClose={() => setIsOpenTaskForm(false)}
                        isOpenTaskForm={isOpenTaskForm}
                        projectId={projectDetails._id}
                    />
                )}

            </div>
        </div>
    )
};

export default AdminDashboard;