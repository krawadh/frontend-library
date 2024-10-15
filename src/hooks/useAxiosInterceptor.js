import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutHandler } from "@/utils/auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Adjust based on your environment
  withCredentials: true, // Ensure cookies are sent
});

export const useAxiosInterceptor = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth); // Get user data from Redux store

  api.interceptors.response.use(
    (response) => response, // Pass through successful responses
    async (error) => {
      const originalRequest = error.config;

      // Handle 401 Unauthorized (e.g., access token expired)
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        // Check if the user is still authenticated before attempting to refresh the token
        /*console.log("user----", user);
        if (!user) {
          console.log(
            "User is not authenticated. Logout in progress or already logged out."
          );
          return Promise.reject(error); // No need to retry or refresh token
        }*/

        try {
          // Attempt to refresh the token
          const refreshResponse = await api.get(
            `${import.meta.env.VITE_API_URL}/auth/refresh-token`
            // {
            //   headers: { "Content-Type": "application/json" },
            //   withCredentials: true, // Ensure cookies are sent
            // }
          );

          if (refreshResponse.status === 200) {
            // Retry the original request after successful token refresh
            return api(originalRequest);
          }
        } catch (refreshError) {
          //console.warn("Refresh token failed or expired1", refreshError);
          console.log("Refresh token failed or expired2", refreshError);

          //if (user && user.id) {
          try {
            await logoutHandler(user.id, dispatch, navigate, api);
            //return api(originalRequest);
          } catch (error) {
            console.log(error.message);
          }
          //}

          return Promise.reject(refreshError); // Reject the refresh error
        }
      }

      // Handle 403 Forbidden (e.g., refresh token invalid or expired)
      /*if (error.response?.status === 403 && !originalRequest._retry) {
        originalRequest._retry = true;
        //console.warn("Forbidden - Possible invalid or expired refresh token1");
        console.log("Forbidden - Possible invalid or expired refresh token2");

        // Log the user out immediately on 403 error (refresh token invalid)
        if (user && user.id) {
          try {
            await logoutHandler(user.id, dispatch, navigate, api);
            return api(originalRequest);
          } catch (error) {
            console.log(error.message);
          }
        }

        return Promise.reject(error); // Reject the error
      }*/

      return Promise.reject(error); // Pass through other errors
    }
  );

  return api; // Return the axios instance with interceptors
};
