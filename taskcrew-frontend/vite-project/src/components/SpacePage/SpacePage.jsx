import React, { useState } from "react";
import "./SpacePage.css";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/NavBar";
import { useParams } from "react-router-dom";
import AddProjectModal from "../AddProjectModal/AddProjectModal";
import api from "../../utils/axiosInstance";
import { useEffect } from "react";
import ProjectPage from "../ProjectPage/ProjectPage";

const SpacePage = () => {
  const { id } = useParams();
  const [collapsed, setCollapsed] = useState(false);
  const [openAddProjectModal, setOpenAddProjectModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [editProject, setEditProject] = useState(null);
  const [isDeleted, setIsDeleted] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const SB_EXPANDED = 264;
  const SB_COLLAPSED = 76;

  useEffect(() => {
    if (selectedOption) {
      console.log("Selected option changed:", selectedOption);
    }
  }, [selectedOption]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await api.get(`/api/projects/my/${id}`);
        console.log(data);
        setProjects(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProjects();
  }, [openAddProjectModal,isDeleted]);

  const handleAddProject = async (payload) => {
    setEditProject(null);
    console.log("I am in add project")
    console.log(payload);
    try {
      const { data } = await api.post(`/api/projects/${id}`, payload);
      console.log(data);
      setOpenAddProjectModal(false);
    } catch (error) {
      console.log(error);
    }

  }

  const handleEditProject = async (payload) => {
    console.log("I am in edit project")
    console.log(payload);
    try{
      const {data}=await api.put(`/api/projects/${editProject._id}`,payload);
      console.log(data);
      setOpenAddProjectModal(false);
    }
    catch(error){
      console.log(error);
    }
  }

  const editProjectHandler = (project) => {
    console.log("I am in edit project")
    console.log(project);
    setEditProject(project);
    setOpenAddProjectModal(true);
  }

  const handleDeleteProject = async (project) => {
    console.log(project);
    try {
      const { data } = await api.delete(`/api/projects/hard-delete/${project._id}`);
      console.log(data);
      setIsDeleted((prev)=>!prev);
    } catch (error) {
      console.log(error);
    }
  }

  const sbWidth = collapsed ? SB_COLLAPSED : SB_EXPANDED;
  return (
    <div className="space-page" style={{ "--sb-w": `${sbWidth}px` }}>
      <Sidebar
        forceCollapsed={collapsed}
        onCollapsedChange={setCollapsed}
        onAddProject={() => {setOpenAddProjectModal(true);setEditProject(null)}}
        onEdit={editProjectHandler}
        onDelete={handleDeleteProject}
        projects={projects}
        setEditProject={setEditProject}
        setSelectedOption={setSelectedOption}
      />
      <div className="space-content">
        <Navbar isMainSpace={true} />
        <div className="space-content-inner" style={{backgroundColor:"black"}}>
         {
           (()=>{
            switch (selectedOption?.group) {
          case "workspaces":
            return <ProjectPage project={selectedOption.project} />;
          {/* case "workspaces":
            return <WorkspacePage workspace={selectedOption.workspace} />;
          case "Collaborations":
            return <CollaborationPage collaboration={selectedOption.collaboration} />;
          case "Insights":
            return <InsightsPage insights={selectedOption.insights} />; */}
          default:
            return null;
        }
          })()
         }

        </div>
      </div>
      {openAddProjectModal && <AddProjectModal open={openAddProjectModal} onClose={() => setOpenAddProjectModal(false)} onSubmit={handleAddProject} onEdit={handleEditProject}  currentUserId={id} spaces={projects} editProject={editProject} />}
    </div>
  );
};

export default SpacePage;
