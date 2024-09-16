// components/admin/AdminLayout.js
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../shared/Navbar";

function AdminLayout() {
  return (
    <div>
      {/* Admin layout components like sidebar, header, etc. */}
      <header>
        <Navbar />
      </header>
      <nav>{/* Navigation links, for example */}</nav>
      <main>
        {/* This is where child routes will be rendered */}
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
