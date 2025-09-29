import React, { useState } from "react";
import "./ManageProjects.css";
import { FiMoreVertical } from "react-icons/fi";

const ManageProjects = () => {
  const [activeTab, setActiveTab] = useState("Priority");

  const tabs = [
    { name: "Priority", count: 3 },
    { name: "Active", count: 4 },
    { name: "Completed" },
    { name: "Canceled" },
    { name: "Recommended", count: 3 },
  ];

  const projects = [
    {
      id: 1,
      name: "Sophie T.",
      username: "@sophie.turner",
      avatar: "https://i.pravatar.cc/40?img=1",
      task: "Garden Grove Designs",
      desc: "Mobile Application Design",
      dueOn: "Apr 2",
      price: "$25",
      status: "High",
    },
    {
      id: 2,
      name: "Sam S.",
      username: "@sam.smith",
      avatar: "https://i.pravatar.cc/40?img=2",
      task: "Flora & Fauna Studio",
      desc: "Online Shopping Platform",
      dueOn: "Apr 3",
      price: "$50",
      status: "Easy",
    },
  ];

  return (
    <div className="manage-card">
      <div className="manage-header">
        <h3>Manage Projects</h3>
        <div className="tabs">
          {tabs.map((tab) => (
            <div
              key={tab.name}
              className={`tab ${activeTab === tab.name ? "active" : ""}`}
              onClick={() => setActiveTab(tab.name)}
            >
              {tab.name}
              {tab.count && <span className="count">{tab.count}</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="projects-table">
        <div className="table-header">
          <div>Name</div>
          <div>Task</div>
          <div>Due On</div>
          <div>Price</div>
          <div>Status</div>
          <div>More</div>
        </div>

        {projects.map((p) => (
          <div className="table-row" key={p.id}>
            <div className="name-cell">
              <img src={p.avatar} alt={p.name} />
              <div>
                <h4>{p.name}</h4>
                <p>{p.username}</p>
              </div>
            </div>

            <div className="task-cell">
              <h4>{p.task}</h4>
              <p>{p.desc}</p>
            </div>

            <div>{p.dueOn}</div>
            <div>{p.price}</div>

            <div className={`status ${p.status.toLowerCase()}`}>{p.status}</div>

            <div className="more">
              <FiMoreVertical />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageProjects;
