// CreateSpacePage.jsx
import "./CreateSpacePage.css";
import NavBar from "../LandingPage/NavBar";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import CreateSpaceModal from "./CreateSpaceModal";
import api from "../../utils/axiosInstance";

function CreateSpacePage() {
  const [spaces, setSpaces] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");

  const onClose = () => {
    setIsOpen(false);
  };

  const onCreate = (payload) => {
    try {
      console.log("Creating space with payload:", payload);
      // const { data } = api.post(`${import.meta.env.VITE_BACKEND_URL}/api/projects`, payload);
      // console.log("Space created successfully:", data);
      // setSpaces([...spaces,data]);
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

      <div className="create-space-layer">
        <div className="projects-container">
          {spaces.length === 0 && (
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
          )}
        </div>
      </div>

      {isOpen && <CreateSpaceModal isOpen={isOpen} onClose={onClose} onCreate={onCreate} ></CreateSpaceModal>}
    </div>
  );
}

export default CreateSpacePage;
