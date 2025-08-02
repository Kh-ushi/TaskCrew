// ProjectCard.jsx
import React from "react";
import "./ProjectCard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder } from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const ProjectCard = ({ space }) => {
  const {
    name,
    description,
    status,
    startDate,
    endDate,
    ownerId,
    members = [],
    updatedAt,
  } = space;

  const formatDate = (d) => (d ? dayjs(d).format("MMM D, YYYY") : "—");

  return (
    <div className="project-card-wrapper">
      <div className="card-header">
        <div className="icon-wrapper">
          <FontAwesomeIcon icon={faFolder} size="lg" />
        </div>
        <div className="title-group">
          <h3 className="project-name">{name}</h3>
          <div className={`status-badge ${status}`}>{status}</div>
        </div>
      </div>

      <p className="project-desc">{description || "No description provided."}</p>

      <div className="card-meta">
        <div className="dates">
          <div>
            <span className="label">Start:</span> {formatDate(startDate)}
          </div>
          <div>
            <span className="label">End:</span> {formatDate(endDate)}
          </div>
        </div>
        <div className="members-info">
          <span className="label">Members:</span> {members.length}
        </div>
      </div>

      <div className="card-footer">
        <div className="updated">Updated {dayjs(updatedAt).fromNow()}</div>
        <div className="actions">
          <button className="btn-secondary">View</button>
          <button className="btn-primary">Manage</button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
