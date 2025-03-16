import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './index.css';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import LandingPage from "./components/LandingPage";
import SignUp from './components/SignUp';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('token'));
  const [activeSection, setActiveSection] = useState('Dashboard');

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleSidebarSelect = (section) => {
    setActiveSection(section);
  };

  return (
    <Router>
      <Routes>
        <Route path='/' element={isAuthenticated ? <LandingPage /> : <Navigate to='/signup' />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/dashboard' element={
          isAuthenticated ? (
            <div className="app">
              <Navbar />
              <div className="main-container">
                <Sidebar onSelect={handleSidebarSelect} />
                <Dashboard section={activeSection} />
              </div>
            </div>
          ) : (
            <Navigate to='/signup' />
          )
        } />
      </Routes>
    </Router>
  );
}

export default App;
