import { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "@/components/ui/textarea";
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
import {
  MEMBERSHIP_API_END_POINT,
  MEMBERSHIP_TYPE,
  MEMBERSHIP_DURATION,
} from "@/utils/constant";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";

const MembershipCreate = () => {
  const { user } = useSelector((store) => store.auth);
  const [input, setInput] = useState({
    membershipType: "",
    fee: "",
    duration: "",
    description: "",
    createdBy: user.id,
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const selectChangeHandler = (value, field) => {
    setInput({ ...input, [field]: value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(`${MEMBERSHIP_API_END_POINT}`, input, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/memberships");
      }
    } catch (error) {
      toast.error(error.response.data.error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center w-screen my-8 px-4 sm:px-6 lg:px-8">
        <form
          onSubmit={submitHandler}
          className="p-4 sm:p-8 max-w-lg sm:max-w-2xl lg:max-w-4xl w-full border border-gray-200 shadow-lg rounded-md"
        >
          <div className="flex justify-between py-4">
            <h1 className="font-bold text-xl">Membership</h1>
            <Button
              onClick={() => navigate("/admin/memberships")}
              variant="outline"
              className="flex items-center gap-2 text-gray-500 font-semibold"
            >
              <ArrowLeft />
              Back
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Membership Type</Label>
              <Select
                name="membershipType"
                onValueChange={(value) =>
                  selectChangeHandler(value, "membershipType")
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {MEMBERSHIP_TYPE.map((value) => (
                      <SelectItem key={value} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Fee</Label>
              <Input
                type="text"
                name="fee"
                value={input.fee}
                onChange={changeEventHandler}
                placeholder="Enter fee"
                className="w-full"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
            <div>
              <Label>Duration</Label>
              <Select
                name="duration"
                onValueChange={(value) =>
                  selectChangeHandler(value, "duration")
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {MEMBERSHIP_DURATION.map((value) => (
                      <SelectItem key={value} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 my-4">
            <Label>Description</Label>
            <Textarea
              className="w-full"
              placeholder="Type your message here."
              name="description"
              value={input.description}
              onChange={changeEventHandler}
            />
          </div>
          {loading ? (
            <Button className="w-full my-4">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
            </Button>
          ) : (
            <Button type="submit" className="w-full my-4">
              Add New Membership
            </Button>
          )}
        </form>
      </div>
    </div>
  );
};

export default MembershipCreate;
