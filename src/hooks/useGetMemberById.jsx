import { setSingleMember } from "@/redux/memberSlice";
import { useAxiosInterceptor } from "@/hooks/useAxiosInterceptor";
import { MEMBER_API_END_POINT } from "@/utils/constant";
//import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetMemberById = (id) => {
  const dispatch = useDispatch();
  const api = useAxiosInterceptor(); // Use the custom Axios instance with interceptors
  useEffect(() => {
    const fetchSingleMember = async () => {
      try {
        const res = await api.get(`${MEMBER_API_END_POINT}/${id}`);

        if (res.data.success) {
          dispatch(setSingleMember(res.data.member));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSingleMember();
  }, [id, dispatch]);
};

export default useGetMemberById;
