import React, { useState } from "react";
import "./SpacePage.css";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/NavBar";
import { useParams } from "react-router-dom";
import AddProjectModal from "../AddProjectModal/AddProjectModal";
import api from "../../utils/axiosInstance";

const SpacePage = () => {
    const [collapsed,setCollapsed] = useState(false);
    const [openAddProjectModal,setOpenAddProjectModal] = useState(false);

    const SB_EXPANDED = 264;
    const SB_COLLAPSED = 76;

    const handleAddProject = (payload) => {
        console.log("I am in add project")
        console.log(payload);
    }

    const sbWidth = collapsed ? SB_COLLAPSED : SB_EXPANDED;
    const {id} = useParams();
    return (
        <div className="space-page" style={{ "--sb-w": `${sbWidth}px` }}>
          <Sidebar
            forceCollapsed={collapsed}
            onCollapsedChange={setCollapsed}
            onAddProject={()=>setOpenAddProjectModal(true)}
            />
          <div className="space-content">
            <Navbar isMainSpace={true}/>
          </div>
          {openAddProjectModal && <AddProjectModal open={openAddProjectModal} onClose={()=>setOpenAddProjectModal(false)} onSubmit={handleAddProject} />}
        </div>
      );
};

export default SpacePage;
