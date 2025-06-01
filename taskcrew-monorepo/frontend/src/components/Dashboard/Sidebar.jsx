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
  { id: 'dashboard', label: 'Dashboard', icon: FiHome, to: '/dashboard' },
  // { id: 'projects',  label: 'Projects',  icon: FiFolder, to: '/projects' },
  { id: 'tasks',     label: 'Tasks',     icon: FiCheckSquare, to: '/tasks' },
  { id: 'team',      label: 'Team',      icon: FiUsers, to: '/team' },
  { id: 'analysis',  label: 'Analysis',  icon: FiBarChart2, to: '/analysis' },
  { id: 'absence',   label: 'Absence',   icon: FiUserX, to: '/absence' },
];

export default function Sidebar({ collapsed,setCollapsed,active}) {
  
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
        {navItems.map(({ id, label, icon: Icon, to }) => (
          <a
            key={id}
            href={to}
            className={`nav-item ${active === id ? 'active' : ''}`}
          >
            <Icon className="nav-icon" />
            {!collapsed && <span className="nav-label">{label}</span>}
          </a>
        ))}
      </nav>
    </aside>
  );
}
