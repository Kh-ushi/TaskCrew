import React, { useState } from 'react';
import './ProjectDetails.css';
import AddTaskForm from './AddTaskForm';

import { 
  Edit, 
  Plus, 
  Trash2, 
  Users, 
  Calendar, 
  AlertTriangle, 
  FileText, 
  Download, 
  Search, 
  Filter 
} from 'lucide-react';

const projectData = {
  id: 'P123',
  title: 'Project Alpha',
  description: 'Rebranding and website design for client XYZ.',
  status: 'Active',
  priority: 'High',
  startDate: '2025-01-15',
  deadline: '2025-03-15',
  manager: { name: 'Jane Doe', email: 'jane.doe@example.com' },
  tasks: [
    { id: 1, title: 'Wireframe Design', status: 'To-Do', assignee: 'John', dueDate: '2025-02-10', priority: 'High' },
    { id: 2, title: 'Logo Redesign', status: 'In Progress', assignee: 'Alice', dueDate: '2025-02-20', priority: 'Medium' },
    { id: 3, title: 'Website Launch', status: 'Completed', assignee: 'Bob', dueDate: '2025-03-10', priority: 'Low' },
    { id: 4, title: 'Wireframe Design', status: 'To-Do', assignee: 'John', dueDate: '2025-02-10', priority: 'High' },
  ],
  team: [
    { name: 'John Smith', role: 'Designer', avatar: 'https://image.lexica.art/full_webp/05c2df6d-3e9e-44bc-9686-34de23d252eb' },
    { name: 'Alice Johnson', role: 'Developer', avatar: 'https://image.lexica.art/full_webp/05c2df6d-3e9e-44bc-9686-34de23d252eb' },
  ],
  milestones: [
    { name: 'Wireframe Approval', dueDate: '2025-02-15', completed: false },
    { name: 'Final Launch', dueDate: '2025-03-15', completed: false },
  ],
  files: [
    { name: 'Wireframe.pdf', url: '#', uploaded: '2025-01-20' },
    { name: 'Wireframe.pdf', url: '#', uploaded: '2025-01-20' },
    { name: 'Wireframe.pdf', url: '#', uploaded: '2025-01-20' },
    { name: 'Wireframe.pdf', url: '#', uploaded: '2025-01-20' },
    { name: 'Wireframe.pdf', url: '#', uploaded: '2025-01-20' },
    { name: 'Wireframe.pdf', url: '#', uploaded: '2025-01-20' },
    
  ],
  activityLog: [
    { action: 'Task "Wireframe Design" created', user: 'Jane Doe', timestamp: '2025-01-15' },
    { action: 'Task "Logo Redesign" updated', user: 'Alice Johnson', timestamp: '2025-02-01' },
  ],
  progress: 60, 
};

