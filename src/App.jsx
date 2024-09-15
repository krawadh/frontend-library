import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Profile from "./components/Profile";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import AdminSeats from "./components/admin/AdminSeats";
import SeatCreate from "./components/admin/SeatCreate";
import AdminMemberships from "./components/admin/AdminMemberships";
import MembershipCreate from "./components/admin/MembershipCreate";
import MembershipUpdate from "./components/admin/MembershipUpdate";
import SeatUpdate from "./components/admin/SeatUpdate";
import Members from "./components/admin/Members";
import MemberCreate from "./components/admin/MemberCreate";
import AssignMembership from "./components/admin/AssignMembership";
import AssignSeat from "./components/admin/AssignSeat";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/admin/members" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },

  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/admin/seats",
    element: (
      <ProtectedRoute>
        <AdminSeats />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/seat/create",
    element: (
      <ProtectedRoute>
        <SeatCreate />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/seat/:id",
    element: (
      <ProtectedRoute>
        <SeatUpdate />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/memberships",
    element: (
      <ProtectedRoute>
        <AdminMemberships />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/membership/create",
    element: (
      <ProtectedRoute>
        <MembershipCreate />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/membership/:id",
    element: (
      <ProtectedRoute>
        <MembershipUpdate />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/members",
    element: (
      <ProtectedRoute>
        <Members />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/member/create",
    element: (
      <ProtectedRoute>
        <MemberCreate />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/membershipAssign/:id",
    element: (
      <ProtectedRoute>
        <AssignMembership />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/seatAssign/:id",
    element: (
      <ProtectedRoute>
        <AssignSeat />
      </ProtectedRoute>
    ),
  },
]);
function App() {
  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  );
}

export default App;
