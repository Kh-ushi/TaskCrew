
import axios from "axios";
import { getAccessToken, setAccessToken, clearAuth } from "./auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

let isRefreshing = false;
let pendingQueue = [];

function processQueue(error, token) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  pendingQueue = [];
}

api.interceptors.request.use(function (config) {
  const token = getAccessToken();
  console.log("Request token:", token);
  if (token) {
    config.headers.Authorization = "Bearer " + token;
  }
  return config;
}, function (error) {
  return Promise.reject(error);
});


api.interceptors.request.use((config) => {
  console.log("Outgoing request:", {
    method: config.method,
    url: config.url,          
    baseURL: config.baseURL,  
    headers: config.headers,
  });
  return config;
});


api.interceptors.response.use(function (response) {
  return response;
}, async function (error) {
  const originalReq = error.config;

  const isExpired = error.response &&
    error.response.status === 401 &&
    error.response.data &&
    error.response.data.message === "Access token expired";

  if (isExpired && !originalReq._retry) {
    originalReq._retry = true;

    if (isRefreshing) {
      return new Promise(function (resolve, reject) {
        pendingQueue.push({
          resolve: function (newToken) {
            originalReq.headers.Authorization = "Bearer " + newToken;
            resolve(api(originalReq));
          },
          reject: function (err) {
            reject(err);
          },
        });
      });
    }

    isRefreshing = true;
    try {
      const { data } = await refreshClient.get("/api/auth/refresh-token");
      const newAccessToken = data.accessToken;
      setAccessToken(newAccessToken);
      processQueue(null, newAccessToken);
      originalReq.headers.Authorization = "Bearer " + newAccessToken;
      return api(originalReq);
    } catch (refreshErr) {
      console.error("Refresh token failed:", refreshErr);
      processQueue(refreshErr, null);
      clearAuth();
      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  }

  // fallback for other 401s or failures
  return Promise.reject(error);
});

export default api;
