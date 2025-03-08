import React, { useEffect, useRef } from 'react';
import './PersonalizedDashboard.css';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid'; 

const PersonalizedDashboard = ({ userName = "John", userRole = "Developer" }) => {
  const calendarRef = useRef(null); 

  
  const events = [
    { title: 'Meeting', date: '2025-03-10' },
    { title: 'Task Deadline', date: '2025-03-15' },
  ];

  useEffect(() => {

  }, []);

  return (
    <main className="personal-main">
      <div className="personal-content">
       
        <div className="welcome-box">
          <h2 className="welcome-title">Good Morning, {userName}!</h2>
          <p className="user-info">{userRole} | {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
          <p className="inspire-text">"Keep pushing forward—great things take time."</p>
          <a href="/profile" className="profile-btn">Edit Profile</a>
        </div>

        
        <div className="task-section">
          <h3 className="task-header">My Tasks</h3>
          <div className="task-grid">
            <div className="task-item overdue">
              <span>Overdue Tasks</span>
              <h3>3</h3>
            </div>
            <div className="task-item today">
              <span>Today’s Tasks</span>
              <h3>5</h3>
            </div>
            <div className="task-item upcoming">
              <span>Upcoming Tasks</span>
              <h3>8</h3>
            </div>
            <div className="task-item">
              <span>Progress</span>
              <h3>60%</h3>
            </div>
          </div>
          {/* <button className="task-add-btn">Add New Task</button> */}
        </div>

        
        {/* <div className="project-section">
          <h3 className="project-header">Project Summary</h3>
          <div className="project-list">
            <div className="project-box">
              <img src="https://image.lexica.art/full_webp/0937fadf-833a-4a7e-983a-209a899677b6" alt="Project" className="project-pic" />
              <div>
                <h4>Journey Scaries</h4>
                <p>Rebranding | 75% Complete | Due: Mar 15</p>
              </div>
            </div>
            <div className="project-box">
              <img src="https://image.lexica.art/full_webp/0937fadf-833a-4a7e-983a-209a899677b6" alt="Project" className="project-pic" />
              <div>
                <h4>Team Sync</h4>
                <p>App Dev | 40% Complete | Due: Mar 20</p>
              </div>
            </div>
          </div>
        </div> */}

        
        <div className="alert-box">
          <p>Task "Wireframe Design" is overdue by 2 days.</p>
          <button className="alert-btn">View Details</button>
        </div>

        
        <div className="calendar-section">
          <h3 className="calendar-header">Calendar</h3>
          <div className="calendar-wrapper">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              events={events}
              height="auto" 
              headerToolbar={{
                left: 'prev,next',
                center: 'title',
                right: 'today'
              }}
            />
          </div>
          <p className="absence-info">Upcoming Absence: Mar 10 (Approved)</p>
        </div>

       
        <div className="insight-section">
          <h3 className="insight-header">Productivity Insights</h3>
          <div className="insight-placeholder">Weekly Stats Placeholder</div>
          <p className="insight-data">Completed: 12/20 tasks this week | Efficiency: 85%</p>
        </div>

        
        <div className="quick-section">
          <h3 className="quick-header">Quick Actions</h3>
          <div className="quick-grid">
            {/* <button className="quick-btn">Create Task</button> */}
            <button className="quick-btn">Request Absence</button>
            <button className="quick-btn">View Projects</button>
            {/* <button className="quick-btn">Customize Dashboard</button> */}
          </div>
        </div>

       
        <div className="goal-section">
          <h3 className="goal-header">Personal Goals</h3>
          <p className="goal-info">Goal: Finish 5 tasks by Friday - 80% Complete</p>
        </div>
      </div>
    </main>
  );
};

export default PersonalizedDashboard;