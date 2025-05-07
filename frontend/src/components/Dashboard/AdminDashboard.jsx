import './AdminDashboard.css';
import Sidebar from './Sidebar';
// import Navbar from './Navbar';
import Dashboard from './Dashboard';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import CommonNav from '../CommonNav/CommonNav';
import TaskAddForm from '../Forms/TaskAddForm';
import axios from "axios";
import AllTaskPage from './AllTaskPage';

const AdminDashboard = () => {

    const location = useLocation();
    const token = localStorage.getItem("token");
    const backendURL = import.meta.env.VITE_BACKEND_URL;

    const [projectDetails, setProjectDetails] = useState(location.state?.projectDetails);

    const [selectedOption, setSelectedOption] = new useState("Dashboard");
    const [isOpenTaskForm, setIsOpenTaskForm] = useState(false);

    const [isViewAll, setIsViewAll] = useState(false);


    const fetchProjectDetails = async () => {
        try {
            const response = await axios.get(`${backendURL}/api/gateway/getProjectDetails/${projectDetails._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status == 201) {
                setProjectDetails(response.data.details);
            }

        }
        catch (error) {
            console.log(error.response);
        }
    };


    return (
        <div className='admin-dashboard'>
            <Sidebar selectedOption={selectedOption} setSelectedOption={setSelectedOption} setIsOpenTaskForm={setIsOpenTaskForm}></Sidebar>
            <div className='admin-navbar-container'><CommonNav afterLogin={false}></CommonNav></div>
            <div className='main-dashboard-content'>
                <Dashboard demoTasks={projectDetails?.tasks || []} setIsViewAll={setIsViewAll}></Dashboard>
                {isOpenTaskForm && (
                    <TaskAddForm
                        onClose={() => {
                            setIsOpenTaskForm(false);
                            fetchProjectDetails();
                        }}
                        isOpenTaskForm={isOpenTaskForm}
                        projectId={projectDetails._id}
                    />
                )}

                {isViewAll && (
                    <AllTaskPage demoTasks={projectDetails?.tasks || []} onClose={()=>setIsViewAll(false)}></AllTaskPage>
                )}

            </div>
        </div>
    )
};

export default AdminDashboard;