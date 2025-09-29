import React from "react";
import "./Navbar.css";
import { FiBell } from "react-icons/fi";

const Navbar = () => {
  return (
    <nav className="navbar">
      {/* 🌟 Logo */}
      <div className="navbar-left">
        {/* <img
          src="/logo.svg" // replace with your TaskCrew logo path
          alt="TaskCrew"
          className="navbar-logo"
        /> */}
        <h1 className="navbar-title">TaskCrew</h1>
      </div>

      {/* 🔔 Right Side */}
      <div className="navbar-right">
        <div className="navbar-icon notification">
          <FiBell size={22} />
          <span className="notification-badge">3</span>
        </div>

        <div className="profile">
          <img
            src="https://i.pravatar.cc/40" // dummy avatar (replace with real user photo)
            alt="Profile"
            className="profile-img"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
