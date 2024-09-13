import { setAllAdminMemberships } from "@/redux/membershipSlice";
import { MEMBERSHIP_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllAdminMemberships = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllAdminMemberships = async () => {
      try {
        const res = await axios.get(`${MEMBERSHIP_API_END_POINT}`, {
          //withCredentials: true,
        });
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
