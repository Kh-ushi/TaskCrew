import React from 'react';
import './Navbar.css';
import { Search, MessageCircleMore, Bell,NotebookTabs,FolderKanban,CalendarDays} from "lucide-react";

const Navbar = ({activePage,activeTab,setActiveTab}) => {
  console.log(activeTab);
  return (
    <div className='navbar'>
      <div className='navbar-left'>
        {activePage === 'tasks' && (
          <div className='navbar-left-tabs'>
           <div onClick={()=>setActiveTab('List')} className={`${activeTab=='List'?'list-active':''}`}><span><NotebookTabs></NotebookTabs></span>List</div>
           <div onClick={()=>setActiveTab('Board')} className={`${activeTab=='Board'?'board-active':''}`}><span><FolderKanban></FolderKanban></span>Board</div>
           <div onClick={()=>setActiveTab('Calendar')} className={`${activeTab=='Calendar'?'calendar-active':''}`}><span><CalendarDays></CalendarDays></span>Calendar</div>
          </div>
          )}
      </div>

      <div className='navbar-right'>
        <div className="search-container">
          <Search className="icon" />
          <input type="text" placeholder="Search..." className="search-input" />
        </div>

        <button className="icon-button">
          <MessageCircleMore className="icon" />
        </button>

        <button className="icon-button">
          <Bell className="icon" />
        </button>

        <img
          src="https://avatars.githubusercontent.com/u/12345678?v=4"
          alt="User Avatar"
          className="user-avatar"
        />
      </div>
    </div>
  );
}

export default Navbar;
