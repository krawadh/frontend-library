import { useDispatch, useSelector } from "react-redux";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Loader2, LogOut, User2 } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

import { logoutHandler } from "@/utils/auth";
import { useAxiosInterceptor } from "@/hooks/useAxiosInterceptor";

const Navbar = () => {
  const api = useAxiosInterceptor();
  const { loading, user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutHandler(user.id, dispatch, navigate, api);
  };

  // const logoutHandler = async () => {
  //   try {
  //     dispatch(setLoading(true));
  //     const res = await axios.post(
  //       `${USER_API_END_POINT}/logout`,
  //       { userId: user.id },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         //withCredentials: true,
  //       }
  //     );

  //     if (res.data.success) {
  //       //dispatch(setUser(null));
  //       dispatch(resetAuth()); // Reset auth slice
  //       dispatch(resetMember()); // Reset auth member
  //       dispatch(resetMembership()); // Reset auth membership
  //       dispatch(resetSeat()); // Reset auth seat
  //       persistor.purge().then(() => {
  //         console.log("Persisted state cleared on logout!");
  //       });
  //       navigate("/login", { replace: true });
  //       toast.success(res.data.message);
  //       dispatch(setLoading(false));
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     toast.error(error.response.data.message);
  //   }
  // };

  return (
    <div className="bg-gray-300 shadow-md">
      <div className="flex items-center justify-between mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl h-24">
        <div className="flex items-center">
          {/* Logo */}
          <NavLink to="/">
            <img
              src="/logo.png" // Update this path to the location of your logo
              alt="Prime academy and Library"
              className="h-16" // Adjust size as needed
            />
          </NavLink>
        </div>
        <div className="flex items-center gap-4 sm:gap-12">
          <ul className="flex font-medium items-center gap-3 sm:gap-5">
            {user && user.role === "Admin" ? (
              <>
                <li>
                  <NavLink
                    to="/admin/members"
                    className={({ isActive }) =>
                      isActive ? "text-blue-500" : "text-black"
                    }
                  >
                    Members
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/admin/memberships"
                    className={({ isActive }) =>
                      isActive ? "text-blue-500" : "text-black"
                    }
                  >
                    Memberships
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/admin/seats"
                    className={({ isActive }) =>
                      isActive ? "text-blue-500" : "text-black"
                    }
                  >
                    Seats
                  </NavLink>
                </li>
              </>
            ) : (
              <>{/* User routes */}</>
            )}
          </ul>
          {!user ? (
            <div className="flex items-center gap-2">
              <NavLink to="/signup">
                <Button className="bg-[#6A38C2] hover:bg-[#5b30a6] text-sm sm:text-base">
                  Signup
                </Button>
              </NavLink>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer w-8 h-8 sm:w-10 sm:h-10">
                  <AvatarImage
                    src={
                      user?.profile?.profilePhoto ||
                      "https://github.com/shadcn.png"
                    }
                    alt={user?.firstName || "User"}
                  />
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-64 sm:w-80 bg-white shadow-lg">
                <div className="p-4">
                  <div className="flex gap-2 items-center mb-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage
                        src={
                          user?.profile?.profilePhoto ||
                          "https://github.com/shadcn.png"
                        }
                        alt={user?.firstName || "User"}
                      />
                    </Avatar>
                    <div>
                      <h4 className="font-medium text-lg text-gray-800">
                        {user?.firstName || "User"}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {user?.email || "-----"}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col text-gray-600">
                    {user && user.role === "Admin" && (
                      <div className="flex items-center gap-2 mb-2">
                        <User2 />
                        <NavLink to="/profile">
                          <Button
                            variant="link"
                            className="text-sm text-blue-500"
                          >
                            View Profile
                          </Button>
                        </NavLink>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <LogOut />{" "}
                      {loading ? (
                        <Button
                          variant="link"
                          className="text-sm text-blue-500"
                        >
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                          Please wait
                        </Button>
                      ) : (
                        <Button
                          onClick={handleLogout}
                          variant="link"
                          className="text-sm text-blue-500"
                        >
                          Logout
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
