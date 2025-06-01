import { useState } from 'react'
import './App.css'

import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import Login from './components/Login';
import Signup from './components/Signup';
import ProjectsPage from './components/ProjectsPage';
import Dashboard from './components/Dashboard/Dashboard';



function App() {

// Dummy avatar placeholders
const AVATAR_A = 'https://randomuser.me/api/portraits/women/68.jpg';
const AVATAR_B = 'https://randomuser.me/api/portraits/men/65.jpg';
const AVATAR_C = 'https://randomuser.me/api/portraits/women/44.jpg';

// Dummy data
const dummyProjects = [
  {
    id: 'p1',
    name: 'Website Redesign',
    description: 'Revamp the homepage and landing pages to boost conversions.',
    dueDate: '2025-06-15T00:00:00.000Z',
    members: [
      { id: 'u1', name: 'Alice', avatarUrl: AVATAR_A },
      { id: 'u2', name: 'Bob',   avatarUrl: AVATAR_B },
    ],
  },
  {
    id: 'p2',
    name: 'Mobile App Launch',
    description: 'Build and deploy the Android & iOS apps.',
    dueDate: '2025-07-01T00:00:00.000Z',
    members: [
      { id: 'u2', name: 'Bob',     avatarUrl: AVATAR_B },
      { id: 'u3', name: 'Carla',   avatarUrl: AVATAR_C },
      { id: 'u1', name: 'Alice',   avatarUrl: AVATAR_A },
    ],
  },
  {
    id: 'p3',
    name: 'Marketing Campaign',
    description: 'Plan and execute Q3 marketing outreach.',
    dueDate: '2025-08-10T00:00:00.000Z',
    members: [
      { id: 'u3', name: 'Carla',   avatarUrl: AVATAR_C },
    ],
  },
  {
    id: 'p4',
    name: 'Backend Refactor',
    description: 'Improve microservices performance and scalability.',
    dueDate: '2025-09-30T00:00:00.000Z',
    members: [
      { id: 'u1', name: 'Alice',   avatarUrl: AVATAR_A },
      { id: 'u3', name: 'Carla',   avatarUrl: AVATAR_C },
    ],
  },
];

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<ProjectsPage/>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
