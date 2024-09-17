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

const AssignMembership = () => {
  const params = useParams();
  const selectedMember = params.id;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useGetMemberById(params.id);
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
  const [date, setDate] = useState();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const selectChangeHandler = (value, field) => {
    setInput({ ...input, [field]: value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const updatedInput = { ...input, membershipExpiry: date.toISOString() };
    try {
      setLoading(true);
      const res = await axios.patch(
        `${MEMBER_API_END_POINT}/${selectedMember}`,
        updatedInput
      );
      if (res.data.success) {
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
        return { ...member, ...updatedData };
      }
      return member;
    });
  };

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
    <div className="flex items-center justify-center w-full my-4 px-4">
      <form
        onSubmit={submitHandler}
        className="w-full max-w-xl border border-gray-200 rounded-md p-4 my-10"
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
          <div className="grid sm:grid-cols-1 md:grid-cols-4 items-center gap-4">
            <Label htmlFor="fullName" className="text-right">
              Name
            </Label>
            <Input
              name="fullName"
              type="text"
              value={`${singleMember?.firstName} ${singleMember?.lastName}`}
              onChange={changeEventHandler}
              className="col-span-3 w-full"
              disabled
            />
          </div>
          <div className="grid sm:grid-cols-1 md:grid-cols-4 items-center gap-4">
            <Label htmlFor="membership" className="text-right">
              Membership
            </Label>
            <Select
              className="col-span-3 w-full"
              name="membership"
              value={input.membership}
              onValueChange={(value) =>
                selectChangeHandler(value, "membership")
              }
            >
              <SelectTrigger className="w-full">
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
          <div className="grid sm:grid-cols-1 md:grid-cols-4 items-center gap-4">
            <Label htmlFor="membershipFee" className="text-right">
              Fee
            </Label>
            <Input
              id="membershipFee"
              name="membershipFee"
              value={input.membershipFee}
              onChange={changeEventHandler}
              className="col-span-3 w-full"
            />
          </div>
          <div className="grid sm:grid-cols-1 md:grid-cols-4 items-center gap-4">
            <Label htmlFor="fee" className="text-right">
              Expiry
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
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
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
  );
};

export default AssignMembership;
