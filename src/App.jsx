import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import './index.css';

function App() {
  const [activeSection, setActiveSection] = useState('Dashboard');

  const handleSidebarSelect = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="app">
      <Navbar />
      <div className="main-container">
        <Sidebar onSelect={handleSidebarSelect} />
        <Dashboard section={activeSection} />
      </div>
    </div>
  );
}

export default App;
