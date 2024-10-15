import { useEffect, useState } from "react";
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
import {
  MEMBERSHIP_API_END_POINT,
  MEMBERSHIP_TYPE,
  MEMBERSHIP_DURATION,
} from "@/utils/constant";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import useGetMembershipById from "@/hooks/useGetMembershipById";
import { useAxiosInterceptor } from "@/hooks/useAxiosInterceptor";

const MembershipUpdate = () => {
  const api = useAxiosInterceptor(); // Use the custom Axios instance with interceptors
  const params = useParams();
  useGetMembershipById(params.id);

  const [input, setInput] = useState({
    membershipType: "",
    fee: "",
    duration: "",
    description: "",
  });

  const { singleMembership } = useSelector((store) => store.membership);
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
      const res = await api.patch(
        `${MEMBERSHIP_API_END_POINT}/${params.id}`,
        input
      );
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

  useEffect(() => {
    if (singleMembership) {
      setInput({
        membershipType: singleMembership?.membershipType || "",
        fee: singleMembership?.fee || "",
        duration: singleMembership?.duration || "",
        description: singleMembership?.description || "",
      });
    }
  }, [singleMembership]);

  return (
    <div>
      {/* <Navbar /> */}
      <div className="flex items-center justify-center w-screen px-4 sm:px-6 lg:px-8 my-4">
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
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Membership Type</Label>
                <Select
                  name="membershipType"
                  value={input.membershipType}
                  onValueChange={(value) =>
                    selectChangeHandler(value, "membershipType")
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={input.membershipType || "Select a type"}
                    />
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
                  value={input.duration}
                  onValueChange={(value) =>
                    selectChangeHandler(value, "duration")
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={input.duration || "Select a duration"}
                    />
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
            <div className="grid grid-cols-1 w-full gap-4 my-4">
              <Label>Description</Label>
              <Textarea
                className="w-full"
                placeholder="Type your message here."
                name="description"
                value={input.description}
                onChange={changeEventHandler}
              />
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

export default MembershipUpdate;
