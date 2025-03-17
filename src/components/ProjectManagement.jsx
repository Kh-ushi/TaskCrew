import React, { useState } from 'react';
import './ProjectManagement.css';
import {Search,Plus} from 'lucide-react';
import AddProjectForm from './AddProjectForm';
import axios from 'axios';

const ProjectManagement = () => {
  
  const [showAddProjectForm, setShowAddProjectForm] = useState(false);

  const handleAddProject=async(formData)=>{
    console.log("New Project Data:", formData);
    
    try{
      const response=await axios.post('http://localhost:5000/api/projects/add',formData);
      if(response.status==201){
        console.log("Project added successfully:",response.data); 
        alert("Project added successfully");
        setShowAddProjectForm(false);
      }
      else{
        console.error("Failed to add project:",response.data);
        alert("Failed to add project. Please try again.");
      }
    }
    catch(error){
      console.error("Error adding project:",error);
      alert("An error occurred while adding the project. Please try again.");
    }

  }

  const projects = [
    { id: 1, name: 'Project Alpha', status: 'Ongoing', tasksInProgress: 8, deadline: '7 days' },
    { id: 2, name: 'Project Bravo', status: 'Completed', tasksCompleted: 15, deadline: 'Today' },
    { id: 3, name: 'Project BravoX', status: 'Upcoming', totalTasks: 25, deadline: 'Not set' },
    { id: 4, name: 'Project Charlie', status: 'Ongoing', tasksInProgress: 12, deadline: '4 days' },
    { id: 5, name: 'Project DeltaX', status: 'Ongoing', tasksInProgress: 5, deadline: '8 days' },
    { id: 6, name: 'Project DeltaSmart', status: 'Completed', tasksCompleted: 22, deadline: '12 Dec 2023' },
    { id: 7, name: 'Project FoxtrotPlus', status: 'Completed', tasksCompleted: 10, deadline: '5 days ago' },
    { id: 8, name: 'Project FusionIntel', status: 'Completed', tasksCompleted: 8, deadline: '3 days ago' },
    { id: 9, name: 'Project FathomAI', status: 'Upcoming', totalTasks: 20, deadline: 'Not set' },
  ];


  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

 
  const filteredProjects = projects.filter((project) => {
    const matchesFilter = filter === 'All' || project.status === filter;
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });


  const counts = {
    All: projects.length,
    Completed: projects.filter(p => p.status === 'Completed').length,
    Ongoing: projects.filter(p => p.status === 'Ongoing').length,
    Upcoming: projects.filter(p => p.status === 'Upcoming').length,
  };

  return (
    <main className="proj-main">
      <div className="proj-content">
        <div className="proj-header">
          <div className="proj-title">
            <h2>All Projects</h2>
            <select className="proj-year-dropdown">
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
            </select>

            <div className="proj-search-container">
            
            <input
              type="text"
              className="proj-search"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            /> 
            <Search className="proj-search-icon"/>
            </div>
          </div>

          <div className="proj-insights">
            <div className="insight-card">
              <span className="insight-icon">⏱</span>
              <p>Team efficiency has increased by 15% compared to the previous month.</p>
            </div>
            <div className="insight-card">
              <span className="insight-icon">📊</span>
              <p>Project Alpha is at risk of a potential reviewing task allocation.</p>
            </div>
          </div>


          <div className="proj-filters">
          <div className="proj-filter-container">
            <button
              className={`filter-btn ${filter === 'All' ? 'active' : ''}`}
              onClick={() => setFilter('All')}
            >
              All ({counts.All})
            </button>
            <button
              className={`filter-btn ${filter === 'Completed' ? 'active' : ''}`}
              onClick={() => setFilter('Completed')}
            >
              Completed ({counts.Completed})
            </button>
            <button
              className={`filter-btn ${filter === 'Ongoing' ? 'active' : ''}`}
              onClick={() => setFilter('Ongoing')}
            >
              Ongoing ({counts.Ongoing})
            </button>
            <button
              className={`filter-btn ${filter === 'Upcoming' ? 'active' : ''}`}
              onClick={() => setFilter('Upcoming')}
            >
              Upcoming ({counts.Upcoming})
            </button>
            </div>

            <div className="add-project-btn">
                <button className="add-btn" onClick={()=>setShowAddProjectForm(true)}>
                    +
                    Add Project
                </button>

                {
                  showAddProjectForm && (
                    <AddProjectForm 
                    onSave={handleAddProject}
                    onCancel={()=>setShowAddProjectForm(false)}
                    />
                  )
                }
            </div>
          </div>
        </div>

    
        <div className="proj-grid">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <div key={project.id} className={`proj-card ${project.status.toLowerCase()}`}>
                <h3 className="proj-name">{project.name}</h3>
                <div className="proj-details">
                  {project.status === 'Ongoing' && (
                    <p>📋 {project.tasksInProgress} in progress</p>
                  )}
                  {project.status === 'Completed' && (
                    <p>📋 {project.tasksCompleted} completed</p>
                  )}
                  {project.status === 'Upcoming' && (
                    <p>📋 {project.totalTasks} tasks</p>
                  )}
                  <p>⏳ {project.deadline}</p>
                </div>
                <span className={`status-tag ${project.status.toLowerCase()}`}>
                  {project.status}
                </span>
              </div>
            ))
          ) : (
            <p className="no-results">No projects found.</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default ProjectManagement;