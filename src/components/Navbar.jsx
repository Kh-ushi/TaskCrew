import React from 'react';
import "./Navbar.css";
const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <span className="logo">TaskCrew</span>
      </div>
      <div className="nav-right">
        <input type="text" placeholder="Start searching now..." className="search-bar" />
        <div className="profile">
          <img src="https://image.lexica.art/full_webp/0937fadf-833a-4a7e-983a-209a899677b6" alt="Profile" className="profile-img" />
          <div className="profile-details">
            <span className="username">Hey, Markus</span>
            <span className="date">Sunday, June 25, 2024</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;