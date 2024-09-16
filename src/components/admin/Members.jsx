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
  const { loading, allAdminMembers } = useSelector((store) => store.member);

  // Fetch all members and dispatch filter input to the Redux store
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await axios.get(`${MEMBER_API_END_POINT}`, {
          //withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setAllAdminMembers(res.data.members));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchMembers();
    dispatch(setLoading(false));
  }, []);

  useEffect(() => {
    dispatch(setSearchMemberByText(input));
  }, [input]);

  const handleInputChange = (e) => setInput(e.target.value);
  const handleNewMemberClick = () => navigate("/admin/member/create");

  return (
    <div>
      {/* <Navbar /> */}
      <div className="max-w-6xl mx-auto my-10">
        <div className="flex items-center justify-between my-5">
          <Input
            className="w-80"
            placeholder="Filter by name"
            value={input}
            onChange={handleInputChange}
          />
          <Button onClick={handleNewMemberClick}>New Member</Button>
        </div>
        {loading ? <Loader /> : <MembersTable />}
      </div>
    </div>
  );
};

export default Members;
