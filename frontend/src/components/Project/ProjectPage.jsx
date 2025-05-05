import './ProjectPage.css';
import CommonNav from '../CommonNav/CommonNav';
import NewProjectForm from '../Forms/NewProjectForm';
import { Plus } from "lucide-react";
import { useState, useEffect } from 'react';
import axios from 'axios';

// const demoProjects = [
//     {
//         _id: "proj1",
//         title: "Website Redesign",
//         description: "A full redesign of the company website including UI/UX improvements.",
//         createdBy: "user1",
//         teamMembers: ["user1", "user2", "user3"],
//         status: "Active",
//         tasks: ["task1", "task2", "task3"],
//         startDate: "2025-04-01",
//         deadline: "2025-05-15",
//         priority: "High",
//         chatRoomId: "chat-room-1",
//         recommendedNextSteps: [
//             "Finalize homepage wireframe",
//             "Review color palette with design team",
//             "Assign responsive testing"
//         ],
//         analytics: {
//             completedTasks: 5,
//             pendingTasks: 3,
//             overdueTasks: 1
//         },
//         createdAt: "2025-04-01",
//         updatedAt: "2025-04-25"
//     },
//     {
//         _id: "proj2",
//         title: "AI Integration",
//         description: "Integrate OpenAI API for task recommendation and deadline prediction.",
//         createdBy: "user2",
//         teamMembers: ["user2", "user4"],
//         status: "On Hold",
//         tasks: ["task4", "task5"],
//         startDate: "2025-03-15",
//         deadline: "2025-04-30",
//         priority: "Medium",
//         chatRoomId: "chat-room-2",
//         recommendedNextSteps: [
//             "Review API token limits",
//             "Create user prompt templates"
//         ],
//         analytics: {
//             completedTasks: 2,
//             pendingTasks: 1,
//             overdueTasks: 0
//         },
//         createdAt: "2025-03-15",
//         updatedAt: "2025-04-10"
//     },
//     {
//         _id: "proj3",
//         title: "Mobile App Launch",
//         description: "Prepare marketing strategy and final QA for Android & iOS release.",
//         createdBy: "user3",
//         teamMembers: ["user3", "user5", "user6"],
//         status: "Completed",
//         tasks: ["task6", "task7", "task8", "task9"],
//         startDate: "2025-02-01",
//         deadline: "2025-03-20",
//         priority: "High",
//         chatRoomId: "chat-room-3",
//         recommendedNextSteps: [],
//         analytics: {
//             completedTasks: 9,
//             pendingTasks: 0,
//             overdueTasks: 0
//         },
//         createdAt: "2025-02-01",
//         updatedAt: "2025-03-22"
//     }
// ];


const backendURL=import.meta.env.VITE_BACKEND_URL;
const token=localStorage.getItem("token");

const ProjectPage = () => {

    const [demoProjects,setDemoProjects]=useState([]);

    useEffect(() => {

        const getAllProjects = async () => {
            try {
                const response = await axios.get(`${backendURL}/api/gateway/getProjectInfo`,{
                  headers:{
                    Authorization:`Bearer ${token}`
                  }
                });
                console.log(response);
                if(response.status==201){
                    setDemoProjects(response.data.allProjects);s
                }
            }
            catch (error) {
                console.log(error);
            }
        };

        getAllProjects();

    }, []);

    const [isOpenForm, setIsOpenForm] = useState(false);

    const calculateDays = (startDate, deadline) => {
        const timeDiff = new Date(deadline).getTime() - new Date(startDate).getTime();
        const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return daysLeft;
    };

    return (
        <div className="project-page">
            <div className="project-page-header">
                <CommonNav afterLogin={true}></CommonNav>
            </div>
            <div className="projects-container">
                {demoProjects.map((ele, idx) => {
                    const leftDays = calculateDays(ele.startDate, ele.deadline);
                    const statusColorClass =
                        ele.status === "Active"
                            ? "status-active"
                            : ele.status === "On Hold"
                                ? "status-on-hold"
                                : "status-completed";

                    return (
                        <div key={idx} className="project-card">
                            <div className="proj-header">
                                <div className="proj-img">
                                    <img src={ele.image?ele.image:"https://image.lexica.art/full_webp/19682eab-189f-41b8-8975-e91ae4fddc78"} alt={ele.title} />
                                </div>
                                <div className={`proj-status ${statusColorClass}`}>
                                    {ele.status}
                                </div>
                            </div>
                            <div className="proj-desc">
                                <h2>{ele.title}</h2>
                                <p>{ele.description}</p>
                            </div>
                            <div className="proj-footer">
                                <span className="days-left">
                                    {leftDays > 0 ? `${leftDays} days left` : "Deadline passed"}
                                </span>
                                <span className="priority-tag">{ele.priority}</span>
                            </div>
                        </div>
                    );
                })}
                <div className="add-proj" onClick={() => setIsOpenForm(true)}>
                    <div className="add-proj-sign">
                        <Plus size={40} />
                    </div>
                    <h2>Add New Project</h2>
                </div>

            </div>

            {isOpenForm && (
                <NewProjectForm onClose={() => setIsOpenForm(false)} isOpenForm={isOpenForm} />
            )}
        </div>
    );
};

export default ProjectPage;