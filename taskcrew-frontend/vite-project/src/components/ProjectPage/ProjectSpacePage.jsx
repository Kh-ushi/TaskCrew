
import "./ProjectSpacePage.css";
import ProjectSpaceNav from "./ProjectSpaceNav";
import Dashboard from "./Dashboard";

const ProjectSpacePage = () => {
  return (
    <div className="project-space-page">
    <ProjectSpaceNav />
        <div className="project-space-content">
        <Dashboard/>
        </div>
    </div>
  );
};

export default ProjectSpacePage;