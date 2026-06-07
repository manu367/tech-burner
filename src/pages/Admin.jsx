import { useState } from "react";
import { Menu } from "lucide-react";
import { Outlet } from "react-router-dom";
import AdminAsidebar from "../component/AdminAsidebar";

const Admin = () => {

  const [sidebarOpen, setSidebarOpen] = useState(
  window.innerWidth >= 1024
);

  return (
    <div className="h-screen overflow-hidden bg-slate-100 flex">

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <AdminAsidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* TOPBAR */}
        <header
          className="
            h-16 bg-white border-b border-slate-200
            flex items-center justify-between
            px-4 md:px-6
            shrink-0
          "
        >

          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu />
          </button>

          <h1 className="text-xl font-bold text-slate-700">
            Admin Panel
          </h1>

          <div className="w-10 h-10 rounded-full bg-slate-300" />

        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">

          <Outlet />

        </main>

      </div>

    </div>
  );
};

export default Admin;