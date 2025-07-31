// import axios from "axios";
// import { getAccessToken, setAccessToken, clearAuth } from "./auth";


// const api = axios.create({
//     baseURL: import.meta.env.VITE_BACKEND_URL,
//     withCredentials: true
// });

// api.interceptors.request.use(
//     config => {
//         const token = getAccessToken();
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`
//         }
//         return config;
//     },
//     error => Promise.reject(error)
// );

// api.interceptors.response.use(
//     response => response,
//     async error => {
//         const originalReq = error.config;

//         if (error.response?.status == 401 &&
//             error.response.data?.message === "Access token expired"
//             // !originalReq._retry
//         ) {
//             originalReq._retry = true;
//             try {
//                 console.log("Refreshing access token...");
//                 const { data } = await api.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/refresh-token`);
//                 setAccessToken(data.accessToken);
//                 originalReq.headers.Authorization = `Bearer ${data.accessToken}`;
//                 return api(originalReq);
//             }
//             catch (refreshErr) {
//                 console.log("refreshErr",refreshErr);
//                 // clearAuth();
//                 // window.location.href = "/login";
//                 // return Promise.reject(refreshErr);
//             }
//         }

//         if (error.response?.status === 401) {
//             console.log("error",error.response);
//             // clearAuth();
//             // window.location.href = "/login";
//         }

//         return Promise.reject(error);

//     }
// )



// export default api;

import axios from "axios";
import { getAccessToken, setAccessToken, clearAuth } from "./auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

// separate client for refresh to avoid recursion into the same interceptor
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
  if (token) {
    config.headers.Authorization = "Bearer " + token;
  }
  return config;
}, function (error) {
  return Promise.reject(error);
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
