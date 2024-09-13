import { setSingleMembership } from "@/redux/membershipSlice";
import { MEMBERSHIP_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetMembershipById = (id) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchSingleMembership = async () => {
      try {
        const res = await axios.get(
          `${MEMBERSHIP_API_END_POINT}/${id}`
          // { withCredentials: true }
        );

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
