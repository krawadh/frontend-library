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
import { Edit2, MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MEMBERSHIP_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setAllAdminMemberships } from "@/redux/membershipSlice";
import { useAxiosInterceptor } from "@/hooks/useAxiosInterceptor";

const AdminMembershipsTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const api = useAxiosInterceptor(); // Use the custom Axios instance with interceptors
  const [loading, setLoading] = useState(false);
  const { allAdminMemberships, searchMembershipByText } = useSelector(
    (store) => store.membership
  );

  const [filterMemberships, setFilterMemberships] =
    useState(allAdminMemberships);

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
      const res = await api.delete(`${MEMBERSHIP_API_END_POINT}/${id}`);
      if (res.data.success) {
        const afterDeleted = filterMemberships.filter((e) => e._id !== id);
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
    <div className="overflow-x-auto">
      <Table className="min-w-full">
        <TableCaption>A list of your recently added memberships.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="whitespace-nowrap">Membership Type</TableHead>
            <TableHead className="whitespace-nowrap">Fee</TableHead>
            <TableHead className="whitespace-nowrap">Duration</TableHead>
            <TableHead className="whitespace-nowrap">Available</TableHead>
            <TableHead className="whitespace-nowrap">Description</TableHead>
            <TableHead className="text-right whitespace-nowrap">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filterMemberships?.map((member) => (
            <TableRow key={member._id} className="text-sm">
              <TableCell className="whitespace-nowrap">
                {member?.membershipType}
              </TableCell>
              <TableCell className="whitespace-nowrap">{member?.fee}</TableCell>
              <TableCell className="whitespace-nowrap">
                {member?.duration}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {member?.isActive ? "Yes" : "No"}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {member?.description}
              </TableCell>

              <TableCell className="text-right">
                <Popover>
                  <PopoverTrigger>
                    <MoreHorizontal className="cursor-pointer" />
                  </PopoverTrigger>
                  <PopoverContent className="w-32">
                    <div
                      onClick={() =>
                        navigate(`/admin/membership/${member._id}`)
                      }
                      className="flex items-center gap-2 w-full cursor-pointer"
                    >
                      <Edit2 className="w-4" />
                      <span>Edit</span>
                    </div>
                    {/* {loading ? (
                      <Button className="w-full my-4">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                        wait
                      </Button>
                    ) : (
                      <div
                        onClick={() => removeHandler(member._id)}
                        className="flex items-center w-full gap-2 cursor-pointer mt-2"
                      >
                        <Trash2 className="w-4" />
                        <span>Remove</span>
                      </div>
                    )} */}
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
