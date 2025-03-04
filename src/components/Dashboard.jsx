import React from 'react';
import "./Dashboard.css";
import Performances from './Performances';
import Projects from './Projects';
import EmployeesList from './EmployeesList';

const Dashboard = ({ section }) => {
  const renderContent = () => {
    switch (section) {
      case 'Dashboard':
        return (
          <div className="dashboard-content">
            <h2 className='dashboard-title'>Dashboard Overview</h2>
            <div className="stats">
              <div className="stat-card">
                <span>Active Employees</span>
                <h3>547</h3>
              </div>
              <div className="stat-card">
                <span>Number of Projects</span>
                <h3>339</h3>
              </div>
              <div className="stat-card">
                <span>Number of Tasks</span>
                <h3>147</h3>
              </div>
              <div className="stat-card">
                <span>Target Percentage Completed</span>
                <h3>89.75%</h3>
              </div>
            </div>
            <div className="notifications">
              <p>Dear Manager, we have observed a decline in [Hermawan]'s performance over the past 2 weeks.</p>
              <button>View Detail</button>
            </div>
            <div className="projects">
              <div className='project-title'><h3>On Going Task</h3></div>
              <div className="project-card">
                <img src="https://image.lexica.art/full_webp/0937fadf-833a-4a7e-983a-209a899677b6" alt="Project" className="project-img" />
                <div>
                  <h4>Journey Scaries</h4>
                  <p>Rebranding and Website Design</p>
                </div>
              </div>
         
              <div className="project-card">
                <img src="https://image.lexica.art/full_webp/0937fadf-833a-4a7e-983a-209a899677b6" alt="Project" className="project-img" />
                <div>
                  <h4>Journey Scaries</h4>
                  <p>Rebranding and Website Design</p>
                </div>
              </div>
         
              <div className="project-card">
                <img src="https://image.lexica.art/full_webp/0937fadf-833a-4a7e-983a-209a899677b6" alt="Project" className="project-img" />
                <div>
                  <h4>Journey Scaries</h4>
                  <p>Rebranding and Website Design</p>
                </div>
              </div>
              {/* Add more project cards as needed */}
            </div>
            <div className="graphs">
              <h3>Graphs and Analysis</h3>
              {/* Placeholder for graphs */}
              <div className="graph-placeholder">Graph Placeholder</div>
            </div>
            <div className="top-performers">
              <h3>Top Performance</h3>
              <div className="performer-list">
                {['Meyna', 'Sebastian', 'Yuliana', 'Reza'].map((name, index) => (
                  <div key={name} className="performer-card">
                    <img src="https://image.lexica.art/full_webp/0937fadf-833a-4a7e-983a-209a899677b6" alt={name} className="performer-img" />
                    <span>{name} - {index + 1}st</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'Performances':
        return <Performances />;
      case 'Projects':
        return <Projects/>
       case 'Employee Task' :
        return <EmployeesList></EmployeesList>
      default:
        return <div className="dashboard-content"><h2>{section} Content</h2></div>;
    }
  };

  return <main className="dashboard">{renderContent()}</main>;
};

export default Dashboard;