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
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "seats",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <AdminSeats />
          </Suspense>
        ),
      },
      {
        path: "seat/create",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <SeatCreate />
          </Suspense>
        ),
      },
      {
        path: "seat/:id",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <SeatUpdate />
          </Suspense>
        ),
      },
      {
        path: "memberships",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <AdminMemberships />
          </Suspense>
        ),
      },
      {
        path: "membership/create",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <MembershipCreate />
          </Suspense>
        ),
      },
      {
        path: "membership/:id",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <MembershipUpdate />
          </Suspense>
        ),
      },
      {
        path: "members",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Members />
          </Suspense>
        ),
      },
      {
        path: "member/create",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <MemberCreate />
          </Suspense>
        ),
      },
      {
        path: "membershipAssign/:id",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <AssignMembership />
          </Suspense>
        ),
      },
      {
        path: "seatAssign/:id",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <AssignSeat />
          </Suspense>
        ),
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
