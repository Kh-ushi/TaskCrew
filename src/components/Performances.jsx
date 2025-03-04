
import React from 'react';

import "./Performances.css";

const Performances = () => {

  const teamMembers = [
    { id: 1, name: 'Meyna', performance: 95, role: 'Developer' },
    { id: 2, name: 'Sebastian', performance: 88, role: 'Designer' },
    { id: 3, name: 'Yuliana', performance: 92, role: 'Manager' },
    { id: 4, name: 'Reza', performance: 85, role: 'Analyst' },
    { id: 5, name: 'Hermawan', performance: 78, role: 'Engineer' },
  ];

  const handleCardClick = (member) => {
    console.log(`Clicked on ${member.name}'s card`);
   
  };

  return (
    <div className="performances-content">
      <h2 className='performance-title'>Team Member Performances</h2>
      <div className="performance-cards">
        {teamMembers.map((member) => (
          <div
            key={member.id}
            className="performance-card"
            onClick={() => handleCardClick(member)}
          >
            <img
              src="https://image.lexica.art/full_webp/88dc260f-c656-42e7-a262-5fc0fce77562"
              alt={`${member.name}'s profile`}
              className="member-img"
            />
            <div className="member-details">
              <h3>{member.name}</h3>
              <p>Role: {member.role}</p>
              <p>Performance: {member.performance}%</p>
              {member.name === 'Hermawan' && (
                <p className="alert">Performance decline noted over the past 2 weeks</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Performances;
