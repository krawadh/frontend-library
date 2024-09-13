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
import { Edit2, Loader2, MoreHorizontal, Trash2, Target } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import UpdateMemberDialog from "./UpdateMemberDialog";
import { Button } from "../ui/button";
import { MEMBER_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { toast } from "sonner";
import { setAllAdminMembers } from "../../redux/memberSlice";
import { useNavigate } from "react-router-dom";
//import MembershipAssignDialog from "./MembershipAssignDialog";

const MembersTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { allAdminMembers, searchMemberByText } = useSelector(
    (store) => store.member
  );
  console.log("all admin members ....", allAdminMembers);
  const [filterMembers, setFilterMembers] = useState(allAdminMembers);
  const [open, setOpen] = useState(false);
  //const [openAssignMembership, setOpenAssignMembership] = useState(false);
  const [selectedMember, setSelectedMember] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const filteredMembers = allAdminMembers.filter((member) => {
      if (!searchMemberByText) {
        return true;
      }
      return (
        member?.firstName
          ?.toLowerCase()
          .includes(searchMemberByText.toLowerCase()) ||
        member?.lastName
          .toLowerCase()
          .includes(searchMemberByText.toLowerCase())
      );
    });
    setFilterMembers(filteredMembers);
  }, [allAdminMembers, searchMemberByText]);

  const handleEditClick = (memberId) => {
    setSelectedMember(memberId);
    setOpen(true);
  };
  const handleMembershipClick = (memberId) => {
    navigate(`/admin/membershipAssign/${memberId}`);
  };
  const handleSeatClick = (memberId) => {
    navigate(`/admin/seatAssign/${memberId}`);
  };

  const removeHandler = async (id) => {
    try {
      setLoading(true);
      const res = await axios.delete(`${MEMBER_API_END_POINT}/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
        //withCredentials: true,
      });
      console.log("before deletion----", filterMembers);
      console.log(res.data.success);
      if (res.data.success) {
        const afterDeleted = filterMembers.filter((e) => {
          console.log(e._id, id);
          return e._id !== id;
        });
        console.log("after deletion---", afterDeleted);
        toast.success(res.data.message);
        dispatch(setAllAdminMembers(afterDeleted));
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
        <TableCaption>A list of your recently added seats.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Membership</TableHead>
            <TableHead>Expiry</TableHead>
            {/* <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead> */}
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filterMembers?.map((member) => (
            <TableRow key={member?._id}>
              <TableCell>
                {member?.firstName} {member?.lastName}
              </TableCell>
              <TableCell>{member?.email}</TableCell>
              <TableCell>{member?.phone}</TableCell>
              <TableCell>
                {(() => {
                  if (member?.membership) {
                    const { membershipType, fee, duration } = member.membership;
                    return `${membershipType}-${fee}-${duration}`;
                  }
                  return "";
                })()}
              </TableCell>
              {(() => {
                const expiryDate = member?.membershipExpiry
                  ? new Date(member.membershipExpiry)
                  : null;
                const isExpired = expiryDate && expiryDate < new Date();
                const formattedExpiryDate = expiryDate
                  ? expiryDate.toDateString()
                  : "";

                return (
                  <TableCell>
                    {formattedExpiryDate}
                    {isExpired && <span className="bg-red-600">(Due)</span>}
                  </TableCell>
                );
              })()}
              {/* {new Date(member?.membershipExpiry) < new Date() ? (
                <TableCell>
                  {new Date(member?.membershipExpiry).toDateString()}
                  <span className="bg-red-600">(Due)</span>
                </TableCell>
              ) : (
                <TableCell>
                  {new Date(member?.membershipExpiry).toDateString()}
                </TableCell>
              )} */}

              <TableCell className="text-right cursor-pointer">
                <Popover>
                  <PopoverTrigger>
                    <MoreHorizontal />
                  </PopoverTrigger>
                  <PopoverContent className="w-60">
                    <div
                      onClick={() => handleEditClick(member._id)}
                      className="flex items-center gap-2 w-fit cursor-pointer"
                    >
                      <Edit2 className="w-4" />
                      <span>Edit</span>
                    </div>
                    <div
                      onClick={() => handleMembershipClick(member._id)}
                      className="flex items-center gap-2 w-fit cursor-pointer mt-2"
                    >
                      <Target className="w-4" />
                      <span>Assign Membership</span>
                    </div>
                    <div
                      onClick={() => handleSeatClick(member._id)}
                      className="flex items-center gap-2 w-fit cursor-pointer mt-2"
                    >
                      <Target className="w-4" />
                      <span>Assign Seat</span>
                    </div>
                    {/* Additional options can go here */}
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
      <UpdateMemberDialog
        open={open}
        setOpen={setOpen}
        selectedMember={selectedMember}
      />
      {/* <MembershipAssignDialog
        open={openAssignMembership}
        setOpen={setOpenAssignMembership}
        selectedMember={selectedMember}
      /> */}
    </div>
  );
};

export default MembersTable;
