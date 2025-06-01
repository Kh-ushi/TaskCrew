import React from 'react';
import './ProjectCard.css';
import { PencilLine, Trash2 } from "lucide-react";

const ProjectCard = ({ project, onClick ,onEdit}) => {
  const { name, description, dueDate, members = [], priority } = project;
  return (
    <div className="project-card" onClick={onClick}>
      <div className="project-card-header">
        <h2 className="project-name">{name}</h2>
        {dueDate && (
          <span className="project-due">
            {new Date(dueDate).toLocaleDateString()}
          </span>
        )}
      </div>
      {description && (
        <p className="project-description">{description}</p>
      )}
      {members.length > 0 && (
        <div className="project-members">
          {members.map((m) => (
            <img
              key={m.id}
              src={'https://randomuser.me/api/portraits/women/65.jpg'}
              alt={m.name}
              className="member-avatar"
            />
          ))}
        </div>
      )}
      <div className='project-card-footer'>
        <div className={`status status-${project.priority}`}>{project.priority.toUpperCase()}</div>
        <div className='edit-project'
        ><PencilLine className='edit-icon' onClick={(e) => {
          e.stopPropagation();
          onEdit(project);

        }}></PencilLine>
          <Trash2 className='delete-icon' onClick={(e) => {
            e.stopPropagation();
          }}></Trash2>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
