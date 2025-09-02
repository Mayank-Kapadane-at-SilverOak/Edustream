import axios from "axios";
import { getToken, setToken, logout } from "./utils/auth";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api", // Laravel backend
});

// attach token automatically
API.interceptors.request.use((req) => {
  const token = getToken();
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
    // Add timestamp to prevent caching issues
    req.headers["X-Request-Time"] = new Date().getTime();
  }
  return req;
});

// Handle token expiration and refresh
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If token expired and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log("Attempting to refresh token...");
        
        // Try direct login instead of refresh if we have credentials in sessionStorage
        const savedCredentials = sessionStorage.getItem("credentials");
        
        if (savedCredentials) {
          const { email, password } = JSON.parse(savedCredentials);
          console.log("Using saved credentials to re-authenticate");
          
          const loginResponse = await axios.post(
            "http://127.0.0.1:8000/api/login",
            { email, password }
          );
          
          const newToken = loginResponse.data.token;
          setToken(newToken);
          
          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return API(originalRequest);
        } else {
          // Fall back to regular refresh
          const refreshResponse = await axios.post(
            "http://127.0.0.1:8000/api/refresh",
            {},
            {
              headers: {
                Authorization: `Bearer ${getToken()}`,
              },
            }
          );

          const newToken = refreshResponse.data.token;
          setToken(newToken);

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return API(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        console.log("Authentication failed, redirecting to login");
        logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
