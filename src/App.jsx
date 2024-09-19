import React, { Suspense, lazy } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import PageNotFound from "./components/shared/PageNotFound";
import AdminLayout from "./components/admin/AdminLayout";

// Lazy load components
const Login = lazy(() => import("./components/auth/Login"));
const Signup = lazy(() => import("./components/auth/Signup"));
const Profile = lazy(() => import("./components/Profile"));
const AdminSeats = lazy(() => import("./components/admin/AdminSeats"));
const SeatCreate = lazy(() => import("./components/admin/SeatCreate"));
const SeatUpdate = lazy(() => import("./components/admin/SeatUpdate"));
const AdminMemberships = lazy(() =>
  import("./components/admin/AdminMemberships")
);
const MembershipCreate = lazy(() =>
  import("./components/admin/MembershipCreate")
);
const MembershipUpdate = lazy(() =>
  import("./components/admin/MembershipUpdate")
);
const Members = lazy(() => import("./components/admin/Members"));
const MemberCreate = lazy(() => import("./components/admin/MemberCreate"));
const AssignMembership = lazy(() =>
  import("./components/admin/AssignMembership")
);
const AssignSeat = lazy(() => import("./components/admin/AssignSeat"));

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/admin/members" replace />,
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: "/signup",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Signup />
      </Suspense>
    ),
  },
  {
    path: "/profile",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Profile />
      </Suspense>
    ),
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <Suspense fallback={<div>Loading...</div>}>
          <AdminLayout />
        </Suspense>
      </ProtectedRoute>
    ),
    children: [
      {
        path: "seats",
        element: <AdminSeats />,
      },
      {
        path: "seat/create",
        element: <SeatCreate />,
      },
      {
        path: "seat/:id",
        element: <SeatUpdate />,
      },
      {
        path: "memberships",
        element: <AdminMemberships />,
      },
      {
        path: "membership/create",
        element: <MembershipCreate />,
      },
      {
        path: "membership/:id",
        element: <MembershipUpdate />,
      },
      {
        path: "members",
        element: <Members />,
      },
      {
        path: "member/create",
        element: <MemberCreate />,
      },
      {
        path: "membershipAssign/:id",
        element: <AssignMembership />,
      },
      {
        path: "seatAssign/:id",
        element: <AssignSeat />,
      },
    ],
  },
  {
    path: "*",
    element: <PageNotFound />,
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
