// src/components/EmployeesList.js
import React, { useState } from 'react';
import './EmployeesList.css';

const EmployeesList = () => {
  // Demo data for employees and their projects
  const employees = [
    { id: 1, name: 'Sonia Hoppe', email: 'hao-sonia92@gmail.com', linkedin: true, docs: 4, likes: 1, comments: 1 },
    { id: 2, name: 'Wilbur Hackett', email: 'wilbur-hackett@yahoo.com', linkedin: true, docs: 2, likes: 0, comments: 1 },
    { id: 3, name: 'Annette Dickinson', email: 'anet-son@hotmail.com', linkedin: true, docs: 4, likes: 2, comments: 2 },
    { id: 4, name: 'Loretta Luettgen', email: 'lor-luettgen@hotmail.com', linkedin: true, docs: 4, likes: 0, comments: 2 },
    { id: 5, name: 'Melissa Bartoletti', email: 'melbart0@gmail.com', linkedin: true, docs: 4, likes: 2, comments: 2 },
    { id: 6, name: 'Keith Hirtle', email: 'keith-hirtle@yahoo.com', linkedin: true, docs: 3, likes: 1, comments: 1 },
    { id: 7, name: 'Angela Von', email: 'angela93@gmail.com', linkedin: true, docs: 4, likes: 2, comments: 2 },
    { id: 8, name: 'Gina Steuber', email: 'gina-stu32@gmail.com', linkedin: true, docs: 4, likes: 2, comments: 2 },
    { id: 9, name: 'Lisa Harvey', email: 'helo-lisaa@hotmail.com', linkedin: true, docs: 4, likes: 1, comments: 1 },
    { id: 10, name: 'Caroline Stracke', email: 'carolines@yahoo.com', linkedin: true, docs: 4, likes: 0, comments: 1 },
  ];

  // Demo project data for each employee
  const employeeProjects = {
    1: [
      { id: 1, name: 'Journey Scaries', status: 'Active', completion: 90 },
      { id: 2, name: 'Web App & Dashboard', status: 'Done', completion: 100 },
    ],
    2: [
      { id: 3, name: 'Rebranding and Website Design', status: 'Active', completion: 75 },
      { id: 4, name: 'Edifier', status: 'On Hold', completion: 60 },
    ],
    3: [
      { id: 5, name: 'CNN Rebranding and Social Media Content', status: 'Active', completion: 50 },
    ],
    4: [
      { id: 6, name: 'Journey Scaries', status: 'Done', completion: 95 },
    ],
    5: [
      { id: 7, name: 'Web App & Dashboard', status: 'Active', completion: 67 },
      { id: 8, name: 'Rebranding and Website Design', status: 'On Hold', completion: 80 },
    ],
    6: [
      { id: 9, name: 'Edifier', status: 'Active', completion: 70 },
    ],
    7: [
      { id: 10, name: 'CNN Rebranding and Social Media Content', status: 'Done', completion: 85 },
    ],
    8: [
      { id: 11, name: 'Journey Scaries', status: 'On Hold', completion: 55 },
    ],
    9: [
      { id: 12, name: 'Web App & Dashboard', status: 'Active', completion: 65 },
    ],
    10: [
      { id: 13, name: 'Rebranding and Website Design', status: 'Done', completion: 95 },
    ],
  };

  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
  };

  const closeModal = () => {
    setSelectedEmployee(null);
  };

  return (
    <div className="emp-card-content">
      <h2 className="emp-card-title">Employee List</h2>
      <div className="emp-card-grid">
        {employees.map((employee) => (
          <div
            key={employee.id}
            className="emp-card-item"
            onClick={() => handleEmployeeClick(employee)}
          >
            <img src="https://image.lexica.art/full_webp/298f81dc-2b2e-4b43-a564-62b6428a3add" alt={`${employee.name}'s profile`} className="emp-card-img" />
            <div className="emp-card-info">
              <h3 className="emp-card-name">{employee.name}</h3>
              <p className="emp-card-email">{employee.email}</p>
              {/* <div className="emp-card-metrics">
                <span className="emp-card-metric">
                  <i className="fas fa-file-alt"></i> {employee.docs}
                </span>
                <span className="emp-card-metric">
                  <i className="fas fa-heart"></i> {employee.likes}
                </span>
                <span className="emp-card-metric">
                  <i className="fas fa-comment"></i> {employee.comments}
                </span>
              </div> */}
              {employee.linkedin && <span className="emp-card-linkedin">LinkedIn</span>}
            </div>
          </div>
        ))}
      </div>

      {selectedEmployee && (
        <div className="emp-card-modal-overlay" onClick={closeModal}>
          <div className="emp-card-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="emp-card-modal-title">{selectedEmployee.name}'s Projects</h3>
            <button className="emp-card-modal-close" onClick={closeModal}>
              ×
            </button>
            <div className="emp-card-modal-projects">
              {employeeProjects[selectedEmployee.id].map((project) => (
                <div key={project.id} className="emp-card-project-card">
                  <h4>{project.name}</h4>
                  <p>Status: <span className={`emp-card-status-${project.status.toLowerCase()}`}>{project.status}</span></p>
                  <p>Completion: {project.completion}%</p>
                  <div className="emp-card-progress-bar">
                    <div
                      className="emp-card-progress-fill"
                      style={{ width: `${project.completion}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeesList;