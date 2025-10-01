import { Navigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import socket from "../../socket";

const ProtectedRoute = ({ children }) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("accessToken");

  const [isAuthorized, setIsAuthorized] = useState(null); 

  useEffect(() => {
    const verifyUser = async () => {
      if (!token) {
        setIsAuthorized(false);
        return;
      }

      try {
        const { data } = await axios.get(`${BACKEND_URL}/api/auth/verify`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setIsAuthorized(data.success === true);
      } catch (error) {
        console.error("❌ Token verification failed:", error.response?.data || error.message);
        setIsAuthorized(false);
      }
    };

    verifyUser();
  }, [token, BACKEND_URL]);


  useEffect(()=>{
    if(isAuthorized){
      socket.auth={token};
      socket.connect();
      console.log("🔌 Socket connected automatically inside ProtectedRoute");
    }
    return ()=>{
       if (socket.connected) {
        socket.disconnect();
        console.log("🔌 Socket disconnected (ProtectedRoute cleanup)");
      }
    }
  },[isAuthorized, token]);

  if (isAuthorized === null) {
    return (
      <div style={{ color: "#a78bfa", textAlign: "center", marginTop: "3rem" }}>
        Verifying session...
      </div>
    );
  }

  if (!isAuthorized) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
