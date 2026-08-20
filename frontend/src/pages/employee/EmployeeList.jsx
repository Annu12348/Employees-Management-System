import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  clearEmployeeError,
  setEmployeeError,
  setEmployeeLoading,
  setEmployees,
} from "../../redux/reducer/employeeSlice";
import instance from "../../utils/axios";
import Navbar from "../../components/common/Navbar";

const EmployeeList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [deleteEmployee, setDeleteEmployee] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { employees, loading, error } = useSelector((state) => state.Employee);

  const fetchEmployees = async () => {
    try {
      dispatch(setEmployeeLoading(true));
      dispatch(clearEmployeeError());

      const response = await instance.get("/employee", {
        withCredentials: true,
      });

      if (!response?.data.success) {
        throw new Error(response?.message || "Failed to fetch employees.");
      }

      const employeeList = response?.data.data;

      if (!Array.isArray(employeeList)) {
        throw new Error("Invalid employee data received from server.");
      }

      dispatch(setEmployees(employeeList));
    } catch (error) {
      console.error("Fetch employees failed:", error?.response?.data || error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to load employees.";

      dispatch(setEmployeeError(message));
    } finally {
      dispatch(setEmployeeLoading(false));
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const departments = useMemo(() => {
    return [
      ...new Set(
        employees.map((employee) => employee?.department).filter(Boolean),
      ),
    ].sort((a, b) => a.localeCompare(b));
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    const filtered = employees.filter((employee) => {
      const fullName = employee?.fullName?.toLowerCase() || "";

      const matchesSearch = !searchValue || fullName.includes(searchValue);

      const matchesDepartment =
        !department || employee?.department === department;

      return matchesSearch && matchesDepartment;
    });

    return [...filtered].sort((a, b) => {
      const nameA = a?.fullName?.toLowerCase() || "";

      const nameB = b?.fullName?.toLowerCase() || "";

      return sortOrder === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });
  }, [employees, search, department, sortOrder]);

  const clearFilters = () => {
    setSearch("");
    setDepartment("");
    setSortOrder("asc");
  };

  const handleEdit = (employee) => {
    navigate(`/employees/edit/${employee._id}`);
  };

  const handleDelete = async () => {
    if (!deleteEmployee?._id) {
      return;
    }

    try {
      setDeleteLoading(true);

      dispatch(clearEmployeeError());

      await instance.delete(`/employee/${deleteEmployee._id}`, {
        withCredentials: true,
      });

      dispatch(removeEmployee(deleteEmployee._id));

      setDeleteEmployee(null);
    } catch (error) {
      console.error("Delete employee failed:", error?.response?.data || error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to delete employee.";

      dispatch(setEmployeeError(message));
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatSalary = (salary) => {
    if (salary === null || salary === undefined || salary === "") {
      return "—";
    }

    return `₹${Number(salary).toLocaleString("en-IN")}`;
  };

  const getInitial = (name) => {
    return name?.trim()?.charAt(0)?.toUpperCase() || "E";
  };

  return (
    <div className="min-h-screen w-full">
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                Employees
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Manage and maintain employee records.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/employees/add")}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <span className="text-lg leading-none">+</span>
              Add Employee
            </button>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 flex items-start justify-between gap-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3"
            >
              <div>
                <p className="text-sm font-semibold text-red-800">
                  Unable to complete request
                </p>

                <p className="mt-1 text-sm text-red-600">{error}</p>
              </div>

              <button
                type="button"
                onClick={fetchEmployees}
                className="rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-red-700 shadow-sm ring-1 ring-inset ring-red-200 hover:bg-red-50"
              >
                Retry
              </button>
            </div>
          )}

          <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Total Employees
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {employees.length}
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-gray-500">Departments</p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {departments.length}
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Current Results
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {filteredEmployees.length}
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 p-4 md:p-5">
              <div className="flex flex-col gap-3 lg:flex-row">
                {/* SEARCH */}

                <div className="relative flex-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="11" cy="11" r="7" />

                      <path d="m20 20-3.5-3.5" />
                    </svg>
                  </div>

                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search employee by name..."
                    className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 lg:w-52"
                >
                  <option value="">All Departments</option>

                  {departments.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>

                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 lg:w-48"
                >
                  <option value="asc">Name: A → Z</option>

                  <option value="desc">Name: Z → A</option>
                </select>

                {(search || department) && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {loading ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center">
                <div className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />

                <p className="mt-4 text-sm font-medium text-gray-600">
                  Loading employees...
                </p>
              </div>
            ) : filteredEmployees.length === 0 ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center px-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                  <svg
                    className="h-7 w-7 text-gray-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />

                    <circle cx="9" cy="7" r="4" />

                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />

                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>

                <h3 className="mt-4 text-base font-semibold text-gray-900">
                  {employees.length === 0
                    ? "No employees found"
                    : "No matching employees"}
                </h3>

                <p className="mt-1 max-w-md text-sm text-gray-500">
                  {employees.length === 0
                    ? "There are no employee records yet. Add your first employee to get started."
                    : "No employees match your current search or department filter."}
                </p>

                {employees.length === 0 && (
                  <button
                    type="button"
                    onClick={() => navigate("/employees/add")}
                    className="mt-5 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                  >
                    Add Employee
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1100px] text-left">
                  <thead className="border-b border-gray-200 bg-gray-50">
                    <tr>
                      <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Employee
                      </th>

                      <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Employee ID
                      </th>

                      <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Mobile
                      </th>

                      <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Department
                      </th>

                      <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Designation
                      </th>

                      <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Salary
                      </th>

                      <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Joining Date
                      </th>

                      <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredEmployees.map((employee) => (
                      <tr
                        key={employee._id}
                        className="transition hover:bg-gray-50"
                      >
                        {/* EMPLOYEE */}

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                              {getInitial(employee.fullName)}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-gray-900">
                                {employee.fullName}
                              </p>

                              <p className="max-w-[220px] truncate text-xs text-gray-500">
                                {employee.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* EMPLOYEE ID */}

                        <td className="px-5 py-4">
                          <span className="rounded-md bg-gray-100 px-2.5 py-1 font-mono text-xs font-medium text-gray-700">
                            {employee.employeeId}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span className="text-sm text-gray-700">
                            {employee.mobileNumber}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span className="inline-flex rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                            {employee.department || "—"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span className="text-sm text-gray-700">
                            {employee.designation || "—"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span className="text-sm font-semibold text-gray-900">
                            {formatSalary(employee.salary)}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span className="text-sm text-gray-700">
                            {formatDate(employee.joiningDate)}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleEdit(employee)}
                              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => setDeleteEmployee(employee)}
                              className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {!loading && filteredEmployees.length > 0 && (
              <div className="border-t border-gray-200 bg-gray-50 px-5 py-3.5">
                <p className="text-xs text-gray-500">
                  Showing{" "}
                  <span className="font-semibold text-gray-700">
                    {filteredEmployees.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-700">
                    {employees.length}
                  </span>{" "}
                  employees
                </p>
              </div>
            )}
          </div>
        </div>
        {deleteEmployee && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div
              role="dialog"
              aria-modal="true"
              className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100">
                <svg
                  className="h-5 w-5 text-red-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 6h18" />
                  <path d="M8 6V4h8v2" />
                  <path d="M19 6l-1 14H6L5 6" />
                  <path d="M10 11v5" />
                  <path d="M14 11v5" />
                </svg>
              </div>

              <h2 className="mt-4 text-lg font-semibold text-gray-900">
                Delete employee?
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-gray-700">
                  {deleteEmployee.fullName}
                </span>
                ?
                <br />
                This action cannot be undone.
              </p>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  disabled={deleteLoading}
                  onClick={() => setDeleteEmployee(null)}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={deleteLoading}
                  onClick={handleDelete}
                  className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {deleteLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Deleting...
                    </span>
                  ) : (
                    "Delete Employee"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeList;
