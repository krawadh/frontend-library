import { setAllAdminMembers } from "@/redux/memberSlice";
import { MEMBER_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllMembers = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllAdminMembers = async () => {
      try {
        const res = await axios.get(`${MEMBER_API_END_POINT}`, {
          //withCredentials: true,
        });
        console.log("all members", res.data);
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
