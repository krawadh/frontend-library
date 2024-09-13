import { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import AdminMembershipsTable from "./AdminMembershipsTable.jsx";
import useGetAllAdminMemberships from "@/hooks/useGetAllAdminMemberships";
import { setSearchMembershipByText } from "@/redux/membershipSlice";

const AdminMemberships = () => {
  useGetAllAdminMemberships();
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchMembershipByText(input));
  }, [input]);
  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto my-10">
        <div className="flex items-center justify-between my-5">
          <Input
            className="w-80"
            placeholder="Filter by membership, duration, available"
            onChange={(e) => setInput(e.target.value)}
          />
          <Button onClick={() => navigate("/admin/membership/create")}>
            New Membership
          </Button>
        </div>
        <AdminMembershipsTable />
      </div>
    </div>
  );
};

export default AdminMemberships;
