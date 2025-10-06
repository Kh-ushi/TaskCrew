
import './Overview.css';
import { FiFolder, FiList, FiClock, FiCheckCircle, FiTrendingUp, FiCalendar } from "react-icons/fi";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect } from 'react';
import ManageProjects from './ManageProjects';
import axios from "axios";
import { useState } from 'react';

const Overview = ({ projectMetrics, spaceId }) => {

    const [metrics, setMetrics] = useState({});

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const { data } = await axios.get(`${BACKEND_URL}/api/metrics/progress/${spaceId}`, {
                    headers: {
                        authorization: `Bearer ${token}`
                    }
                });
                console.log(data.data);
                setMetrics(data.data);
            }
            catch (error) {
                console.log(error);
            }
        };
        fetchMetrics();

    }, []);

    const cards = [
        {
            title: "Total Projects",
            value: projectMetrics?.projectsTotal || 0,
            sub: "Compare 35 (last month)",
            icon: <FiFolder />,
            gradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
        },
        {
            title: "To-Do",
            value: projectMetrics?.projectBuckets?.["to-do"] || 0,
            sub: "Compare 9 (last month)",
            icon: <FiList />,
            gradient: "linear-gradient(135deg, #3b82f6, #2563eb)",
        },
        {
            title: "In Progress",
            value: projectMetrics?.projectBuckets?.["in-progress"] || 0,
            sub: "Compare 15 (last month)",
            icon: <FiClock />,
            gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
        },
        {
            title: "Completed",
            value: projectMetrics?.projectBuckets?.completed || 0,
            sub: "Compare 11 (last month)",
            icon: <FiCheckCircle />,
            gradient: "linear-gradient(135deg, #22c55e, #16a34a)",
        },
    ];

    const data = [
        { week: "W1", progress: 45 },
        { week: "W2", progress: 60 },
        { week: "W3", progress: 78 },
        { week: "W4", progress: 90 },
    ];

    const tasks = [
        {
            id: 1,
            title: "Follow-ups",
            date: "Apr 1",
            completed: 3,
            total: 4,
            desc: "AI reminders to client follow-ups and check-ins.",
        },
        {
            id: 2,
            title: "Contract Review",
            date: "Apr 2",
            completed: 1,
            total: 2,
            desc: "AI review and approval of contracts.",
        },
        {
            id: 3,
            title: "Invoices",
            date: "Apr 3",
            completed: 1,
            total: 5,
            desc: "Notify customers about payment.",
        },
    ];

    const performers = [
        {
            name: "Sophie Turner",
            role: "Frontend Engineer",
            tasks: 48,
            avatar: "https://i.pravatar.cc/60?img=5",
        },
        {
            name: "Sam Smith",
            role: "Backend Engineer",
            tasks: 45,
            avatar: "https://i.pravatar.cc/60?img=7",
        },
        {
            name: "Ava Johnson",
            role: "UI/UX Designer",
            tasks: 42,
            avatar: "https://i.pravatar.cc/60?img=3",
        },
        {
            name: "Liam Brown",
            role: "DevOps Specialist",
            tasks: 40,
            avatar: "https://i.pravatar.cc/60?img=8",
        },
    ];


    const getLast4Weeks = () => {

        const today = new Date();

        const startOfWeek = new Date(today);

        startOfWeek.setDate(today.getDate() - today.getDay() + 1);
        startOfWeek.setHours(0, 0, 0, 0);

        console.log(startOfWeek);

        const weeks = [];

        for (let i = 3; i >= 0; i--) {
            const weekStart = new Date(startOfWeek);
            weekStart.setDate(startOfWeek.getDate() - i * 7);
            weeks.push(weekStart.toISOString().split("T")[0]);
        }

        return weeks;
    }

    const weeks = getLast4Weeks();

    const weeklyProgress = metrics?.weeklyProgress || [];
    console.log(weeklyProgress);

    const progressMap = weeklyProgress.reduce((acc, w) => {
        const weekKey = w._id.split("T")[0];
        acc[weekKey] = w.progress;
        return acc;
    }, {});

    const chartData = weeks.map(week => ({
        week,
        progress: progressMap[week] || 0
    }));


    return (
        <div className="overview">
            <div className='left-overview'>
                <div className="stats-wrapper">
                    {cards.map((card, i) => (
                        <div className="elegant-card" key={i}>
                            <div className="card-header">
                                <h4 className="card-title">{card.title}</h4>
                                <div
                                    className="icon-badge"
                                    style={{ background: card.gradient }}
                                >
                                    {card.icon}
                                </div>
                            </div>

                            <div className="card-value">{card.value}</div>
                            <div className="card-sub">{card.sub}</div>

                            {/* <div className="card-dots">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div> */}
                        </div>
                    ))}
                </div>

                <div className="progress-card">
                    <div className="progress-header">
                        <h3>Project Progress (Last 4 Weeks)</h3>
                        <div className="progress-icon">
                            <FiTrendingUp />
                        </div>
                    </div>
                    <div className="progress-chart">
                        <ResponsiveContainer width="100%" height={180}>
                            <BarChart data={chartData} barCategoryGap="15%" barGap={4}>
                                <XAxis
                                    dataKey="week"
                                    stroke="#a1a1aa"
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    cursor={{ fill: "rgba(255,255,255,0.05)" }}
                                    contentStyle={{
                                        background: "#1e2230",
                                        border: "none",
                                        borderRadius: "10px",
                                        color: "#fff",
                                    }}
                                />
                                <Bar
                                    dataKey="progress"
                                    fill="url(#barGradient)"
                                    radius={[12, 12, 0, 0]}
                                    barSize={40}
                                />
                                <defs>
                                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#8b5cf6" />
                                        <stop offset="100%" stopColor="#3b82f6" />
                                    </linearGradient>
                                </defs>
                            </BarChart>
                        </ResponsiveContainer>

                        <div className="progress-line"></div>
                        <div className="progress-indicator"></div>
                    </div>


                    <div className="progress-footer">
                        <div className="progress-stat">
                            <span>Current</span>
                            <h2>{metrics.currentProgress}%</h2>
                        </div>
                        <div className="progress-center-icon">
                            <div className="circle-icon">
                                <FiTrendingUp />
                            </div>
                        </div>
                        <div className="progress-stat">
                            <span>Projected</span>
                            <h2>{metrics.projectedProgress}%</h2>
                        </div>
                    </div>
                </div>

                <ManageProjects></ManageProjects>

            </div>
            <div className='right-overview'>

                <div className="priority-card">
                    <div className="priority-header">
                        <h3>Priority tasks</h3>
                        <a href="#" className="see-all">See All</a>
                    </div>

                    <div className="priority-list">
                        {tasks.map((task) => {
                            const progress = (task.completed / task.total) * 100;
                            return (
                                <div className="task-item" key={task.id}>
                                    <div className="task-main">
                                        <h4>{task.title}</h4>
                                        <div className="task-date">
                                            <FiCalendar /> {task.date}
                                        </div>
                                        <div className="task-progress">
                                            <div className="progress-circle">
                                                <div
                                                    className="progress-fill"
                                                    style={{ background: `conic-gradient(#8b5cf6 ${progress * 3.6}deg, rgba(255,255,255,0.1) 0deg)` }}
                                                ></div>
                                            </div>
                                            <p>
                                                {task.completed}/{task.total} Completed
                                            </p>
                                        </div>
                                    </div>
                                    <p className="task-desc">{task.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="top-performers-card">
                    <h2 className="tp-title">🏆 Top Performers</h2>
                    <p className="tp-subtitle">Recognizing the stars of this sprint ✨</p>

                    <div className="tp-list">
                        {performers.map((p, index) => (
                            <div className="tp-item" key={index}>
                                <div className="tp-left">
                                    <span className="rank">#{index + 1}</span>
                                    <img src={p.avatar} alt={p.name} className="tp-avatar" />
                                    <div>
                                        <h4>{p.name}</h4>
                                        <p>{p.role}</p>
                                    </div>
                                </div>
                                <div className="tp-right">
                                    <FiTrendingUp className="tp-icon" />
                                    <span>{p.tasks} Tasks</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>


            </div>
        </div>
    )
};

export default Overview;