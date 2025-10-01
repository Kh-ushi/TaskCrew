import React from "react";
import "./Navbar.css";
import { FiBell } from "react-icons/fi";
import { useEffect, useState } from "react";
import socket from "../../socket";
import axios from "axios";
import Notifications from "./Notifications";


const Navbar = () => {

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const [notifications, setNotifications] = useState([]);
  const [openNotif, setOpenNotif] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const { data } = await axios.get(`${BACKEND_URL}/api/notifications`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("New Notifications:", data);

        setNotifications((prev) => {

          const combined = [...prev, ...data];

          const unique = combined.filter(
            (notif, index, self) =>
              index === self.findIndex((n) => n.message === notif.message)
          );

          unique.sort((a, b) => b.createdAt - a.createdAt);

          return unique;

        });

        console.log("Fetched Notifications:", data);
      } catch (error) {
        console.log("Error fetching notifications:", error);
      }
    };

    fetchNotifications();

    const handleNotification = (data) => {
      console.log("🔔 New Notification:", data);
      setNotifications((prevNotifs) => [data, ...prevNotifs]);
    };

    socket.on("notification", handleNotification);


    return () => {
      socket.off("notification", handleNotification);
    };
  }, []);

  const addToOrganization = async (notif) => {

    try {
      const token = localStorage.getItem("accessToken");

      const { data } = await axios.get(`${BACKEND_URL}/api/org/accept-invite/${notif.entity}`, {
        headers: {
          authorization: `Bearer ${token}`
        }
      });

      console.log(data);

      const resp = await axios.put(
        `${BACKEND_URL}/api/notifications/mark-as-read/${notif._id}`,
        {},
        {
          headers: {
            authorization: `Bearer ${token}`, 
          },
        }
      );


      console.log(resp.data.message);

      const { message } = data;
      alert(message);

      setNotifications((prev) => (
        prev.filter(p => p.entity !== notif.entity)
      ));
    }
    catch (error) {
      console.log("Error joining organization:", error);
    }
  }

  const resolveNotification = (notif) => {

    const entityModel = notif.entityModel;
    switch (entityModel) {
      case "Organization":
        addToOrganization(notif);
        break;
      // case "Project":
      //   window.location.href=`/project/${notif.entity}`;
      //   break;
      default:
        console.log("Unknown entity model:", entityModel);
    }

  };

  return (
    <nav className="navbar">
      {/* 🌟 Logo */}
      <div className="navbar-left">
        {/* <img
          src="/logo.svg" // replace with your TaskCrew logo path
          alt="TaskCrew"
          className="navbar-logo"
        /> */}
        <h1 className="navbar-title">TaskCrew</h1>
      </div>

      {/* 🔔 Right Side */}
      <div className="navbar-right">
        <div className="navbar-icon notification" onClick={() => setOpenNotif(!openNotif)}>
          <FiBell size={22} />
          {notifications.length > 0 && (
            <span className="notification-badge">{notifications.length}</span>
          )}
        </div>

        <div className="profile">
          <img
            src="https://i.pravatar.cc/40" // dummy avatar (replace with real user photo)
            alt="Profile"
            className="profile-img"
          />
        </div>
      </div>

      {openNotif && <Notifications open={openNotif} setOpen={setOpenNotif} notifications={notifications} resolveNotification={resolveNotification} />}
    </nav>
  );
};

export default Navbar;
