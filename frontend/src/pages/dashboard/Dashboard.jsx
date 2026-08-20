import React, { useEffect, useMemo } from "react";
import Navbar from "../../components/common/Navbar";
import {
  setEmployees,
  setEmployeeLoading,
  setEmployeeError,
  clearEmployeeError,
} from "../../redux/reducer/employeeSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import instance from "../../utils/axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
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

      const employeeList = response.data.data;

      if (!Array.isArray(employeeList)) {
        throw new Error("Invalid employee data received.");
      }

      dispatch(setEmployees(employeeList));
    } catch (error) {
      console.error(
        "Dashboard employee fetch failed:",
        error?.response?.data || error,
      );

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to load dashboard data.";

      dispatch(setEmployeeError(message));
    } finally {
      dispatch(setEmployeeLoading(false));
    }
  };

  useEffect(() => {
    if (!employees.length) {
      fetchEmployees();
    }
  }, []);

  const statistics = useMemo(() => {
    const totalEmployees = employees.length;

    const departments = new Set(
      employees.map((employee) => employee?.department).filter(Boolean),
    ).size;

    const totalSalary = employees.reduce((total, employee) => {
      return total + Number(employee?.salary || 0);
    }, 0);

    const averageSalary = totalEmployees > 0 ? totalSalary / totalEmployees : 0;

    return {
      totalEmployees,
      departments,
      totalSalary,
      averageSalary,
    };
  }, [employees]);

  const departmentSummary = useMemo(() => {
    const departmentMap = {};

    employees.forEach((employee) => {
      const department = employee?.department || "Unassigned";

      departmentMap[department] = (departmentMap[department] || 0) + 1;
    });

    return Object.entries(departmentMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [employees]);

  const recentEmployees = useMemo(() => {
    return [...employees]
      .sort((a, b) => {
        const dateA = new Date(a?.createdAt || 0).getTime();

        const dateB = new Date(b?.createdAt || 0).getTime();

        return dateB - dateA;
      })
      .slice(0, 5);
  }, [employees]);

  const formatCurrency = (value) => {
    return `₹${Number(value || 0).toLocaleString("en-IN")}`;
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
                Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Overview of your employee management system.
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
            <div className="mb-5 flex items-start justify-between gap-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-red-800">
                  Unable to load dashboard data
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
          {loading && !employees.length ? (
            <div className="flex min-h-[500px] flex-col items-center justify-center">
              <div className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />

              <p className="mt-4 text-sm font-medium text-gray-600">
                Loading dashboard...
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Total Employees
                      </p>
                      <p className="mt-2 text-3xl font-bold text-gray-900">
                        {statistics.totalEmployees}
                      </p>
                    </div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-50">
                      <svg
                        className="h-6 w-6 text-indigo-600"
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
                  </div>
                  <p className="mt-3 text-xs text-gray-500">
                    Employees currently registered
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Departments
                      </p>

                      <p className="mt-2 text-3xl font-bold text-gray-900">
                        {statistics.departments}
                      </p>
                    </div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50">
                      <svg
                        className="h-6 w-6 text-blue-600"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <rect x="3" y="4" width="18" height="16" rx="2" />
                        <path d="M8 8h8" />
                        <path d="M8 12h8" />
                        <path d="M8 16h5" />
                      </svg>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-gray-500">
                    Active departments
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Total Salary
                      </p>

                      <p className="mt-2 text-2xl font-bold text-gray-900">
                        {formatCurrency(statistics.totalSalary)}
                      </p>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50">
                      <span className="text-xl font-bold text-emerald-600">
                        ₹
                      </span>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-gray-500">
                    Combined employee salary
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Average Salary
                      </p>

                      <p className="mt-2 text-2xl font-bold text-gray-900">
                        {formatCurrency(statistics.averageSalary)}
                      </p>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-50">
                      <svg
                        className="h-6 w-6 text-amber-600"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path d="M12 2v20" />
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-gray-500">
                    Average salary per employee
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm lg:col-span-1">
                  <div className="border-b border-gray-200 px-5 py-4">
                    <h2 className="text-base font-semibold text-gray-900">
                      Department Overview
                    </h2>

                    <p className="mt-1 text-xs text-gray-500">
                      Employees by department
                    </p>
                  </div>

                  <div className="p-5">
                    {departmentSummary.length === 0 ? (
                      <div className="py-10 text-center">
                        <p className="text-sm text-gray-500">
                          No department data available.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-5">
                        {departmentSummary.map(([name, count]) => {
                          const percentage =
                            statistics.totalEmployees > 0
                              ? Math.round(
                                  (count / statistics.totalEmployees) * 100,
                                )
                              : 0;

                          return (
                            <div key={name}>
                              <div className="mb-2 flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">
                                  {name}
                                </span>

                                <span className="text-xs font-semibold text-gray-500">
                                  {count}
                                </span>
                              </div>

                              <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                                <div
                                  className="h-full rounded-full bg-indigo-600 transition-all"
                                  style={{
                                    width: `${percentage}%`,
                                  }}
                                />
                              </div>

                              <p className="mt-1 text-right text-[11px] text-gray-400">
                                {percentage}%
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white shadow-sm lg:col-span-2">
                  <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
                    <div>
                      <h2 className="text-base font-semibold text-gray-900">
                        Recent Employees
                      </h2>

                      <p className="mt-1 text-xs text-gray-500">
                        Recently added employee records
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate("/employees")}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                    >
                      View all
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    {recentEmployees.length === 0 ? (
                      <div className="py-16 text-center">
                        <p className="text-sm text-gray-500">
                          No employees available.
                        </p>

                        <button
                          type="button"
                          onClick={() => navigate("/employees/add")}
                          className="mt-3 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                        >
                          Add first employee
                        </button>
                      </div>
                    ) : (
                      <table className="w-full min-w-[700px] text-left">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                              Employee
                            </th>

                            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                              Department
                            </th>

                            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                              Designation
                            </th>

                            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                              Joining Date
                            </th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                          {recentEmployees.map((employee) => (
                            <tr
                              key={employee._id}
                              className="transition hover:bg-gray-50"
                            >
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                                    {getInitial(employee.fullName)}
                                  </div>

                                  <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-gray-900">
                                      {employee.fullName}
                                    </p>

                                    <p className="truncate text-xs text-gray-500">
                                      {employee.email}
                                    </p>
                                  </div>
                                </div>
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
                                <span className="text-sm text-gray-700">
                                  {formatDate(employee.joiningDate)}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="mb-4">
                  <h2 className="text-base font-semibold text-gray-900">
                    Quick Actions
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    Common employee management actions
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => navigate("/employees/add")}
                    className="flex items-center gap-4 rounded-lg border border-gray-200 p-4 text-left transition hover:border-indigo-200 hover:bg-indigo-50"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-xl font-semibold text-indigo-700">
                      +
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Add Employee
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Create a new employee record
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/employees")}
                    className="flex items-center gap-4 rounded-lg border border-gray-200 p-4 text-left transition hover:border-indigo-200 hover:bg-indigo-50"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                      <svg
                        className="h-5 w-5 text-gray-600"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path d="M3 6h18" />
                        <path d="M3 12h18" />
                        <path d="M3 18h18" />
                      </svg>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Employee List
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        View and manage all employees
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
