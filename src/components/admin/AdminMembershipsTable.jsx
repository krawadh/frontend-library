import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Edit2, Eye, Loader2, MoreHorizontal, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MEMBERSHIP_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { setAllAdminMemberships } from "@/redux/membershipSlice";

const AdminMembershipsTable = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { allAdminMemberships, searchMembershipByText } = useSelector(
    (store) => store.membership
  );

  const [filterMemberships, setFilterMemberships] =
    useState(allAdminMemberships);
  const navigate = useNavigate();

  useEffect(() => {
    const filteredMemberships = allAdminMemberships.filter((membership) => {
      if (!searchMembershipByText) {
        return true;
      }

      return (
        membership?.membershipType
          ?.toLowerCase()
          .includes(searchMembershipByText.toLowerCase()) ||
        membership?.duration
          .toLowerCase()
          .includes(searchMembershipByText.toLowerCase())
      );
    });
    setFilterMemberships(filteredMemberships);
  }, [setAllAdminMemberships, allAdminMemberships, searchMembershipByText]);

  const removeHandler = async (id) => {
    try {
      setLoading(true);
      const res = await axios.delete(`${MEMBERSHIP_API_END_POINT}/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
        //withCredentials: true,
      });
      console.log("before deletion----", filterMemberships);
      console.log(res.data.success);
      if (res.data.success) {
        const afterDeleted = filterMemberships.filter((e) => {
          console.log(e._id, id);
          return e._id !== id;
        });
        console.log("after deletion---", afterDeleted);
        toast.success(res.data.message);
        dispatch(setAllAdminMemberships(afterDeleted));
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <Table>
        <TableCaption>A list of your recent added Memberships.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="">Membership Type</TableHead>
            <TableHead>Fee</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Available</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filterMemberships?.map((member) => (
            <TableRow key={member._id}>
              <TableCell>{member?.membershipType}</TableCell>
              <TableCell>{member?.fee}</TableCell>
              <TableCell>{member?.duration}</TableCell>
              <TableCell>{member?.isActive ? "Yes" : "No"}</TableCell>
              <TableCell>{member?.description}</TableCell>

              <TableCell className="text-right cursor-pointer">
                <Popover>
                  <PopoverTrigger>
                    <MoreHorizontal />
                  </PopoverTrigger>
                  <PopoverContent className="w-32">
                    <div
                      onClick={() =>
                        navigate(`/admin/membership/${member._id}`)
                      }
                      className="flex items-center gap-2 w-fit cursor-pointer"
                    >
                      <Edit2 className="w-4" />
                      <span>Edit</span>
                    </div>
                    {/* <div
                      onClick={() =>
                        navigate(`/admin/jobs/${member._id}/applicants`)
                      }
                      className="flex items-center w-fit gap-2 cursor-pointer mt-2"
                    >
                      <Eye className="w-4" />
                      <span>Member Allotment</span>
                    </div> */}
                    {loading ? (
                      <Button className="w-full my-4">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                        wait
                      </Button>
                    ) : (
                      <div
                        onClick={() => removeHandler(member._id)}
                        className="flex items-center w-fit gap-2 cursor-pointer mt-2"
                      >
                        <Trash2 className="w-4" />
                        <span>Remove</span>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminMembershipsTable;
