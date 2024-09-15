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
import { ArrowLeft, Loader2 } from "lucide-react";

const SeatCreate = () => {
  const { user } = useSelector((store) => store.auth);
  const [input, setInput] = useState({
    seatNumber: "",
    seatType: "",
    createdBy: user.id,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const selectChangeHandler = (value) => {
    setInput({ ...input, seatType: value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(`${SEAT_API_END_POINT}`, input, {
        headers: {
          "Content-Type": "application/json",
        },
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
      <div className="flex items-center justify-center w-full my-5 px-4">
        <form
          onSubmit={submitHandler}
          className="p-8 w-full max-w-4xl border border-gray-200 shadow-lg rounded-md"
        >
          <div className="flex justify-between py-4">
            <h1 className="font-bold text-xl">Seat Add</h1>
            <Button
              onClick={() => navigate("/admin/seats")}
              variant="outline"
              className="flex items-center gap-2 text-gray-500 font-semibold"
            >
              <ArrowLeft />
              <span>Back</span>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Seat Number</Label>
              <Input
                type="text"
                name="seatNumber"
                value={input.seatNumber}
                onChange={changeEventHandler}
                placeholder="Enter seat number"
                className="w-full"
              />
            </div>
            <div>
              <Label>Seat Type</Label>
              <Select onValueChange={selectChangeHandler}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a Seat Type" />
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
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
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
