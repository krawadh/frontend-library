import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { MEMBER_API_END_POINT } from "@/utils/constant";
import useGetMemberById from "@/hooks/useGetMemberById";
import useGetAllAdminMemberships from "@/hooks/useGetAllAdminMemberships";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { setAllAdminMembers } from "../../redux/memberSlice";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import Navbar from "../shared/Navbar";

const AssignMembership = () => {
  const params = useParams();
  const selectedMember = params.id;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch member details when selectedMember changes
  useGetMemberById(params.id);

  // Fetch all membership details and set in redux store
  useGetAllAdminMemberships();

  const { allAdminMembers, singleMember } = useSelector(
    (store) => store.member
  );
  const { allAdminMemberships } = useSelector((store) => store.membership);

  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    membership: "",
    membershipFee: "",
    membershipExpiry: "",
  });
  const [date, setDate] = useState(); // Ensure default state is set correctly as a Date object

  // Handle input changes
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  // Handler for select changes
  const selectChangeHandler = (value, field) => {
    setInput({ ...input, [field]: value });
  };
  // Handle form submission
  const submitHandler = async (e) => {
    e.preventDefault();

    // Update membershipExpiry directly before submission
    const updatedInput = { ...input, membershipExpiry: date.toISOString() };
    try {
      setLoading(true);

      const res = await axios.patch(
        `${MEMBER_API_END_POINT}/${selectedMember}`,
        updatedInput
      );
      if (res.data.success) {
        // Update the members array
        const updatedMembers = updateMember(
          allAdminMembers,
          selectedMember,
          res?.data?.updatedMember
        );
        dispatch(setAllAdminMembers(updatedMembers));
        navigate("/admin/members");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message || "An error occurred.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Function to update a specific member
  const updateMember = (membersArray, memberId, updatedData) => {
    return membersArray.map((member) => {
      if (member._id === memberId) {
        //
        // Update the specific fields you want to change
        return {
          ...member,
          ...updatedData, // merging updated data into the member object
        };
      }
      return member; // return the other members unchanged
    });
  };

  // Update input state when singleMember changes
  useEffect(() => {
    if (singleMember) {
      setInput({
        membership: singleMember?.membership?._id || "",
        membershipFee: singleMember?.membershipFee || "",
      });
      setDate(
        singleMember?.membershipExpiry
          ? new Date(singleMember?.membershipExpiry)
          : new Date()
      );
    }
  }, [singleMember]);

  return (
    <div>
      {/* <Navbar /> */}
      <div className="flex items-center justify-center w-screen my-4">
        <form
          onSubmit={submitHandler}
          className="w-1/2 border border-gray-200 rounded-md p-4 my-10"
        >
          <div className="flex justify-between py-4">
            <h1 className="font-bold text-xl">Assign Membership to Member</h1>
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
                onChange={changeEventHandler}
                className="col-span-3 w-[280px]"
                disabled
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="membership" className="text-right">
                Membership
              </Label>
              <Select
                className="col-span-3 w-[280px]"
                name="membership"
                value={input.membership}
                onValueChange={(value) =>
                  selectChangeHandler(value, "membership")
                }
              >
                <SelectTrigger className="w-[278px] z-0">
                  <SelectValue placeholder="Select a Membership" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup className="overflow-y-scroll max-h-[12rem]">
                    {allAdminMemberships.map((value) => (
                      <SelectItem key={value._id} value={value._id}>
                        {`${value.membershipType}-${value.fee}-${value.duration}`}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="membershipFee" className="text-right">
                Fee
              </Label>
              <Input
                id="membershipFee"
                name="membershipFee"
                value={input.membershipFee}
                onChange={changeEventHandler}
                className="w-[280px] col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fee" className="text-right">
                Expiry
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex items-center justify-center">
              {loading ? (
                <Button className="flex items-center gap-2 my-4">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin flex items-center gap-2" />{" "}
                  Please wait
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

export default AssignMembership;
