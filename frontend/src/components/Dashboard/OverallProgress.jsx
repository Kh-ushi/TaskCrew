import './OverallProgress.css';

import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import {ChartNoAxesCombined,DatabaseBackup,Loader} from "lucide-react";

const data = [
    { name: "M", value: 10 },
    { name: "T", value: 14 },
    { name: "W", value: 18 },
    { name: "T", value: 16 },
    { name: "F", value: 24 },
    { name: "S", value: 12 },
    { name: "S", value: 8 },
];

const OverallProgress = () => {
    return (
        <div className="overall-progress">

            <div className='progress-header'>
                <h2>Overall Progress</h2>
                <select>
                    <option>Last 7 days</option>
                </select>
            </div>

            <div className='overall-progress-container'>

                <div className='progress-stats'>
                    <div><ChartNoAxesCombined size={20}></ChartNoAxesCombined> <p>24 In Progress</p></div>
                    <div> <DatabaseBackup size={20}></DatabaseBackup><p>45 Total Project</p></div>
                    <div><Loader></Loader> <p>12 Upcoming</p></div>
                </div>

                <div className='responsive-container'>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <XAxis dataKey="name" stroke="#f3d69a" />
                            <Tooltip
                                contentStyle={{ backgroundColor: "#101010", border: "none" }}
                                labelStyle={{ color: "#fff" }}
                                itemStyle={{ color: "#fff" }}
                            />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#f3d69a"
                                strokeWidth={3}
                                dot={{ r: 5, stroke: "#f3d69a", strokeWidth: 2, fill: "#111" }}
                                activeDot={{ r: 6, stroke: "#f5d76e", strokeWidth: 3, fill: "#111" }}
                            />

                        </LineChart>
                    </ResponsiveContainer>

                </div>

            </div>

        </div>
    )
}

export default OverallProgress;