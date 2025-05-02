import { useState, useRef } from "react";
import "./Dashboard.css";
import { Fullscreen, ChevronLeft, ChevronRight } from 'lucide-react';
import CalendarView from "../Calendar/CalendarView";
import OverallProgress from "./OverallProgress";


const demoTasks = [
    {
        _id: "task1",
        title: "Design Meeting",
        description: "Development Task Assign for the product Page project, collaboration with the designer.",
        priority: "High",
        status: "In Progress",
        startDate: "2025-04-28",
        deadline: "2025-05-02",
        projectId: "project123",
        assignedUsers: [
            { _id: "u1", name: "Alice", avatar: "https://randomuser.me/api/portraits/women/2.jpg" },
            { _id: "u2", name: "Bob", avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
            { _id: "u2", name: "Bob", avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
            { _id: "u2", name: "Bob", avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
            { _id: "u2", name: "Bob", avatar: "https://randomuser.me/api/portraits/men/3.jpg" }
        ],
        createdAt: "2025-04-25",
        updatedAt: "2025-04-28"
    },
    {
        _id: "task2",
        title: "Client Meeting",
        description: "Updating the current User Interface of header in the Picko Design project.",
        priority: "Medium",
        status: "Todo",
        startDate: "2025-04-30",
        deadline: "2025-05-03",
        projectId: "project123",
        assignedUsers: [
            { _id: "u3", name: "Charlie", avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
            { _id: "u4", name: "Diana", avatar: "https://randomuser.me/api/portraits/women/2.jpg" },
            { _id: "u5", name: "Evan", avatar: "https://randomuser.me/api/portraits/men/5.jpg" }
        ],
        createdAt: "2025-04-27",
        updatedAt: "2025-04-29"
    },
    {
        _id: "task3",
        title: "Dribble Shot",
        description: "Creating the main UI assets and illustrations for the upcoming landing page screens.",
        priority: "Low",
        status: "In Progress",
        startDate: "2025-04-26",
        deadline: "2025-05-01",
        projectId: "project456",
        assignedUsers: [
            { _id: "u6", name: "Fiona", avatar: "https://randomuser.me/api/portraits/women/2.jpg" },
            { _id: "u1", name: "Alice", avatar: "https://randomuser.me/api/portraits/women/2.jpg" }
        ],
        createdAt: "2025-04-24",
        updatedAt: "2025-04-27"
    },
    {
        _id: "task4",
        title: "Code Refactor",
        description: "Improve project structure and refactor backend routes for task module.",
        priority: "Medium",
        status: "Completed",
        startDate: "2025-04-22",
        deadline: "2025-04-28",
        projectId: "project456",
        assignedUsers: [
            { _id: "u2", name: "Bob", avatar: "https://randomuser.me/api/portraits/men/3.jpg" }
        ],
        createdAt: "2025-04-20",
        updatedAt: "2025-04-28"
    },
    {
        _id: "task5",
        title: "API Integration",
        description: "Integrate OpenAI API for task recommendations and assistance.",
        priority: "High",
        status: "Todo",
        startDate: "2025-05-01",
        deadline: "2025-05-05",
        projectId: "project789",
        assignedUsers: [
            { _id: "u3", name: "Charlie", avatar: "https://randomuser.me/api/portraits/men/5.jpg" }
        ],
        createdAt: "2025-04-29",
        updatedAt: "2025-04-30"
    }
];


const peopleInChat = [
    { _id: "u1", name: "Alice", avatar: "https://randomuser.me/api/portraits/women/2.jpg" },
    { _id: "u2", name: "Bob", avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
    { _id: "u2", name: "Bob", avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
    { _id: "u2", name: "Bob", avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
    { _id: "u2", name: "Bob", avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
    { _id: "u1", name: "Alice", avatar: "https://randomuser.me/api/portraits/women/2.jpg" },
    { _id: "u2", name: "Bob", avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
    { _id: "u2", name: "Bob", avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
    { _id: "u2", name: "Bob", avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
    { _id: "u2", name: "Bob", avatar: "https://randomuser.me/api/portraits/men/3.jpg" }
];

const teamActivityData = [
    {
        name: "Will Loqso",
        role: "Backend Developer",
        message: "How can I buy only the design?",
        timestamp: "5 min ago",
        comments: 34,
        likes: 14,
        shares: 3,
        avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
        name: "Sareh Hosten",
        role: "Project Manager",
        message: "I need react version asap!",
        timestamp: "1 hour ago",
        comments: 34,
        likes: 14,
        shares: 3,
        avatar: "https://randomuser.me/api/portraits/women/45.jpg"
    },
    {
        name: "Jake Brunner",
        role: "Frontend Developer",
        message: "Dark mode looks awesome!",
        timestamp: "10 min ago",
        comments: 12,
        likes: 25,
        shares: 5,
        avatar: "https://randomuser.me/api/portraits/men/28.jpg"
    },
    {
        name: "Linda Tran",
        role: "UX Designer",
        message: "We should test with more users.",
        timestamp: "30 min ago",
        comments: 8,
        likes: 18,
        shares: 2,
        avatar: "https://randomuser.me/api/portraits/women/60.jpg"
    },
    {
        name: "Ravi Nair",
        role: "Mobile Developer",
        message: "Is this compatible with Flutter?",
        timestamp: "2 hours ago",
        comments: 21,
        likes: 9,
        shares: 1,
        avatar: "https://randomuser.me/api/portraits/men/76.jpg"
    },
    {
        name: "Emily Zhang",
        role: "QA Engineer",
        message: "I found some bugs in the demo build.",
        timestamp: "3 hours ago",
        comments: 17,
        likes: 6,
        shares: 0,
        avatar: "https://randomuser.me/api/portraits/women/75.jpg"
    },
    {
        name: "Carlos Méndez",
        role: "DevOps Engineer",
        message: "CI/CD pipeline deployed successfully!",
        timestamp: "4 hours ago",
        comments: 11,
        likes: 22,
        shares: 4,
        avatar: "https://randomuser.me/api/portraits/men/52.jpg"
    }
];


const priorityColors = {
    High: "#b14444",
    Medium: "#ac9656",
    Low: "#499138"
}

const priorityColorsbg = {
    High: "#2E1619",
    Medium: "#2C1F05",
    Low: "#192d12"
}

const Dashboard = () => {


    const scrollRef = useRef(null);

    const scrollLeft = () => {
        scrollRef.current.scrollBy({ left: -150, behavior: "smooth" });
    };

    const scrollRight = () => {
        scrollRef.current.scrollBy({ left: 150, behavior: "smooth" });
    };

    const taskLimit = 3;
    const limitedTasks = demoTasks.slice(0, taskLimit);

    return (
        <div className="dashboard">
            <div className="left-dash">
                <div className="task-grid">
                    {limitedTasks.map((el, index) => {
                        const members = el.assignedUsers.slice(0, 3);
                        const remaining = el.assignedUsers.length - members.length;

                        return <div className="task-card" key={index}>
                            <div className="task-card-header">
                                <h2>{el.title}</h2>
                                <div className="task-priority" style={{ color: priorityColors[el.priority], backgroundColor: priorityColorsbg[el.priority] }}>{el.priority}</div>
                            </div>
                            <p>{el.description}</p>
                            <div className="task-members">
                                <div className="members-pics">
                                    {members.map((mem, idx) => {
                                        return <img className="avatar-img" src={mem.avatar} key={idx} alt={`Avatar ${idx}`}></img>
                                    })}
                                    {remaining > 0 && (<div className="avatar-more"><p>+{remaining}</p></div>)}

                                </div>
                                <div>

                                </div>

                            </div>
                        </div>
                    })}
                    <div className="view-all card">
                        <div>
                            <div><Fullscreen></Fullscreen></div>
                            <p>View All</p>
                        </div>
                    </div>
                </div>
                <div className="dash-calendar"><CalendarView tasks={demoTasks} />
                </div>
            </div>
            <div className="right-dash">
                <div className="progress-container">
                    <OverallProgress></OverallProgress>
                </div>

                <div className="chat-container">
                    <div className="chat-header">
                        <h2>Chat</h2>
                        <p >See all</p>
                    </div>
                    <div className="live-people-container">
                        <div className="live-wrapper">
                            <div className="scroll-btn" onClick={scrollLeft}><ChevronLeft></ChevronLeft></div>
                            <div className="live-people" ref={scrollRef}>
                                {peopleInChat.map((ele, indx) => (
                                    <div key={indx} className="live-card">
                                        <div>
                                            <img src={ele.avatar} alt={ele.name} className="avatar-img-slider"></img>
                                            <div className="live-dot"></div>
                                        </div>
                                        <p className="avatar-name">{ele.name}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="scroll-btn" onClick={scrollRight}><ChevronRight></ChevronRight></div>
                        </div>
                    </div>

                </div>


                <div className="team-activity-container">
                    <div className="team-activity-header">
                        <h2>Team Activity</h2>
                    </div>

                    <div className="team-activity">
                        {teamActivityData.map((el, idx) => (
                            <div className="team-activity-card">
                                <div>
                                    <img src={el.avatar} className="avatar-img-slider"></img>
                                </div>
                                <div>
                                    <div>
                                    <h4 className="member-name">{el.name}</h4>
                                    <p className="member-role">{el.role}</p>
                                    <p>{el.message}</p>
                                    </div>
                                    <div>
                                        <p>{el.timestamp}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

            </div>

        </div>
    )
}

export default Dashboard;