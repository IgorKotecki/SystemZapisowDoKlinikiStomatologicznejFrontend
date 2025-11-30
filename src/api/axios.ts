import axios from 'axios';
import { storage } from '../utils/storage';

const api = axios.create({
  baseURL: 'http://localhost:5114',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = storage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
//PRZEANALIZOWAĆ DODAĆ W RAZIE CO 
// import axios from "axios";

// const api = axios.create({
//   baseURL: process.env.REACT_APP_API_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // flaga, żeby uniknąć nieskończonej pętli
// let isRefreshing = false;
// let failedQueue: any[] = [];

// const processQueue = (error: any, token: string | null = null) => {
//   failedQueue.forEach(prom => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(token);
//     }
//   });
//   failedQueue = [];
// };

// interceptor odpowiedzi
// api.interceptors.response.use(
//   response => response,
//   async error => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         })
//           .then(token => {
//             originalRequest.headers["Authorization"] = `Bearer ${token}`;
//             return axios(originalRequest);
//           })
//           .catch(err => Promise.reject(err));
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       try {
//         // wywołanie endpointu refresh token
//         const refreshToken = localStorage.getItem("refreshToken");
//         const res = await axios.post("/auth/refresh", { token: refreshToken });
//         const newToken = res.data.accessToken;

//         localStorage.setItem("accessToken", newToken);
//         api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
//         originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

//         processQueue(null, newToken);

//         return axios(originalRequest);
//       } catch (err) {
//         processQueue(err, null);
//         return Promise.reject(err);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;

