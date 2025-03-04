// src/components/Projects.js
import React from 'react';
import "./Projects.css";

const Projects = () => {
  const projects = [
    { id: 1, name: 'Journey Scaries', tasksDone: 45, totalTasks: 50, completion: 90, startDate: '2024-06-01', endDate: '2024-09-01' },
    { id: 2, name: 'Rebranding and Website Design', tasksDone: 30, totalTasks: 40, completion: 75, startDate: '2024-07-01', endDate: '2024-10-01' },
    { id: 3, name: 'Web App & Dashboard', tasksDone: 20, totalTasks: 30, completion: 67, startDate: '2024-08-01', endDate: '2024-11-01' },
    { id: 4, name: 'Edifier', tasksDone: 15, totalTasks: 25, completion: 60, startDate: '2024-05-01', endDate: '2024-08-01' },
    { id: 5, name: 'CNN Rebranding and Social Media Content', tasksDone: 10, totalTasks: 20, completion: 50, startDate: '2024-09-01', endDate: '2024-12-01' },
  ];

  const handleCardClick = (project) => {
    console.log(`Clicked on ${project.name}'s card`);
  };

  const handleAddProject = () => {
    console.log('Add Project button clicked');

  };

  return (
    <div className="proj-content">
      <div className="proj-header">
        <h2 className="proj-title">Project Overview</h2>
        <button className="proj-add-button" onClick={handleAddProject}>
          Add Project
        </button>
      </div>
      <div className="proj-cards">
        {projects.map((project) => (
          <div
            key={project.id}
            className="proj-card"
            onClick={() => handleCardClick(project)}
          >
            <img
              src="https://image.lexica.art/full_webp/298f81dc-2b2e-4b43-a564-62b6428a3add"
              alt={`${project.name} project`}
              className="proj-img"
            />
            <div className="proj-details">
              <h3>{project.name}</h3>
              <p>Tasks: {project.tasksDone}/{project.totalTasks}</p>
              <p>Completion: {project.completion}%</p>
              <div className="proj-progress-bar">
                <div
                  className="proj-progress-fill"
                  style={{ width: `${project.completion}%` }}
                ></div>
              </div>
              <p>Start Date: {project.startDate}</p>
              <p>End Date: {project.endDate}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;