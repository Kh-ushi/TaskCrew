// CreateSpacePage.jsx
import "./CreateSpacePage.css";
import NavBar from "../LandingPage/NavBar";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import CreateSpaceModal from "./CreateSpaceModal";

function CreateSpacePage() {
  const [spaces, setSpaces] = useState([]);
  const [isOpen,setIsOpen]=useState(false);

  const onClose=()=>{
    setIsOpen(false);
  };

  const onCreate=(payload)=>{
    console.log(payload);
  };

  return (
    <div className="create-space-container">
      <NavBar isCreateSpace={true} setOpen={setIsOpen}/>

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
              onClick={()=>setIsOpen(true)}
            >
              + Create Your First Space
            </button>
          </div>
        )}
      </div>
      </div>

      {isOpen && <CreateSpaceModal isOpen={isOpen} onClose={onClose} onCreate={onCreate} ></CreateSpaceModal> }
    </div>
  );
}

export default CreateSpacePage;
