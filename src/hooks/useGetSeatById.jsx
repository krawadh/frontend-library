import { setSingleSeat } from "@/redux/seatSlice";
import { useAxiosInterceptor } from "@/hooks/useAxiosInterceptor";
import { SEAT_API_END_POINT } from "@/utils/constant";
//import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetSeatById = (id) => {
  const dispatch = useDispatch();
  const api = useAxiosInterceptor(); // Use the custom Axios instance with interceptors
  useEffect(() => {
    const fetchSingleSeat = async () => {
      try {
        const res = await api.get(`${SEAT_API_END_POINT}/${id}`);

        if (res.data.success) {
          dispatch(setSingleSeat(res.data.seat));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSingleSeat();
  }, [id, dispatch]);
};

export default useGetSeatById;
