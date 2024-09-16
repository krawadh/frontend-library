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
      {/* <Navbar /> */}
      <div className="max-w-6xl mx-auto my-10 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between my-5 gap-4">
          <Input
            className="w-full sm:w-80"
            placeholder="Filter by membership, duration, available"
            onChange={(e) => setInput(e.target.value)}
          />
          <Button
            className="w-full sm:w-auto"
            onClick={() => navigate("/admin/membership/create")}
          >
            New Membership
          </Button>
        </div>
        <AdminMembershipsTable />
      </div>
    </div>
  );
};

export default AdminMemberships;
