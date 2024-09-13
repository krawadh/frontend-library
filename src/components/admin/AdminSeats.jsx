import { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import AdminSeatsTable from "./AdminSeatsTable";
import useGetAllAdminSeats from "@/hooks/useGetAllAdminSeats";
import { setSearchSeatByText } from "@/redux/seatSlice";

const AdminSeats = () => {
  useGetAllAdminSeats();
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchSeatByText(input));
  }, [input]);
  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto my-10">
        <div className="flex items-center justify-between my-5">
          <Input
            className="w-80"
            placeholder="Filter by seat no, reserved by, available"
            onChange={(e) => setInput(e.target.value)}
          />
          <Button onClick={() => navigate("/admin/seat/create")}>
            New Seats
          </Button>
        </div>
        <AdminSeatsTable />
      </div>
    </div>
  );
};

export default AdminSeats;