const ProjectDetails = () => {
  const [project, setProject] = useState(projectData);
  const [taskView, setTaskView] = useState('Kanban'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');

  const[showAddTask,setShowAddTask]=useState(false);

  
  const filteredTasks = project.tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'All' || task.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });


  const kanbanGroups = {
    'To-Do': filteredTasks.filter(task => task.status === 'To-Do'),
    'In Progress': filteredTasks.filter(task => task.status === 'In Progress'),
    'Completed': filteredTasks.filter(task => task.status === 'Completed'),
  };

  return (
    <main className="details-main">
      <div className="details-content">

        <div className="details-header">
          <div className="header-info">
            <h1 className="header-title">{project.title} <span className="header-id">#{project.id}</span></h1>
            <p className="header-desc">{project.description}</p>
            <div className="header-meta">
              <span className={`status-pill ${project.status.toLowerCase()}`}>{project.status}</span>
              <span className={`priority-pill ${project.priority.toLowerCase()}`}>
                Priority: {project.priority}
              </span>
              <span>Start: {project.startDate}</span>
              <span>Deadline: {project.deadline}</span>
              <span>Manager: <a href={`mailto:${project.manager.email}`}>{project.manager.name}</a></span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${project.progress}%` }}></div>
            </div>
            <div className="ai-insight">
              <AlertTriangle size={16} color="red" /> At risk of missing the deadline by 5 days.
            </div>
          </div>
          <div className="header-actions">
            <button className="action-btn"><Edit size={16} /> Edit Project</button>
          </div>
        </div>

       
        
        <div className="task-board">

          <div className="task-board-header">

           <div className="task-board-header-left">
           <h2>Tasks</h2>
            <div className="search-bar">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search tasks, members, milestones..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="details-filters">
          
          <div className="filter-group">
            <select onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="All">Status: All</option>
              <option value="To-Do">To-Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <select onChange={(e) => setFilterPriority(e.target.value)}>
              <option value="All">Priority: All</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

           </div>


            <div className="view-toggle">
              <button
                className={taskView === 'Kanban' ? 'active' : ''}
                onClick={() => setTaskView('Kanban')}
              >
                Kanban
              </button>
              <button
                className={taskView === 'List' ? 'active' : ''}
                onClick={() => setTaskView('List')}
              >
                List
              </button>
            </div>
          </div>

          {taskView === 'Kanban' ? (
            <div className="kanban-board">
              {Object.keys(kanbanGroups).map((status) => (
                <div key={status} className="kanban-column">
                  <h3>{status}</h3>
                  {kanbanGroups[status].map((task) => (
                    <div key={task.id} className="task-card">
                      <h4>{task.title}</h4>
                      <p>Assigned: {task.assignee}</p>
                      <p>Due: {task.dueDate}</p>
                      <span className={`priority-tag ${task.priority.toLowerCase()}`}>
                        {task.priority}
                      </span>
                      <div className="task-actions">
                        <button><Edit size={14} /> Edit</button>
                        <button><Trash2 size={14} /> Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="list-view">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Assigned</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((task) => (
                    <tr key={task.id}>
                      <td>{task.title}</td>
                      <td>{task.assignee}</td>
                      <td>{task.dueDate}</td>
                      <td>{task.status}</td>
                      <td><span className={`priority-tag ${task.priority.toLowerCase()}`}>{task.priority}</span></td>
                      <td className='list-view-actions'>
                        <button><Edit size={14} /> Edit</button>
                        <button><Trash2 size={14} /> Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <button className="add-task-btn" onClick={()=>setShowAddTask(true)} ><Plus size={16} /> Add New Task</button>
        </div>

        
        <div className="team-section">
          <h2>Team Members</h2>
          <div className="team-list">
            {project.team.map((member, index) => (
              <div key={index} className="team-member">
                <img src={member.avatar} alt={member.name} className="member-avatar" />
                <div>
                  <p>{member.name}</p>
                  <p className="member-role">{member.role}</p>
                </div>
              </div>
            ))}
            
          </div>
          <button className="add-member-btn"><Users size={16} /> Add Member</button>
        </div>

            
        <div className="timeline-section">
          <h2>Timeline & Milestones</h2>
          <div className="milestone-list">
            {project.milestones.map((milestone, index) => (
              <div key={index} className="milestone-item">
                <Calendar size={16} /> {milestone.name} - Due: {milestone.dueDate} 
                <span className={milestone.completed ? 'completed' : ''}>
                  {milestone.completed ? ' (Completed)' : ''}
                </span>
              </div>
            ))}
          </div>
        </div>

        
        <div className="activity-section">
          <h2>Activity Log</h2>
          <div className="activity-list">
            {project.activityLog.map((log, index) => (
              <div key={index} className="activity-item">
                <p>{log.action} by {log.user} on {log.timestamp}</p>
              </div>
            ))}
          </div>
        </div>

        
        <div className="analytics-section">
          <h2>Analytics & Reports</h2>
          <div className="analytics-grid">
            <div className="analytics-card">
              <p>Project Completion Rate</p>
              <h3>{project.progress}%</h3>
            </div>
            <div className="analytics-card">
              <p>Overdue Tasks</p>
              <h3>{project.tasks.filter(t => new Date(t.dueDate) < new Date()).length}</h3>
            </div>
            <div className="analytics-card">
              <p>Team Productivity</p>
              <h3>{project.team.length} Members</h3>
            </div>
          </div>
          <button className="report-btn"><FileText size={16} /> Generate Report</button>
        </div>

       
        {/* <div className="files-section">
          <h2>Files & Resources</h2>
          <div className="file-list">
            {project.files.map((file, index) => (
              <div key={index} className="file-item">
                <FileText size={16} /> {file.name} (Uploaded: {file.uploaded})
                <a href={file.url} download><Download size={16} /></a>
              </div>
            ))}
          </div>
          <button className="upload-btn"><Plus size={16} /> Add File</button>
        </div> */}

        
        <div className="settings-section">
          <h2>Settings</h2>
          <div className="settings-actions">
            <button className="settings-btn"><Edit size={16} /> Edit Project Info</button>
            <button className="settings-btn"><Trash2 size={16} /> Archive Project</button>
          </div>
        </div>

        
        {/* <div className="quick-actions-panel">
          <h3>Quick Actions</h3>
          <button className="panel-btn"><Plus size={16} /> Add New Task</button>
          <button className="panel-btn"><Users size={16} /> Invite Members</button>
          <button className="panel-btn"><FileText size={16} /> Generate Report</button>
          <button className="panel-btn"><Trash2 size={16} /> Archive Project</button>
        </div> */}
      </div>

      {showAddTask && (
        <AddTaskForm
        onSave={(data)=>{
        console.log('Task Saved:',data);
        setShowAddTask(false);
        }}

         onCancel={()=>setShowAddTask(false)}
         projectId="P123" 
        />
      )}
    </main>
  );
};

export default ProjectDetails;