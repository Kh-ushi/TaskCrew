import React from 'react';
import './AddProjectCard.css';

const AddProjectCard = ({ onClick }) => (
  <div className="add-card" onClick={onClick}>
    <span className="add-icon">＋</span>
    <span className="add-text">Add Project</span>
  </div>
);

export default AddProjectCard;
