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
import { Button } from "@/components/ui/button";
import { MEMBER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { setAllAdminMembers, setLoading } from "../../redux/memberSlice";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage } from "../ui/avatar";
import { useAxiosInterceptor } from "@/hooks/useAxiosInterceptor";
//import MembershipAssignDialog from "./MembershipAssignDialog";

const MembersTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const api = useAxiosInterceptor(); // Use the custom Axios instance with interceptors
  const { allAdminMembers, searchMemberByText, loading } = useSelector(
    (store) => store.member
  );
  const [filterMembers, setFilterMembers] = useState(allAdminMembers);
  const [open, setOpen] = useState(false);
  //const [openAssignMembership, setOpenAssignMembership] = useState(false);
  const [selectedMember, setSelectedMember] = useState("");

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
      const res = await api.delete(`${MEMBER_API_END_POINT}/${id}`);
      if (res.data.success) {
        const afterDeleted = filterMembers.filter((e) => {
          return e._id !== id;
        });

        toast.success(res.data.message);
        dispatch(setAllAdminMembers(afterDeleted));
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      dispatch(setLoading(false));
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
            <TableHead>Seat No</TableHead>
            {/* <TableHead>Timing</TableHead> */}
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
                <div className="flex items-center space-x-3">
                  <Avatar className="cursor-pointer w-8 h-8 sm:w-10 sm:h-10 md:w-9 md:h-9 lg:w-10 lg:h-10">
                    <AvatarImage
                      src={
                        member?.profile?.profilePhoto ||
                        "https://github.com/shadcn.png"
                      }
                      className="rounded-full object-cover"
                      alt={`${member?.firstName}'s profile`}
                    />
                  </Avatar>
                  <div>
                    {member?.firstName} {member?.lastName}
                  </div>
                </div>
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
              <TableCell>
                {(() => {
                  if (member?.reservations?.[0]) {
                    const startTime = new Date(
                      member?.reservations?.[0]?.reservationStartTime
                    );
                    const endTime = new Date(
                      member?.reservations?.[0]?.reservationEndTime
                    );
                    const date = new Date();
                    const isTimeover =
                      date.getHours() > endTime.getHours() ? true : false;

                    return (
                      <div className={isTimeover ? "bg-red-500" : ""}>
                        {member?.reservations?.[0]?.seat?.seatNumber} (
                        {startTime.getHours()}Hrs - {endTime.getHours()}Hrs)
                      </div>
                    );
                  }
                  return "---";
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

      {selectedMember && (
        <UpdateMemberDialog
          open={open}
          setOpen={setOpen}
          selectedMember={selectedMember}
        />
      )}
    </div>
  );
};

export default MembersTable;
