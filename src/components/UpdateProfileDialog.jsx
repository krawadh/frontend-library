import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setLoading, setUser } from "@/redux/authSlice";
import { toast } from "sonner";
import { RadioGroup } from "./ui/radio-group";

const UpdateProfileDialog = ({ open, setOpen }) => {
  const { loading, user } = useSelector((store) => store.auth);

  const [input, setInput] = useState({
    id: user?.id || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    gender: user?.gender || "",
    profileImage: "",
  });

  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    setInput({ ...input, profileImage: e.target.files?.[0] });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("id", input.id);
    formData.append("firstName", input.firstName);
    formData.append("lastName", input.lastName);
    formData.append("email", input.email);
    formData.append("phone", input.phone);
    formData.append("gender", input.gender);

    if (input.profileImage) {
      formData.append("profileImage", input.profileImage);
    }
    try {
      dispatch(setLoading(true));
      const res = await axios.patch(
        `${USER_API_END_POINT}/update-profile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          //withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        setOpen(false);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={() => setOpen(false)}>
        <DialogContent
          className="sm:max-w-[425px] md:max-w-[600px] w-full" // Responsive width
          onInteractOutside={() => setOpen(false)}
        >
          <DialogHeader>
            <DialogTitle>Update Profile</DialogTitle>
            <DialogDescription>
              Update the details of the loggedin user.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitHandler}>
            <div className="grid gap-4 py-4">
              {/* First Name */}
              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                <Label htmlFor="firstName" className="text-right sm:text-left">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={input.firstName}
                  onChange={changeEventHandler}
                  className="col-span-3 w-full"
                />
              </div>

              {/* Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                <Label htmlFor="lastName" className="text-right sm:text-left">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={input.lastName}
                  onChange={changeEventHandler}
                  className="col-span-3 w-full"
                />
              </div>

              {/* Email */}
              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right sm:text-left">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  disabled
                  value={input.email}
                  onChange={changeEventHandler}
                  className="col-span-3 w-full"
                />
              </div>

              {/* Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right sm:text-left">
                  Phone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={input.phone}
                  onChange={changeEventHandler}
                  className="col-span-3 w-full"
                />
              </div>

              {/* Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                <Label htmlFor="gender" className="text-right sm:text-left">
                  Gender
                </Label>
                <div className="flex items-center justify-start gap-4">
                  <RadioGroup className="flex items-center gap-4">
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
                  </RadioGroup>
                </div>
              </div>

              {/* File Upload */}
              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                <Label htmlFor="file" className="text-right sm:text-left">
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

            {/* Footer */}
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

export default UpdateProfileDialog;
