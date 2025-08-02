import { useNavigate ,Navigate} from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../utils/axiosInstance";
import { getAccessToken } from "../utils/auth";

const ProtectedRoute = ({ children }) => {
    const [isChecking, setIsChecking] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
    
        const checkAuth = async () => {
            const token = getAccessToken();
            // console.log("token", token);
            if (!token) {
                setIsAuthenticated(false);
                setIsChecking(false);
                navigate("/login");
                return;
            }


            try {
                await api.get(`/api/auth/verify-token`);
                setIsAuthenticated(true);

            } catch (error) {
                setIsAuthenticated(false);
            }

            setIsChecking(false);
        }

        checkAuth();
    },[]);

    if(isChecking) return <div>Loading...</div>;

    
  return isAuthenticated ? children : <Navigate to="/login" replace />;

};

export default ProtectedRoute;