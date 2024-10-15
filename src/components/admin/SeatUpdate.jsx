import { useEffect, useState } from "react";
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
//import axios from "axios";
import { SEAT_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import useGetSeatById from "@/hooks/useGetSeatById";
import { useAxiosInterceptor } from "@/hooks/useAxiosInterceptor";

const SeatUpdate = () => {
  const navigate = useNavigate();
  const api = useAxiosInterceptor(); // Use the custom Axios instance with interceptors
  const params = useParams();
  useGetSeatById(params.id);
  const { singleSeat } = useSelector((store) => store.seat);
  const [input, setInput] = useState({
    seatNumber: "",
    seatType: "",
  });
  const [loading, setLoading] = useState(false);

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
      const res = await api.patch(`${SEAT_API_END_POINT}/${params.id}`, input);
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

  useEffect(() => {
    if (singleSeat) {
      setInput({
        seatNumber: singleSeat.seatNumber || "",
        seatType: singleSeat.seatType || "",
      });
    }
  }, [singleSeat]);

  return (
    <div>
      {/* <Navbar /> */}
      <div className="flex items-center justify-center w-full my-4 px-4">
        <form
          onSubmit={submitHandler}
          className="p-6 max-w-4xl w-full border border-gray-200 shadow-lg rounded-md"
        >
          <div className="flex justify-between py-4">
            <h1 className="font-bold text-xl">Seat Update</h1>
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
                value={input?.seatNumber}
                onChange={changeEventHandler}
                placeholder="Enter seat number"
                className="w-full"
              />
            </div>
            <div>
              <Label>Seat Type</Label>
              <Select
                onValueChange={selectChangeHandler}
                value={input.seatType}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={input.seatType || "Select a Seat Type"}
                  />
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
              Update Seat
            </Button>
          )}
        </form>
      </div>
    </div>
  );
};

export default SeatUpdate;
