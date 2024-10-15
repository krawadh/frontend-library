import { setAllAdminSeats } from "@/redux/seatSlice";
import { useAxiosInterceptor } from "@/hooks/useAxiosInterceptor";
import { SEAT_API_END_POINT } from "@/utils/constant";
//import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllAdminSeats = () => {
  const dispatch = useDispatch();
  const api = useAxiosInterceptor(); // Use the custom Axios instance with interceptors
  useEffect(() => {
    const fetchAllAdminSeats = async () => {
      try {
        const res = await api.get(`${SEAT_API_END_POINT}`);
        console.log(res.data);
        if (res.data.success) {
          dispatch(setAllAdminSeats(res.data.seats));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllAdminSeats();
  }, []);
};

export default useGetAllAdminSeats;
