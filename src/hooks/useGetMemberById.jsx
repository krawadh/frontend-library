import { setSingleMember } from "@/redux/memberSlice";
import { MEMBER_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetMemberById = (id) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchSingleMember = async () => {
      try {
        const res = await axios.get(
          `${MEMBER_API_END_POINT}/${id}`
          // { withCredentials: true }
        );

        if (res.data.success) {
          dispatch(setSingleMember(res.data.member));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSingleMember();
  }, [id]);
};

export default useGetMemberById;
