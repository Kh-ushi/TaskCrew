import React from "react";
import "./Sidebar.css";
import {
  FiHome,
  FiUsers,
  FiLayers,
  FiSmile,
  FiBarChart2,
  FiClipboard,
  FiSettings,
} from "react-icons/fi";
import Logo from "../../assets/taskcrew-logo.png";

const Sidebar = () => {
  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <img src={Logo} alt="TaskCrew" />
      </div>

      {/* Navigation Icons */}
      <div className="sidebar-icons">
        <button className="sidebar-icon purple" title="Dashboard">
          <FiHome size={22} />
        </button>

        <button className="sidebar-icon pink" title="Members">
          <FiUsers size={22} />
        </button>

        <button className="sidebar-icon orange" title="Spaces">
          <FiLayers size={22} />
        </button>

        <button className="sidebar-icon yellow" title="Clients">
          <FiSmile size={22} />
        </button>

        <button className="sidebar-icon green" title="Analytics">
          <FiBarChart2 size={22} />
        </button>

        <button className="sidebar-icon magenta" title="Tasks">
          <FiClipboard size={22} />
        </button>

        <button className="sidebar-icon blue" title="Settings">
          <FiSettings size={22} />
        </button>
      </div>

      {/* <div className="sidebar-user">
        <button className="sidebar-icon">
          <FiSettings size={22} />
        </button>
      </div> */}
    </div>
  );
};

export default Sidebar;
