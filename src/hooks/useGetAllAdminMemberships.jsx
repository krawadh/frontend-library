import { setAllAdminMemberships } from "@/redux/membershipSlice";
import { useAxiosInterceptor } from "@/hooks/useAxiosInterceptor";
import { MEMBERSHIP_API_END_POINT } from "@/utils/constant";
//import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllAdminMemberships = () => {
  const dispatch = useDispatch();
  const api = useAxiosInterceptor(); // Use the custom Axios instance with interceptors
  useEffect(() => {
    const fetchAllAdminMemberships = async () => {
      try {
        const res = await api.get(`${MEMBERSHIP_API_END_POINT}`);
        console.log(res.data);
        if (res.data.success) {
          dispatch(setAllAdminMemberships(res.data.memberships));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllAdminMemberships();
  }, []);
};

export default useGetAllAdminMemberships;
