import "./ProgressSummaryBar.css";

const ProgressSummaryBar = ({
  projectsPercent = 72,
  duePercent = 12,
  tasksPercent = 63,
  pendingPercent = 29,
  ongoing = 32,
  toDo = 18,
  closed = 26,
}) => {
  return (
    <div className="psb-container">
      <div className="psb-bars">
        <div className="psb-item">
          <div className="psb-label">Tasks</div>
          <div className="psb-bar-wrapper">
            <div
              className="psb-bar filled"
              style={{ width: `${projectsPercent}%` }}
              aria-label={`Projects ${projectsPercent}% complete`}
            />
          </div>
          <div className="psb-percent">{projectsPercent}%</div>
        </div>

        {/* <div className="psb-item small-pill">
          <div className="psb-label">Due</div>
          <div className="psb-pill due">
            {duePercent}%
          </div>
        </div> */}

        <div className="psb-item">
          <div className="psb-label">SubTasks</div>
          <div className="psb-bar-wrapper light">
            <div
              className="psb-bar filled"
              style={{ width: `${tasksPercent}%` }}
              aria-label={`Tasks ${tasksPercent}% complete`}
            />
          </div>
          <div className="psb-percent">{tasksPercent}%</div>
        </div>

        {/* <div className="psb-item small-pill">
          <div className="psb-label">Pending</div>
          <div className="psb-pill pending">
            {pendingPercent}%
          </div>
        </div> */}
      </div>

      <div className="psb-stats">
        <div className="stat">
          <div className="stat-number">{ongoing}</div>
          <div className="stat-label">Ongoing</div>
        </div>
        <div className="stat">
          <div className="stat-number">{toDo}</div>
          <div className="stat-label">To Do</div>
        </div>
        <div className="stat">
          <div className="stat-number">{closed}</div>
          <div className="stat-label">Closed</div>
        </div>
      </div>
    </div>
  );
};

export default ProgressSummaryBar;
