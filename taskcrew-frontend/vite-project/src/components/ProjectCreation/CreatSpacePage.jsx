// CreateSpacePage.jsx
import "./CreateSpacePage.css";
import NavBar from "../LandingPage/NavBar";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";

function CreateSpacePage() {
  const [spaces, setSpaces] = useState([]);

  return (
    <div className="create-space-container">
      <NavBar isCreateSpace={true} />

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
            >
              + Create Your First Space
            </button>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}

export default CreateSpacePage;
