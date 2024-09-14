import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { MEMBER_API_END_POINT } from "@/utils/constant";
import useGetMemberById from "@/hooks/useGetMemberById";
import useGetAllAdminSeats from "@/hooks/useGetAllAdminSeats";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { setAllAdminMembers } from "../../redux/memberSlice";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import Navbar from "../shared/Navbar";
import TimePickerDemo from "../ui/TimePickerDemo";
import { useForm, Controller } from "react-hook-form"; // Import react-hook-form

const AssignSeat = () => {
  const { control, handleSubmit } = useForm(); // Setup form control with react-hook-form
  const params = useParams();
  const selectedMember = params.id;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useGetMemberById(params.id);
  useGetAllAdminSeats();

  const { allAdminMembers, singleMember } = useSelector(
    (store) => store.member
  );
  const { allAdminSeats } = useSelector((store) => store.seat);

  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    seat: "",
    reservedBy: selectedMember,
    reservationStartTime: "",
    reservationEndTime: "", // Add this to keep track of the seat
  });
  const [startDate, setStartDate] = useState(new Date()); // Date state for start time
  const [endDate, setEndDate] = useState(new Date()); // Separate state for end time

  // const changeEventHandler = (e) => {
  //   setInput({ ...input, [e.target.name]: e.target.value });
  // };

  const selectChangeHandler = (value, field) => {
    setInput({ ...input, [field]: value });
  };

  const submitHandler = async () => {
    setLoading(true);

    const updatedInput = {
      ...input,
      reservationStartTime: startDate.toString(),
      reservationEndTime: endDate.toString(), // Use the correct date state
    };
    console.log("updatedInput", updatedInput);
    try {
      const res = await axios.patch(
        `${MEMBER_API_END_POINT}/assignSeat/${selectedMember}`,
        updatedInput
      );
      if (res.data.success) {
        console.log("hello.....", res?.data?.updatedMember);
        const updatedMembers = updateMember(
          allAdminMembers,
          selectedMember,
          res?.data?.updatedMember
        );
        console.log("updated membrer-----", updatedMembers);
        dispatch(setAllAdminMembers(updatedMembers));
        navigate("/admin/members");
        toast.success(res.data.message);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An error occurred.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateMember = (membersArray, memberId, updatedData) => {
    return membersArray.map((member) => {
      if (member._id === memberId) {
        return { ...member, reservation: updatedData };
      }
      return member;
    });
  };

  useEffect(() => {
    if (singleMember) {
      // Pre-populate with current time or specific time from singleMember if available
      const currentDate = new Date();
      setStartDate(currentDate); // Default to current time for start
      setEndDate(currentDate); // Default to current time for end

      // Fetch and populate reserved seat data from API
      const fetchReservationByMember = async () => {
        try {
          const res = await axios.get(
            `${MEMBER_API_END_POINT}/assignSeat/${selectedMember}`,
            {
              //withCredentials: true,
            }
          );
          if (res.data.success) {
            setInput({ ...input, seat: res.data.reservedByMember[0].seat._id });
            console.log("reservedByMember", res.data.reservedByMember[0]);

            // If the reservation has specific start and end times, pre-fill them
            if (res.data.reservedByMember[0].reservationStartTime) {
              setStartDate(
                new Date(res.data.reservedByMember[0].reservationStartTime)
              );
            }
            if (res.data.reservedByMember[0].reservationEndTime) {
              setEndDate(
                new Date(res.data.reservedByMember[0].reservationEndTime)
              );
            }
          }
        } catch (error) {
          console.log(error);
        }
      };

      fetchReservationByMember();
    }
  }, [singleMember, selectedMember]);

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center w-screen my-4">
        <form
          onSubmit={handleSubmit(submitHandler)}
          className="w-1/2 border border-gray-200 rounded-md p-4 my-10"
        >
          <div className="flex justify-between py-4">
            <h1 className="font-bold text-xl">Assign Seat to Member</h1>
            <Button
              onClick={() => navigate("/admin/members")}
              variant="outline"
              className="flex items-center gap-2 text-gray-500 font-semibold"
            >
              <ArrowLeft />
              Back
            </Button>
          </div>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fullName" className="text-right">
                Name
              </Label>
              <Input
                name="fullName"
                type="text"
                value={`${singleMember?.firstName} ${singleMember?.lastName}`}
                className="col-span-3 w-[280px]"
                disabled
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="seat" className="text-right">
                Seat Number
              </Label>
              <Select
                className="col-span-3 w-[280px]"
                name="seat"
                value={input.seat}
                onValueChange={(value) => selectChangeHandler(value, "seat")}
              >
                <SelectTrigger className="w-[278px] z-0">
                  <SelectValue placeholder="Select a Seat" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup className="overflow-y-scroll max-h-[12rem]">
                    {allAdminSeats.map((value) => (
                      <SelectItem key={value._id} value={value._id}>
                        {`${value.seatNumber}-${value.seatType}`}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startTime" className="text-right">
                Start Time
              </Label>
              <div className="p-3 border-t border-border">
                <Controller
                  name="startTime"
                  control={control}
                  render={({ field }) => (
                    <TimePickerDemo
                      setDate={(date) => {
                        field.onChange(date);
                        setStartDate(date); // Update startDate state
                      }}
                      date={field.value || startDate}
                    />
                  )}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endTime" className="text-right">
                End Time
              </Label>
              <div className="p-3 border-t border-border">
                <Controller
                  name="endTime"
                  control={control}
                  render={({ field }) => (
                    <TimePickerDemo
                      setDate={(date) => {
                        field.onChange(date);
                        setEndDate(date); // Update endDate state
                      }}
                      date={field.value || endDate}
                    />
                  )}
                />
              </div>
            </div>
            <div className="flex items-center justify-center">
              {loading ? (
                <Button className="flex items-center gap-2 my-4">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                </Button>
              ) : (
                <Button type="submit" className="flex items-center gap-2 my-4">
                  Update Membership
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignSeat;
