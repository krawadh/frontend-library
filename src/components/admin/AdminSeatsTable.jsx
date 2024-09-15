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
import { Edit2, Loader2, MoreHorizontal, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "react-day-picker";
import axios from "axios";
import { SEAT_API_END_POINT } from "@/utils/constant";
import { setAllAdminSeats } from "@/redux/seatSlice";
import { toast } from "sonner";

const AdminSeatsTable = () => {
  const { allAdminSeats, searchSeatByText } = useSelector(
    (store) => store.seat
  );
  const [loading, setLoading] = useState(false);
  const [filterSeats, setFilterSeats] = useState(allAdminSeats);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const filteredSeats = allAdminSeats.filter((seat) => {
      if (!searchSeatByText) {
        return true;
      }
      return (
        seat?.seatNumber
          ?.toLowerCase()
          .includes(searchSeatByText.toLowerCase()) ||
        seat?.reservedBy?.firstName
          .toLowerCase()
          .includes(searchSeatByText.toLowerCase())
      );
    });
    setFilterSeats(filteredSeats);
  }, [allAdminSeats, searchSeatByText]);

  const removeHandler = async (id) => {
    try {
      const res = await axios.delete(`${SEAT_API_END_POINT}/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.data.success) {
        const afterDeleted = filterSeats.filter((e) => e._id !== id);
        toast.success(res.data.message);
        dispatch(setAllAdminSeats(afterDeleted));
        navigate("/admin/seats");
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
        <TableCaption>A list of your recently added seats.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="">Seat Number</TableHead>
            <TableHead>Seat Type</TableHead>
            <TableHead>Available</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filterSeats?.map((seat) => (
            <TableRow key={seat?._id}>
              <TableCell>{seat?.seatNumber}</TableCell>
              <TableCell>{seat?.seatType}</TableCell>
              <TableCell>{seat?.isAvailable ? "Yes" : "No"}</TableCell>
              <TableCell className="text-right cursor-pointer">
                <Popover>
                  <PopoverTrigger>
                    <MoreHorizontal />
                  </PopoverTrigger>
                  <PopoverContent className="w-32">
                    <div
                      onClick={() => navigate(`/admin/seat/${seat._id}`)}
                      className="flex items-center gap-2 w-fit cursor-pointer"
                    >
                      <Edit2 className="w-4" />
                      <span>Edit</span>
                    </div>
                    {loading ? (
                      <Button className="w-full my-4">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                        wait
                      </Button>
                    ) : (
                      <div
                        onClick={() => removeHandler(seat._id)}
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

export default AdminSeatsTable;
