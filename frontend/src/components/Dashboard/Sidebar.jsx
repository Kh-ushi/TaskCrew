import "./Sidebar.css";
import { CircleCheckBig, LayoutDashboard, UsersRound, Mails, ChartSpline, CalendarDays } from "lucide-react";

const sideBarOptions = [
    { option: "Dashboard", icon: LayoutDashboard },
    { option: "Team", icon: UsersRound },
    { option: "Analytics", icon: ChartSpline },
    { option: "Messages", icon: Mails },
    { option: "Calendar", icon: CalendarDays }
];

const Sidebar = ({ selectedOption, setSelectedOption }) => {
    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <span><CircleCheckBig /></span> <h2>TaskCrew</h2>
            </div>
            <div className="sidebar-option-container">
                {sideBarOptions.map((el, index) => {
                    const Icon = el.icon;
                    return (
                        <div 
                            key={index}
                            className={`sidebar-option ${selectedOption === el.option ? "selected-option" : ""}`}
                            onClick={() => setSelectedOption(el.option)}
                        >
                            <span><Icon /></span>
                            <p>{el.option}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Sidebar;
