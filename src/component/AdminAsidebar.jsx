import {
  Home,
  Folder,
  BookOpen,
  Dumbbell,
  Code,
  Briefcase,
  LogOut,
  X,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function AdminAsidebar({
  sidebarOpen,
  setSidebarOpen,
}) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const menuItems = [
    {
      title: "Dashboard",
      icon: <Home size={20} />,
      path: "/admin",
    },
    {
      title: "Category",
      icon: <Folder size={20} />,
      path: "/admin/category",
    },
    {
      title: "Courses",
      icon: <BookOpen size={20} />,
      path: "/admin/courses",
    },
    {
      title: "Coding Questions",
      icon: <Code size={20} />,
      path: "/admin/coding",
    },
    {
      title: "GYM Section",
      icon: <Dumbbell size={20} />,
      path: "/admin/gym",
    },
    {
      title: "Projects",
      icon: <Briefcase size={20} />,
      path: "/admin/projects",
    },
  ];

  return (
    <motion.aside

      initial={false}

      animate={{
        x: sidebarOpen ? 0 : -300,
      }}

      transition={{
        duration: 0.3,
      }}

      className="
        fixed lg:relative top-0 left-0 z-50
        h-screen w-72 bg-white
        border-r border-slate-200
        flex flex-col shadow-lg

        lg:translate-x-0
      "
    >

      {/* HEADER */}
      <div className="flex items-center justify-between p-5 border-b border-slate-200">

        <h1 className="text-2xl font-bold text-slate-800">
          Admin
        </h1>

        <button
          className="lg:hidden"
          onClick={() => {
  if (window.innerWidth < 1024) {
    setSidebarOpen(false);
  }
}}
        >
          <X />
        </button>

      </div>

      {/* MENU */}
      <div className="flex-1 overflow-y-auto p-4">

        <nav className="space-y-2">

          {menuItems.map((item, index) => (

            <NavLink
              key={index}
              to={item.path}
              onClick={() => {
  if (window.innerWidth < 1024) {
    setSidebarOpen(false);
  }
}}
              className={({ isActive }) =>
                `
                flex items-center gap-3
                px-4 py-3 rounded-xl
                transition-all duration-200

                ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }
                `
              }
            >

              {item.icon}

              <span className="font-medium">
                {item.title}
              </span>

            </NavLink>

          ))}

        </nav>

      </div>

      {/* FOOTER */}
      <div className="p-4 border-t border-slate-200">

        <button
          onClick={handleLogout}
          className="
            w-full flex items-center gap-3
            px-4 py-3 rounded-xl
            bg-red-50 text-red-600
            hover:bg-red-100 transition
          "
        >

          <LogOut size={20} />

          Logout

        </button>

      </div>

    </motion.aside>
  );
}
