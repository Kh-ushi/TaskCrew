import React, { useState, useEffect } from "react";
import "./Projects.css";
import axios from "axios";
import { FiMoreVertical, FiPlus, FiEdit2, FiTrash2, FiUserPlus } from "react-icons/fi";
import CreateProjectModal from "./CreateProjectModal";
import ProjectDetailsModal from "./ProjectDetailsModal";
import AddProjectMembersModal from "../Common/AddProjectMembersModal";

const Projects = ({ spaceId, projectMetrics }) => {

  console.log(projectMetrics);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const [openProjectModal, setOpenProjectModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [menuOpen, setMenuOpen] = useState(null);
  const [editProject, setEditProject] = useState(null);
  const [openProjectDetails, setOpenProjectDetails] = useState(false);
  const [project, setProject] = useState(null);
  const [openAddMembersModal, setOpenAddMembersModal] = useState(false);

  useEffect(() => {
    const fetchAllProjects = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const { data } = await axios.get(`${BACKEND_URL}/api/project/space/${spaceId}`, {
          headers: {
            authorization: `Bearer ${token}`
          }
        });
        setProjects(data);
      }
      catch (error) {
        console.log(error);
      }

    };
    fetchAllProjects();
  }, []);



  const handleAddProject = async (payload) => {
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.post(`${BACKEND_URL}/api/project/space/${spaceId}`, payload, {
        headers: {
          authorization: `Bearer ${token}`
        }
      });
      const { message, project } = data;
      setProjects((prev) => [...prev, project]);
      alert(message);
      setOpenProjectModal(false);
    }
    catch (error) {
      console.log(error);
    }
  };

  const handleEditProject = async (payload, projectId) => {
    try {
      console.log(payload);
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.put(`${BACKEND_URL}/api/project/${projectId}`, payload, {
        headers: {
          authorization: `Bearer ${token}`
        }
      });
      const { message, project } = data;
      setProjects((prev) => (
        prev.map((p) => {
          if (p._id == project._id) return project;
          return p;
        })
      ));
      alert(message);
      setOpenProjectModal(false);
    }
    catch (error) {
      console.log(error);
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.delete(`${BACKEND_URL}/api/project/${projectId}`, {
        headers: {
          authorization: `Bearer ${token}`
        }
      });
      const { message, project } = data;
      setProjects((prev) => (
        prev.filter((p) => p._id !== project._id)
      ));
      alert(message);
    }
    catch (error) {
      console.log(error);
    }
  }


  const handleAddMembers = async (members) => {
    try {
      console.log("Adding members:", members);
      const token = localStorage.getItem("accessToken");

      const { data } = await axios.post(
        `${BACKEND_URL}/api/project/${project._id}`,
        { members },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log(data);
      const { message, project: updatedProject } = data;

      console.log(updatedProject);

      setProjects((prev) =>
        prev.map((p) => (p._id === updatedProject._id ? updatedProject : p))
      );

      alert(message);
      setOpenAddMembersModal(false);
    } catch (error) {
      console.error("Error adding members:", error);
      alert("❌ Failed to add members");
    }
  };




  return (
    <div className="projects-container">
      {/* 📁 Left: Project Table */}
      <div className="projects-left">
        <div className="projects-header">
          <h2>Manage Projects</h2>
          <button className="add-project-btn" onClick={() => {
            setEditProject(null);
            setOpenProjectModal(true)
          }}>
            <FiPlus /> Add New Project
          </button>
        </div>

        <div className="projects-table">
          <div className="table-header">
            <div>Name</div>
            <div>Start Date</div>
            <div>End Date</div>
            <div>Members</div>
            <div>Status</div>
            <div>Priority</div>
            <div>State</div>
            <div>More</div>
          </div>


          {projects.map((p) => (
            <div className="table-row" key={p._id} onClick={() => {
              setProject(p)
              setOpenProjectDetails(true)
            }}>
              <div className="name-cell">
                <h4>{p.name}</h4>
                {/* <p>{p.description?.slice(0, 40) || "No description"}</p> */}
              </div>

              <div>{new Date(p.startDate).toLocaleDateString()}</div>
              <div>{new Date(p.endDate).toLocaleDateString()}</div>
              <div className="members-count">{p.members?.length || 0}</div>

              <div>
                <span className={`badge status-badge ${p.status}`}>
                  {p.status}
                </span>
              </div>

              <div>
                <span className={`badge priority-badge ${p.priority?.toLowerCase()}`}>
                  {p.priority || "medium"}
                </span>
              </div>

              <div>
                <span className={`badge state-badge ${p.state}`}>
                  {p.state?.replace("-", " ")}
                </span>
              </div>

              <div className="more" onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(menuOpen === p._id ? null : p._id)
              }}
              ><FiMoreVertical /></div>
              {menuOpen === p._id && (
                <div className="action-menu" style={{ "zIndex": "99999" }} onMouseLeave={() => setMenuOpen(null)}>
                  <button onClick={(e) => {
                    e.stopPropagation();
                    setEditProject(p);
                    setOpenProjectModal(true);
                    setMenuOpen(null);
                  }
                  }>
                    <FiEdit2 /> Edit
                  </button>
                  <button onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteProject(p._id)
                  }}>
                    <FiTrash2 /> Delete
                  </button>
                  <button onClick={(e) => {
                    e.stopPropagation();
                    setOpenAddMembersModal(true);
                    setProject(p);
                  }}>
                    <FiUserPlus /> Add Members
                  </button>
                </div>
              )}
            </div>

          ))}
        </div>

      </div>

      {/* 📊 Right: Stats Panel */}
      <div className="projects-right">
        {/* ✅ Completion Rate Card */}
        <div className="stat-card">
          <h3>Task Completion Rate</h3>
          <div className="big-number">{projectMetrics.completionRate || 0}%</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: "94%" }}></div>
          </div>
          {/* <p className="stat-desc">
            Most projects completed within deadlines.
          </p> */}
        </div>

        {/* ⏰ Overdue Projects Card */}
        <div className="stat-card overdue">
          <h3>Overdue Projects</h3>
          <div className="big-number">6</div>
          <p className="stat-desc">
            Projects that missed their deadline. Improve scheduling and follow-ups.
          </p>
          <button className="view-details-btn">View Details</button>
        </div>
      </div>

      {
        openProjectModal && <CreateProjectModal isOpen={openProjectModal} onClose={() => setOpenProjectModal(false)} onSubmit={editProject ? handleEditProject : handleAddProject} editProject={editProject}></CreateProjectModal>
      }
      {
        openProjectDetails && <ProjectDetailsModal project={project} onClose={() => setOpenProjectDetails(false)}></ProjectDetailsModal>
      }

      {
        openAddMembersModal && <AddProjectMembersModal isOpen={openAddMembersModal} onClose={() => setOpenAddMembersModal(false)} project={project} spaceId={spaceId} onAdd={handleAddMembers}></AddProjectMembersModal>
      }
    </div>
  );
};

export default Projects;
