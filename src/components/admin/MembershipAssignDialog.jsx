import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { MEMBER_API_END_POINT } from "@/utils/constant";
import useGetMemberById from "@/hooks/useGetMemberById";
import useGetAllAdminMemberships from "@/hooks/useGetAllAdminMemberships";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
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

const MembershipAssignDialog = ({ open, setOpen, selectedMember }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date()); // Ensure default state is set correctly as a Date object

  // Fetch member details when selectedMember changes
  useGetMemberById(selectedMember);

  // Fetch all membership details and set in redux store
  useGetAllAdminMemberships();

  const { allAdminMembers, singleMember } = useSelector(
    (store) => store.member
  );
  const { allAdminMemberships } = useSelector((store) => store.membership);

  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    membershipType: "",
  });

  // Update input state when singleMember changes
  useEffect(() => {
    if (singleMember) {
      setInput({
        firstName: singleMember.firstName || "",
        lastName: singleMember.lastName || "",
        email: singleMember.email || "",
        phone: singleMember.phone || "",
        membershipType: singleMember.membershipType || "",
      });
    }
  }, [singleMember]);

  // Handle input changes
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.patch(
        `${MEMBER_API_END_POINT}/${selectedMember}`,
        input
      );
      if (res.data.success) {
        navigate("/admin/members");
        // Update the members array
        const updatedMembers = updateMember(
          allAdminMembers,
          selectedMember,
          res?.data?.updatedMember
        );
        dispatch(setAllAdminMembers(updatedMembers));

        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message || "An error occurred.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  // Reset form and dialog state when closed
  const handleClose = () => {
    setOpen(false);
    setInput({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      membershipType: "",
    });
  };

  // Function to update a specific member
  const updateMember = (membersArray, memberId, updatedData) => {
    return membersArray.map((member) => {
      if (member._id === memberId) {
        // Update the specific fields you want to change
        return {
          ...member,
          ...updatedData, // merging updated data into the member object
        };
      }
      return member; // return the other members unchanged
    });
  };

  // Handler for select changes
  const selectChangeHandler = (value, field) => {
    setInput({ ...input, [field]: value });
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent
          className="sm:max-w-[425px]"
          onInteractOutside={handleClose}
        >
          <DialogHeader>
            <DialogTitle>Assign Membership</DialogTitle>
            <DialogDescription>
              Assign membership and fee to the selected member.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitHandler}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="firstName" className="text-right">
                  Name
                </Label>
                <Input
                  name="name"
                  type="text"
                  value={`${input.firstName} ${input.lastName}`}
                  onChange={changeEventHandler}
                  className="col-span-3 z-0"
                  disabled
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="membershipType" className="text-right">
                  Membership
                </Label>
                <Select
                  className="z-0"
                  name="membershipType"
                  onValueChange={(value) =>
                    selectChangeHandler(value, "membershipType")
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
                <Label htmlFor="fee" className="text-right">
                  Fee
                </Label>
                <Input
                  id="fee"
                  name="fee"
                  value={input.fee}
                  onChange={changeEventHandler}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
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
            </div>
            <DialogFooter>
              {loading ? (
                <Button className="w-full my-4">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                </Button>
              ) : (
                <Button type="submit" className="w-full my-4">
                  Update
                </Button>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MembershipAssignDialog;
