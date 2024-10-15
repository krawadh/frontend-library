import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { MEMBER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, Loader2 } from "lucide-react";
import { addMember, setLoading } from "../../redux/memberSlice";
import { useAxiosInterceptor } from "@/hooks/useAxiosInterceptor";

const MemberCreate = () => {
  const { loading } = useSelector((store) => store.member);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const api = useAxiosInterceptor(); // Use the custom Axios instance with interceptors
  const [input, setInput] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    gender: "",
    role: "",
    //file: "",
  });

  const changeEventHandler = (e) => {
    console.log(e.target.name, e.target.value);
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  // const changeFileHandler = (e) => {
  //   setInput({ ...input, file: e.target.files?.[0] });
  // };
  const submitHandler = async (e) => {
    e.preventDefault();
    // Directly set the values in the object before making the API call
    const updatedInput = {
      ...input,
      password: `${input.firstName}@123`,
      role: "Member",
    };
    // const formData = new FormData(); //formdata object
    // formData.append("firstName", input.firstName);
    // formData.append("lastName", input.lastName);
    // formData.append("email", input.email);
    // formData.append("phone", input.phone);
    // formData.append("password", `${input.firstName}@123`);
    // formData.append("gender", input.gender);
    // formData.append("role", "Member");
    // if (input.file) {
    //   formData.append("file", input.file);
    // }
    //console.log("formdata ......", formData);
    try {
      const res = await api.post(`${MEMBER_API_END_POINT}`, updatedInput);
      if (res.data.success) {
        dispatch(addMember(res.data.member));
        toast.success(res.data.message);
        navigate("/admin/members");
      }
    } catch (error) {
      console.log(error);
      if (error.response.data.error)
        return toast.error(error.response.data.error.message);
      toast.error(error.response.data.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    // if (user) {
    //   navigate("/");
    // }
  }, []);
  return (
    <div>
      <div className="flex items-center justify-center w-screen my-8 px-4 sm:px-6 lg:px-8">
        <form
          onSubmit={submitHandler}
          className="p-4 sm:p-8 max-w-lg sm:max-w-2xl lg:max-w-4xl w-full border border-gray-200 shadow-lg rounded-md"
        >
          <div className="flex justify-between py-4">
            <h1 className="font-bold text-xl">Add New Member</h1>
            <Button
              onClick={() => navigate("/admin/members")}
              variant="outline"
              className="flex items-center gap-2 text-gray-500 font-semibold"
            >
              <ArrowLeft /> Back
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>First Name</Label>
              <Input
                type="text"
                value={input.firstName}
                name="firstName"
                onChange={changeEventHandler}
                placeholder="Enter First Name"
              />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input
                type="text"
                value={input.lastName}
                name="lastName"
                onChange={changeEventHandler}
                placeholder="Enter Last Name"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
            <div className="my-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={input.email}
                name="email"
                onChange={changeEventHandler}
                placeholder="Enter Email "
              />
            </div>
            <div className="my-2">
              <Label>Phone Number</Label>
              <Input
                type="text"
                value={input.phone}
                name="phone"
                onChange={changeEventHandler}
                placeholder="Enter Phone No."
              />
            </div>
          </div>

          {/* <div className="my-2">
            <Label>Password</Label>
            <Input
              type="password"
              value={input.password}
              name="password"
              onChange={changeEventHandler}
              placeholder="password"
            />
          </div> */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
            <RadioGroup className="flex items-center gap-4 my-5">
              <div className="flex items-center space-x-2">
                <Input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={input.gender === "Male"}
                  onChange={changeEventHandler}
                  className="cursor-pointer"
                />
                <Label htmlFor="gender">Male</Label>
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
                <Label htmlFor="gender">Female</Label>
              </div>
            </RadioGroup>
          </div>
          {/* <div className="flex items-center justify-between">
            <RadioGroup className="flex items-center gap-4 my-5">
              <div className="flex items-center space-x-2">
                <Input
                  type="radio"
                  name="role"
                  value="Admin"
                  checked={input.role === "Admin"}
                  onChange={changeEventHandler}
                  className="cursor-pointer"
                />
                <Label htmlFor="r1">Admin</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  type="radio"
                  name="role"
                  value="Member"
                  checked={input.role === "Member"}
                  onChange={changeEventHandler}
                  className="cursor-pointer"
                />
                <Label htmlFor="r2">Member</Label>
              </div>
            </RadioGroup>
            <div className="flex items-center gap-2">
              <Label>Profile</Label>
              <Input
                accept="image/*"
                type="file"
                onChange={changeFileHandler}
                className="cursor-pointer"
              />
            </div> 
          </div>*/}
          {loading ? (
            <Button className="w-full my-4">
              {" "}
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait{" "}
            </Button>
          ) : (
            <Button type="submit" className="w-full my-4">
              Create New Member
            </Button>
          )}
        </form>
      </div>
    </div>
  );
};

export default MemberCreate;
