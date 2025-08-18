import { useNavigate, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "./axiosInstance";
import { getAccessToken } from "./auth";

const ProtectedRoute = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = getAccessToken();

      if (!token) {
        setIsAuthenticated(false);
        setIsChecking(false);
        return; // let render return <Navigate/>
      }

      try {
        await api.get("/api/auth/verify-token");
        setIsAuthenticated(true);
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, []); // (optionally add navigate to deps if you use it here)

  if (isChecking) return <div>Loading...</div>;

  if (!isAuthenticated) return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
