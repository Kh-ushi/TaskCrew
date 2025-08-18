import React from "react";
import "./AllProjects.css";
import Navbar from "../Navbar/NavBar";
import ProjectGrid from "../ProjectGrid/ProjectGrid";

export default function AllProjects() {
  return (
    <div className="ap-page">
      <Navbar />

      {/* Hero / Greeting */}
      <section className="ap-hero">
        <div className="ap-hero-left">
          {/* <nav className="ap-crumbs" aria-label="Breadcrumb">
            <a href="#home">Home</a>
            <span aria-hidden>›</span>
            <span>Projects</span>
          </nav> */}

          <h1 className="ap-title">Hi, Khushi</h1>
          <p className="ap-subtitle">
            Maintain projects and team — keep everything organized and polished.
          </p>
        </div>

        <div className="ap-hero-actions">
          <button className="ap-btn ap-btn-primary"> + New Project</button>
          {/* <button className="ap-btn ap-btn-ghost">Invite Member</button> */}
        </div>
      </section>

      {/* Grid */}
      <main className="ap-content">
        <ProjectGrid />
      </main>
    </div>
  );
}
