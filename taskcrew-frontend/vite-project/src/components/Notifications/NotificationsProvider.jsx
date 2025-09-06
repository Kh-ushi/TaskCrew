import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import api from "../../utils/axiosInstance";

const NotificationCtx = createContext({
  socket: null,
  connected: false,
  unread: 0,
  notifications: [],
  clearLocalUnread: () => { },
  markAllRead: null,
  onJoin:(n)=>{
    console.log("----------------");
    console.log("Join clicked");
    console.log("----------------");
  }
});

const NotificationProvider = ({ children, token, url, path = "/ws" }) => {
  const [connected, setConnected] = useState(false);

  const [unread, setUnread] = useState(() => {
    const saved = localStorage.getItem("unread_notifications");
    return saved ? parseInt(saved, 10) : 0;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("notifications");
    return saved ? JSON.parse(saved) : [];
  });


  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const { data } = await api.get("api/notifications/unread");
        console.log(data.notifications);
        setUnread(data.notifications.length);
        setNotifications(data.notifications);
      }
      catch (err) {
        console.log(err);
      }
    };

    fetchUnread();
  }, []);

  const socketRef = useRef(null);

  const markAllRead = () => {
    setUnread(0);
    localStorage.setItem("unread_notifications", "0");
    socketRef.current?.emit("notification:markAllRead");
  };

  useEffect(() => {
    localStorage.setItem("unread_notifications", unread.toString());
  }, [unread]);

  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    if (!token || !url) {
      console.log("Missing token or URL");
      return;
    }

    console.log("Setting up notification socket...");
    const socket = io(url, {
      path,
      transports: ["websocket"],
      auth: { token },
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 500,
      timeout: 5000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);

      // Ask server for fresh unread count on connect
      socket.emit("notification:getUnread", null, (resp) => {
        if (resp && typeof resp.count === "number") {
          setUnread(resp.count);
        }
      });
    });

    socket.on("disconnect", () => setConnected(false));

    socket.on("notification", (n) => {
      console.log("New notification:", n);
      setNotifications((prev) => {
        // Deduplicate by id if server provides one
        if (n.id && prev.some((x) => x.title === n.title)) {
          return prev;
        }
        return [n, ...prev].slice(0, 100);
      });
    });

    // ✅ Single handler, pick the payload shape your server actually sends
    socket.on("notification:unread", (data) => {
      if (typeof data?.unread === "number") {
        setUnread(data.unread);
      } else if (typeof data?.count === "number") {
        setUnread(data.count);
      }
    });


    socket.on("notification:resolved",(notif)=>{
      setNotifications((prev)=>prev.filter((n)=>n._id!==notif._id));
      console.log("Notification resolved:",notif);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("notification");
      socket.off("notification:unread");
      socket.disconnect();
    };
  }, [token, url, path]);

  return (
    <NotificationCtx.Provider
      value={{
        socket: socketRef.current,
        connected,
        unread,
        notifications,
        clearLocalUnread: () => {
          //   setUnread(0);
          //   localStorage.setItem("unread_notifications", "0");
        },
        markAllRead,
        onJoin:(n)=>{
          console.log(n);
          socketRef.current?.emit("notification:join",{room:`org:${n.data.orgName}`,data:n});
        }
      }}
    >
      {children}
    </NotificationCtx.Provider>
  );
};

const useNotification = () => {
  const context = useContext(NotificationCtx);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};

export { NotificationProvider, useNotification };
