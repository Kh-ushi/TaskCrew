import './AdminDashboard.css';
import { LayoutList, SquareCheckBig, Target, TimerOff } from "lucide-react";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);


const AdminDashboard = () => {

    const metaInfo = [
        { icon: <LayoutList className='icon' />, title: 'Total Tasks', value: '120' },
        { icon: <SquareCheckBig className='icon' />, title: 'Completed Tasks', value: '85' },
        { icon: <Target className='icon' />, title: 'Pending Tasks', value: '35' },
        { icon: <TimerOff className='icon' />, title: 'Overdue Tasks', value: '5' }
    ];

    return (
        <div className="admin-dashboard">
            <div className='admin-upper'>
                <div className='admin-upper-left'>
                    <h1>Welcome back, Khushi</h1>
                    <p>Manage users, view reports & configure settings efficiently.</p>
                </div>
                <div className='admin-upper-right'>
                    <select className='filter-select'>
                        <option value="month">This Month</option>
                        <option value="week">This Week</option>
                        <option value="day">Today</option>
                    </select>
                    <button className='report-button'>Download Report</button>
                </div>
            </div>

            <div className='admin-middle'>
                {metaInfo.map((item, index) => (
                    <div className='admin-meta-card' key={index}>
                        <div className='admin-meta-icon'>
                            {item.icon}
                        </div>
                        <div className='admin-meta-info'>
                            <h3>{item.title}</h3>
                            <p>{item.value}</p>
                        </div>
                    </div>
                ))}

            </div>
            <div className='admin-lower'>
                <div className='admin-lower-left'>
                    <h3 className='graph-title'>Project Progress</h3>
                    <Bar
                        data={{
                            labels: ['Task1', 'Task2', 'Task3', 'Task4','Task5'],
                            datasets: [
                                {
                                    label: 'Progress (%)',
                                    data: [75, 45, 90, 60,70],
                                    backgroundColor: '#7a4eff',
                                    borderRadius: 6,
                                },
                            ],
                        }}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    max: 100,
                                },
                            },
                            plugins: {
                                legend: {
                                    display: false,
                                },
                            },
                        }}
                    />
                </div>

                <div className='admin-lower-right'>

                </div>

            </div>
        </div>
    );
}

export default AdminDashboard;

