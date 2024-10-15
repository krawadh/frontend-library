import { setSingleMembership } from "@/redux/membershipSlice";
import { useAxiosInterceptor } from "@/hooks/useAxiosInterceptor";
import { MEMBERSHIP_API_END_POINT } from "@/utils/constant";
//import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetMembershipById = (id) => {
  const dispatch = useDispatch();
  const api = useAxiosInterceptor(); // Use the custom Axios instance with interceptors
  useEffect(() => {
    const fetchSingleMembership = async () => {
      try {
        const res = await api.get(`${MEMBERSHIP_API_END_POINT}/${id}`);

        if (res.data.success) {
          dispatch(setSingleMembership(res.data.membership));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSingleMembership();
  }, [id, dispatch]);
};

export default useGetMembershipById;
