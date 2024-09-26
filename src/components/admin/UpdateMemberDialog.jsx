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
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { setAllAdminMembers } from "../../redux/memberSlice";
//import useGetAllMembers from "@/hooks/useGetAllMembers";

const UpdateMemberDialog = ({ open, setOpen, selectedMember }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch member details when selectedMember changes
  useGetMemberById(selectedMember);

  const { allAdminMembers, singleMember } = useSelector(
    (store) => store.member
  );
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  // Update input state when singleMember changes
  useEffect(() => {
    if (singleMember) {
      setInput({
        firstName: singleMember.firstName || "",
        lastName: singleMember.lastName || "",
        email: singleMember.email || "",
        phone: singleMember.phone || "",
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
        // Update the members array
        const updatedMembers = updateMember(
          allAdminMembers,
          selectedMember,
          res?.data?.updatedMember
        );
        dispatch(setAllAdminMembers(updatedMembers));
        setOpen(false);
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

  // Reset form and dialog state when closed
  const handleClose = () => {
    setOpen(false);
    setInput({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
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

  return (
    <div>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent
          className="sm:max-w-[425px]"
          onInteractOutside={handleClose}
        >
          <DialogHeader>
            <DialogTitle>Update Profile</DialogTitle>
            <DialogDescription>
              Update the details of the selected member.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitHandler}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="firstName" className="text-right">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={input.firstName}
                  onChange={changeEventHandler}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lastName" className="text-right">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={input.lastName}
                  onChange={changeEventHandler}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={input.email}
                  onChange={changeEventHandler}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={input.phone}
                  onChange={changeEventHandler}
                  className="col-span-3"
                />
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

export default UpdateMemberDialog;
