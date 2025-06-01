import React from 'react';
import './Navbar.css';
import { Search, MessageCircleMore, Bell } from "lucide-react";

const Navbar = () => {
  return (
    <div className='navbar'>
      <div className='navbar-left'>

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
