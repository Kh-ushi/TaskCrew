import "./ProjectSpaceNav.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faHouse,
  faListCheck,
  faCalendar,
  faChartSimple,
  faComment,
  faBell,
} from "@fortawesome/free-solid-svg-icons";

const ProjectSpaceNav = () => {
  const options = [
    { label: "Dashboard", icon: faHouse },
    { label: "Task Management", icon: faListCheck },
    { label: "Calendar", icon: faCalendar },
    { label: "Analytics", icon: faChartSimple },
    { label: "Chats & Meetings", icon: faComment },
  ];

  // Example: unread notifications count
  const unreadNotifications = 3;

  // Example user (could come from props / context)
  const user = {
    name: "Khushi Gupta",
    avatarUrl: null, // or a URL if available
  };

  const initials = user.name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <nav className="navbar">
      <div className="navbar__left">
        <div className="navbar__logo" aria-label="TaskCrew logo">
          <FontAwesomeIcon icon={faCircleCheck} size="2x" />
        </div>

        <div className="navbar__menu" role="menubar">
          {options.map(o => (
            <div
              key={o.label}
              className="navbar__item"
              role="menuitem"
              tabIndex={0}
            >
              <FontAwesomeIcon icon={o.icon} className="icon-inline" />
              <span className="label">{o.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="navbar__right">
        <div className="action-icon notification-wrapper" aria-label="Notifications">
          <FontAwesomeIcon icon={faBell} />
          {unreadNotifications > 0 && (
            <div className="badge" aria-label={`${unreadNotifications} unread notifications`}>
              {unreadNotifications}
            </div>
          )}
        </div>

        <div className="profile-circle" aria-label="User profile">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt="avatar" className="avatar-img" />
          ) : (
            <div className="initials">{initials}</div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default ProjectSpaceNav;