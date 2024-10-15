import axios from "axios";
import { toast } from "sonner"; // Adjust if using another library
import { USER_API_END_POINT } from "@/utils/constant";
import { persistor } from "@/redux/store"; // Adjust the path
import { resetMembership } from "@/redux/membershipSlice";
import { resetSeat } from "@/redux/seatSlice";
import { setLoading, resetAuth } from "@/redux/authSlice";
import { resetMember } from "@/redux/memberSlice";

/**
 * Logout handler utility function to clear user state, persist data, and navigate.
 *
 * @param {string} userId - The ID of the user.
 * @param {function} dispatch - Redux dispatch function.
 * @param {function} navigate - React Router's navigate function.
 */
export const logoutHandler = async (userId, dispatch, navigate, api) => {
  try {
    dispatch(setLoading(true));

    const res = await axios.get(
      `${USER_API_END_POINT}/logout`, // Your API endpoint
      { userId }, // Send the user ID in the request body
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );

    if (res.data.success) {
      // Reset Redux slices and clear persisted state
      dispatch(resetAuth());
      dispatch(resetMember());
      dispatch(resetMembership());
      dispatch(resetSeat());

      await persistor.purge(); // Clear persisted Redux state
      console.log("Persisted state cleared on logout!");

      navigate("/login", { replace: true }); // Redirect to login page
      toast.success(res.data.message); // Show success message
    }

    dispatch(setLoading(false));
  } catch (error) {
    console.log("Logout failed", error);
    toast.error(error?.response?.data?.message || "Failed to logout");
    dispatch(setLoading(false));
  }
};
