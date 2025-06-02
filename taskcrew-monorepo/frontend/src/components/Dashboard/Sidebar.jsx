import React, { useState } from 'react';
import {
  FiHome,
  FiFolder,
  FiCheckSquare,
  FiUsers,
  FiBarChart2,
  FiUserX,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import {CircleCheckBig} from "lucide-react";
import './Sidebar.css';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: FiHome },
  // { id: 'projects',  label: 'Projects',  icon: FiFolder, to: '/projects' },
  { id: 'tasks',     label: 'Tasks',     icon: FiCheckSquare},
  { id: 'team',      label: 'Team',      icon: FiUsers},
  { id: 'analysis',  label: 'Analysis',  icon: FiBarChart2},
  { id: 'absence',   label: 'Absence',   icon: FiUserX},
];

export default function Sidebar({ collapsed,setCollapsed,setActivePage }) {
  
  const toggle = () => setCollapsed((c) => !c);

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
            {!collapsed && <span className="logo-text">TaskCrew</span>}
            <CircleCheckBig className="logo-icon" />
        </div>
        <button className="collapse-btn" onClick={toggle}>
          {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
        </button>
      </div>
      <nav className="sidebar-nav">
        {navItems.map(({ id, label, icon: Icon}) => (
          <a
            key={id}
            // href={to}
            className={`nav-item`}
            onClick={()=>setActivePage(id)}
          >
            <Icon className="nav-icon" />
            {!collapsed && <span className="nav-label">{label}</span>}
          </a>
        ))}
      </nav>
    </aside>
  );
}
