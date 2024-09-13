import { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import axios from "axios";
import { SEAT_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const SeatCreate = () => {
  const [input, setInput] = useState({
    seatNumber: "",
    seatType: "",
    createdBy: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { user } = useSelector((store) => store.auth);
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  const selectChangeHandler = (value) => {
    setInput({ ...input, seatType: value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setInput({ ...input, createdBy: user.id });
      setLoading(true);
      const res = await axios.post(`${SEAT_API_END_POINT}`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        //withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/seats");
      }
    } catch (error) {
      toast.error(error.response.data.error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center w-screen my-5">
        <form
          onSubmit={submitHandler}
          className="p-8 max-w-4xl border border-gray-200 shadow-lg rounded-md"
        >
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Seat Number</Label>
              <Input
                type="text"
                name="seatNumber"
                value={input.seatNumber}
                onChange={changeEventHandler}
                placeholder="Enter seat no"
                // className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>
            <div>
              <Label>Seat Type</Label>
              <Select onValueChange={selectChangeHandler}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a Company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Normal">Normal</SelectItem>
                    <SelectItem value="Cabin">Cabin</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          {loading ? (
            <Button className="w-full my-4">
              {" "}
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait{" "}
            </Button>
          ) : (
            <Button type="submit" className="w-full my-4">
              Add New Seat
            </Button>
          )}
        </form>
      </div>
    </div>
  );
};

export default SeatCreate;
