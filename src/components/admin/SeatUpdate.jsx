import { useEffect, useState } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import useGetSeatById from "@/hooks/useGetSeatById";

const SeatUpdate = () => {
  const params = useParams();
  useGetSeatById(params.id);

  const [input, setInput] = useState({
    seatNumber: "",
    seatType: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //const { user } = useSelector((store) => store.auth);
  const { singleSeat } = useSelector((store) => store.seat);
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  const selectChangeHandler = (value) => {
    setInput({ ...input, seatType: value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      //setInput({ ...input, createdBy: user.id });
      setLoading(true);
      const res = await axios.patch(
        `${SEAT_API_END_POINT}/${params.id}`,
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          //withCredentials: true,
        }
      );
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
    setInput({
      seatNumber: singleSeat.seatNumber || "",
      seatType: singleSeat.seatType || "",
    });
  }, [singleSeat]);

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center w-screen my-4">
        <form
          onSubmit={submitHandler}
          className="p-4 max-w-4xl border border-gray-200 shadow-lg rounded-md"
        >
          <div className="flex justify-between py-4">
            <h1 className="font-bold text-xl">Membership</h1>
            <Button
              onClick={() => navigate("/admin/seats")}
              variant="outline"
              className="flex items-center gap-2 text-gray-500 font-semibold"
            >
              <ArrowLeft />
              <span>Back</span>
            </Button>
          </div>
          <div>
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
                <Select
                  onValueChange={selectChangeHandler}
                  value={input.seatType}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue
                      placeholder={input.seatType || "Select a Company"}
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
          </div>
          {loading ? (
            <Button className="w-full my-4">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
            </Button>
          ) : (
            <Button type="submit" className="w-full my-4">
              Update Membership
            </Button>
          )}
        </form>
      </div>
    </div>
  );
};

export default SeatUpdate;
