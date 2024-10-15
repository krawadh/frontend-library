import axios from "axios";
import { logoutHandler } from "./auth";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// Create an Axios instance
const api = axios.create({
  baseURL: "https://localhost:3000/api/v1", // Adjust this to match your API base URL
  withCredentials: true, // Ensures cookies are sent with the request
});

// Example: Get user role from Redux (if needed)
// const getUserRole = () => {
//   const { user } = useSelector((state) => state.auth); // Modify to match your Redux store structure
//   return user?.role;
// };

// Axios Interceptor Logic
api.interceptors.request.use(
  (config) => {
    // Ensure cookies are sent with each request
    config.withCredentials = true;

    // If the request contains FormData, Axios will set the content type automatically
    if (config.data instanceof FormData) {
      // Leave 'Content-Type' undefined for Axios to auto-detect 'multipart/form-data'
    } else {
      // Set 'Content-Type' to 'application/json' for non-FormData requests
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    //const dispatch = useDispatch();
    //const navigate = useNavigate();
    //const { user } = useSelector((store) => store.auth);
    console.log("response error----", error.response);
    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Refresh the token if needed (adjust refresh logic as per your app)
        const res = await api.get("/auth/refresh-token");
        // if (res.data.success) {
        //   dispatch(setUser(res.data.user));
        // }
        return api(originalRequest); // Retry the original request after refreshing
      } catch (refreshError) {
        console.error("Refresh token failed or expired", refreshError);

        // Call the logoutHandler on refresh token failure
        if (user && user.id) {
          logoutHandler(user.id, dispatch, navigate);
        }
        return Promise.reject(refreshError);
      }
    }

    // Handle 403 Forbidden
    // if (error.response?.status === 403) {
    //   const userRole = getUserRole();
    //   if (userRole === "user") {
    //     console.warn("Access denied: Admin privileges required.");
    //   }
    // }

    return Promise.reject(error);
  }
);

export default api;
