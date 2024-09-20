// components/admin/AdminLayout.js
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../shared/Navbar";

function AdminLayout() {
  return (
    <div className="flex flex-col h-screen">
      <header className="bg-white sticky top-0 z-10">
        <Navbar />
      </header>
      {/* <nav className="bg-gray-200 p-4">*/}
      {/* Navigation links, for example */}
      {/* </nav>  */}
      <main className="flex-1 overflow-y-auto p-4 bg-gray-100">
        {/* This is where child routes will be rendered */}
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
