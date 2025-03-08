import React, { useState } from 'react';
import "./Sidebar.css";

const Sidebar = ({ onSelect }) => {
  const [selectedItem, setSelectedItem] = useState('Dashboard'); 

  const menuItems = [
    { name: 'Dashboard', icon: '📊' },
    // { name: 'Performances', icon: '📈' },
    { name: 'Projects', icon: '📋' },
    { name: 'Employee Task', icon: '👤' },
    { name: 'Absence', icon: '⛔' },
    { name: 'Analytics', icon: '📉' },
    { name: 'Client List', icon: '👥' },
    { name: 'Notification', icon: '🔔' },
    { name: 'Help Center', icon: '❓' },
    { name: 'Personalized Dashboard', icon: '👤' },
  ];

  const handleSelect = (name) => {
    setSelectedItem(name); 
    onSelect(name);
  };

  return (
    <aside className="sidebar">
      {menuItems.map((item) => (
        <div
          key={item.name}
          className={`sidebar-item ${selectedItem === item.name ? 'active' : ''}`} 
          onClick={() => handleSelect(item.name)}
        >
          <span>{item.icon}</span>
          <span>{item.name}</span>
        </div>
      ))}
    </aside>
  );
};

export default Sidebar;
