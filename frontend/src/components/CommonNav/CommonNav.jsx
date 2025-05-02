import './CommonNav.css';
import { CircleCheckBig, Search, Bell } from "lucide-react";

const CommonNav = ({ afterLogin }) => {
    return (
        <div className="common-nav">
            {afterLogin && (
                <div className='common-nav-logo'>
                    <CircleCheckBig size={30} />
                    <h2>TaskCrew</h2>
                </div>
            )}

            <div className='search-bar'>
                <Search size={20} />
                <input type='text' placeholder='Search tasks, projects...' />
            </div>

            <div className='common-nav-user'>
                <Bell size={22} />
                <div className='user-info'>
                    <p className="username">ShellBy</p>
                    <p className="user-role">Project Manager</p>
                </div>
                <div className='common-nav-avatar'>
                    <img src="/avatars/shellby.png" alt="user avatar" />
                </div>
            </div>
        </div>
    );
}

export default CommonNav;
