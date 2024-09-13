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
import { Edit2, Eye, MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AdminSeatsTable = () => {
  const { allAdminSeats, searchSeatByText } = useSelector(
    (store) => store.seat
  );
  console.log("all admin seat ....", allAdminSeats);
  const [filterSeats, setFilterSeats] = useState(allAdminSeats);
  const navigate = useNavigate();

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
  return (
    <div>
      <Table>
        <TableCaption>A list of your recent added seats.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="">Seat Number</TableHead>
            <TableHead>Seat Type</TableHead>
            <TableHead>Available</TableHead>
            <TableHead>Reserved By</TableHead>
            {/* <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead> */}
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filterSeats?.map((seat) => (
            <TableRow key={seat?._id}>
              <TableCell>{seat?.seatNumber}</TableCell>
              <TableCell>{seat?.seatType}</TableCell>
              <TableCell>{seat?.isAvailable ? "Yes" : "No"}</TableCell>
              <TableCell>{seat?.reservedBy?.firstName}</TableCell>
              {/* <TableCell>{seat?.reservationStartTime?.split("T")[0]}</TableCell>
              <TableCell>{seat?.reservationEndTime?.split("T")[0]}</TableCell> */}
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
                    {/* <div
                      onClick={() =>
                        navigate(`/admin/jobs/${job._id}/applicants`)
                      }
                      className="flex items-center w-fit gap-2 cursor-pointer mt-2"
                    >
                      <Eye className="w-4" />
                      <span>Applicants</span>
                    </div> */}
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
