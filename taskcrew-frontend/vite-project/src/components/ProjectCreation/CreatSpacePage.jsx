import "./CreateSpacePage.css";
import NavBar from "../LandingPage/NavBar";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import api from "../../utils/axiosInstance";
import CreateSpaceModal from "./CreateSpaceModal";
import ProjectCard from "./ProjectCard";


function CreateSpacePage() {
  const [spaces, setSpaces] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");


  useEffect(() => {

    const fetchSpaces = async () => {
      try {
        const { data } = await api.get(`/api/projects/my`);
        console.log("Fetched spaces:", data);
        setSpaces(data);
      }
      catch (error) {
        console.error("Error fetching spaces:", error);
        if (error?.response?.data?.message) {
          setError(error.response.data.message);
        }
      }
    }

    fetchSpaces();

  },[]);

  const onClose = () => {
    setIsOpen(false);
  };

  const onCreate =async (payload) => {
    try {
      console.log("Creating space with payload:", payload);
      const { data } = await pi.post(`/api/projects`, payload);
      console.log("Space created successfully:", data.data.project);
      setSpaces([...spaces, data.dataproject]);
    } catch (error) {
      console.error("Error creating space:", error);
      if (error?.response?.data?.message) {
        setError(error.response.data.message);
      }
    }
  };

  return (
    <div className="create-space-container">
      <NavBar isCreateSpace={true} setOpen={setIsOpen} />

      <div className={`create-space-layer ${spaces.length > 0 ? "create-space-layer-add" : ""}`}>

      {spaces.length > 0 && (
          <div className="all-projects-container">
             <div className="grid-wrapper">
               {spaces.map((space) => (
                <ProjectCard key={space._id} space={space} />
              ))}
             </div>
          </div>
        )}

        {spaces.length == 0 && (<div className={`projects-container && ${spaces.length>0 ?"hide-projects-container":""}`}>
          <div className="projects--empty">
            <FontAwesomeIcon
              icon={faFolderOpen}
              size="4x"
              className="empty-icon"
            />
            <h2 className="empty-title">No Spaces Yet</h2>
            <p className="empty-text">
              You haven’t created any project spaces. Let’s get started!
            </p>
            <button
              className="empty-btn"
              onClick={() => setIsOpen(true)}
            >
              + Create Your First Space
            </button>
          </div>
        </div>)}



      </div>

      {isOpen && <CreateSpaceModal isOpen={isOpen} onClose={onClose} onCreate={onCreate} ></CreateSpaceModal>}
    </div>
  );
}

export default CreateSpacePage;
