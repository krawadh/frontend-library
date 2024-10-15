import { setAllAdminMembers } from "@/redux/memberSlice";
import { useAxiosInterceptor } from "@/hooks/useAxiosInterceptor";
import { MEMBER_API_END_POINT } from "@/utils/constant";
//import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllMembers = () => {
  const dispatch = useDispatch();
  const api = useAxiosInterceptor(); // Use the custom Axios instance with interceptors
  useEffect(() => {
    const fetchAllAdminMembers = async () => {
      try {
        const res = await api.get(`${MEMBER_API_END_POINT}`);
        if (res.data.success) {
          dispatch(setAllAdminMembers(res.data.members));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllAdminMembers();
  }, []);
};

export default useGetAllMembers;
