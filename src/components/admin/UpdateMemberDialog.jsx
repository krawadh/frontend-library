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
import { MEMBER_API_END_POINT } from "@/utils/constant";
import useGetMemberById from "@/hooks/useGetMemberById";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { setAllAdminMembers } from "../../redux/memberSlice";
import { useAxiosInterceptor } from "@/hooks/useAxiosInterceptor";

const UpdateMemberDialog = ({ open, setOpen, selectedMember }) => {
  const dispatch = useDispatch();
  const api = useAxiosInterceptor(); // Use the custom Axios instance with interceptors

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
    gender: "",
    profileImage: "",
  });

  // Update input state when singleMember changes
  useEffect(() => {
    if (singleMember) {
      setInput({
        firstName: singleMember.firstName || "",
        lastName: singleMember.lastName || "",
        email: singleMember.email || "",
        phone: singleMember.phone || "",
        gender: singleMember?.gender || "",
      });
    }
  }, [singleMember]);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    setInput({ ...input, profileImage: e.target.files?.[0] });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("firstName", input.firstName);
    formData.append("lastName", input.lastName);
    formData.append("email", input.email);
    formData.append("phone", input.phone);
    formData.append("gender", input.gender);

    if (input.profileImage) {
      formData.append("profileImage", input.profileImage);
    }
    try {
      setLoading(true);
      const res = await api.patch(`${MEMBER_API_END_POINT}/${selectedMember}`);
      if (res.data.success) {
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

  const handleClose = () => {
    setOpen(false);
    setInput({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      profileImage: "",
    });
  };

  const updateMember = (membersArray, memberId, updatedData) => {
    return membersArray.map((member) => {
      if (member._id === memberId) {
        return {
          ...member,
          ...updatedData,
        };
      }
      return member;
    });
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent
          className="sm:max-w-[425px] md:max-w-[600px] w-full"
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
              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                <Label htmlFor="firstName" className="sm:text-right">
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
              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                <Label htmlFor="lastName" className="sm:text-right">
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
              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="sm:text-right">
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
              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="sm:text-right">
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
              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                <Label htmlFor="gender" className="sm:text-right">
                  Gender
                </Label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <Input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={input.gender === "Male"}
                      onChange={changeEventHandler}
                      className="cursor-pointer"
                    />
                    <Label>Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={input.gender === "Female"}
                      onChange={changeEventHandler}
                      className="cursor-pointer"
                    />
                    <Label>Female</Label>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                <Label htmlFor="file" className="sm:text-right">
                  Profile Photo
                </Label>
                <Input
                  id="file"
                  name="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={changeFileHandler}
                  className="col-span-3 w-full"
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
