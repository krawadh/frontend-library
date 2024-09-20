import { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import MembersTable from "./MembersTable";
//import useGetAllMembers from "@/hooks/useGetAllMembers";
import {
  setSearchMemberByText,
  setAllAdminMembers,
  setLoading,
  setErrmessage,
} from "@/redux/memberSlice";

import { MEMBER_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import Loader from "../shared/Loader";

const Members = () => {
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((store) => store.member);

  // Fetch all members and dispatch filter input to the Redux store
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await axios.get(`${MEMBER_API_END_POINT}`, {
          //withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setAllAdminMembers(res.data.members));
          dispatch(setLoading(false));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchMembers();
  }, [dispatch]);

  useEffect(() => {
    dispatch(setSearchMemberByText(input));
  }, [input]);

  const handleInputChange = (e) => setInput(e.target.value);

  return (
    <div>
      {/* <Navbar /> */}
      <div className="max-w-6xl mx-auto my-10 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between my-5 gap-4">
          <Input
            className="w-full sm:w-80"
            placeholder="Filter by name"
            value={input}
            onChange={handleInputChange}
          />
          <Button
            className="w-full sm:w-auto"
            onClick={() => navigate("/admin/member/create")}
          >
            New Member
          </Button>
        </div>
        {loading ? <Loader /> : <MembersTable />}
      </div>
    </div>
  );
};

export default Members;
