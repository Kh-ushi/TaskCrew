
import "./ProjectSpacePage.css";
import ProjectSpaceNav from "./ProjectSpaceNav";
import {useParams} from "react-router-dom";
import Dashboard from "./Dashboard";

const ProjectSpacePage = () => {
  const {projectId} = useParams();
  console.log(projectId);
  return (
    <div className="project-space-page">
    <ProjectSpaceNav />
        <div className="project-space-content">
        <Dashboard projectId={projectId}/>
        </div>
    </div>
  );
};

export default ProjectSpacePage;