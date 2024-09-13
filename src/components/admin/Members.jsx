import { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import MembersTable from "./MembersTable";
import useGetAllMembers from "@/hooks/useGetAllMembers";
import { setSearchMemberByText } from "@/redux/memberSlice";

const Members = () => {
  useGetAllMembers();
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchMemberByText(input));
  }, [input]);
  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto my-10">
        <div className="flex items-center justify-between my-5">
          <Input
            className="w-80"
            placeholder="Filter by name"
            onChange={(e) => setInput(e.target.value)}
          />
          <Button onClick={() => navigate("/admin/member/create")}>
            New Member
          </Button>
        </div>
        <MembersTable />
      </div>
    </div>
  );
};

export default Members;
