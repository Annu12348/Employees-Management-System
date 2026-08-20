import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../../redux/reducer/authSlice";
import { logoutApi } from "../../api/Auth";
import { clearEmployees } from "../../redux/reducer/employeeSlice";
import { toast } from "react-toastify";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useSelector((state) => state.Auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    logoutApi();
    dispatch(clearUser());
    dispatch(clearEmployees());
    toast.success("Successfully logged out user");
    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? "bg-blue-50 text-blue-600"
        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
    }`;
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="flex h-16 max-w-full md:pl-0 pl-2 items-center justify-between px- sm:px-6 lg:px-8">
        <NavLink to="/dashboard" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
            EM
          </div>
          <div className="hidden sm:block">
            <h1 className="text-base font-bold text-slate-900">
              Employee Management
            </h1>
            <p className="text-xs text-slate-500">Management System</p>
          </div>
        </NavLink>
        <div className="hidden items-center gap-1 md:flex">
          <NavLink to="/dashboard" className={navLinkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/employees" className={navLinkClass}>
            Employees
          </NavLink>
          <NavLink to="/employees/add" className={navLinkClass}>
            Add Employee
          </NavLink>
        </div>
        <div className="hidden items-center gap-4 md:flex">
          <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
              {user?.email?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="hidden lg:block">
              <p className="max-w-[160px] truncate text-sm font-medium text-slate-800">
                {user?.email || "User"}
              </p>
              <p className="text-xs text-slate-500">Administrator</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            Logout
          </button>
        </div>
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? (
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>
      {isMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            <NavLink
              to="/dashboard"
              onClick={() => setIsMenuOpen(false)}
              className={navLinkClass}
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/employees"
              onClick={() => setIsMenuOpen(false)}
              className={navLinkClass}
            >
              Employees
            </NavLink>

            <NavLink
              to="/employees/add"
              onClick={() => setIsMenuOpen(false)}
              className={navLinkClass}
            >
              Add Employee
            </NavLink>
            <div className="my-2 border-t border-slate-200" />
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                {user?.email?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">
                  {user?.email || "User"}
                </p>
                <p className="text-xs text-slate-500">Administrator</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
