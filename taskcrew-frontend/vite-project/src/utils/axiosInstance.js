import axios from "axios";
import { getAccessToken, setAccessToken, clearAuth } from "./auth";


const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true
});

api.interceptors.request.use(
    config => {
        const token = getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config;
    },
    error => Promise.reject(error)
);

api.interceptors.response.use(
    response => response,
    async error => {
        const originalReq = error.config;

        if (error.response?.status == 401 &&
            error.response.data?.message === "Access token expired" &&
            !originalReq._retry
        ) {
            originalReq._retry = true;
            try {
                const { data } = await api.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/refresh-token`);
                setAccessToken(data.accessToken);
                originalReq.headers.Authorization = `Bearer ${data.accessToken}`;
                return api(originalReq);
            }
            catch (refreshErr) {
                console.log("refreshErr",refreshErr);
                // clearAuth();
                // window.location.href = "/login";
                // return Promise.reject(refreshErr);
            }
        }

        if (error.response?.status === 401) {
            console.log("error",error.response.data);
            // clearAuth();
            // window.location.href = "/login";
        }

        return Promise.reject(error);

    }
)



export default api;