import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  clearEmployeeError,
  setEmployeeError,
  setEmployeeLoading,
  updateEmployee,
} from "../../redux/reducer/employeeSlice";
import instance from "../../utils/axios";

const EmployeeEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    employeeId: "",
    fullName: "",
    email: "",
    mobileNumber: "",
    department: "",
    designation: "",
    salary: "",
    joiningDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      submit: "",
    }));

    dispatch(clearEmployeeError());
  };

  const validateForm = () => {
    const newErrors = {};

    const fullName = formData.fullName.trim();

    if (!fullName) {
      newErrors.fullName = "Full name is required";
    } else if (fullName.length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    }

    const email = formData.email.trim();

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    const mobileNumber = formData.mobileNumber.trim();

    if (!mobileNumber) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (!/^[0-9]{10}$/.test(mobileNumber)) {
      newErrors.mobileNumber = "Mobile number must contain 10 digits";
    }

    if (!formData.department) {
      newErrors.department = "Department is required";
    }

    if (!formData.designation.trim()) {
      newErrors.designation = "Designation is required";
    }

    if (!formData.salary) {
      newErrors.salary = "Salary is required";
    } else if (Number(formData.salary) <= 0) {
      newErrors.salary = "Salary must be greater than 0";
    }

    if (!formData.joiningDate) {
      newErrors.joiningDate = "Joining date is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    dispatch(setEmployeeLoading(true));
    dispatch(clearEmployeeError());

    try {
      const payload = {
        employeeId: formData.employeeId.trim(),
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        mobileNumber: formData.mobileNumber.trim(),
        department: formData.department,
        designation: formData.designation.trim(),
        salary: Number(formData.salary),
        joiningDate: formData.joiningDate,
      };

      const response = await instance.put(`/employee/${id}`, payload, {
        withCredentials: true,
      });

      const updatedEmployee = response?.data?.data;

      if (!updatedEmployee) {
        throw new Error("Invalid response received from server.");
      }

      console.log("Employee updated successfully:", updatedEmployee);

      dispatch(updateEmployee(updatedEmployee));

      dispatch(setEmployeeLoading(false));

      navigate("/employees");
    } catch (error) {
      console.error(
        "Update employee failed:",
        error?.response?.data || error.message,
      );

      const status = error?.response?.status;

      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Unable to update employee.";

      const normalizedMessage = backendMessage.toLowerCase();

      if (
        status === 409 &&
        normalizedMessage.includes("employee") &&
        normalizedMessage.includes("id")
      ) {
        setErrors((prev) => ({
          ...prev,
          employeeId: "This Employee ID already exists.",
          email: "",
          submit: "",
        }));
      } else if (status === 409 && normalizedMessage.includes("email")) {
        setErrors((prev) => ({
          ...prev,
          email: "This email already exists.",
          employeeId: "",
          submit: "",
        }));
      } else if (status === 409) {
        setErrors((prev) => ({
          ...prev,
          submit: backendMessage,
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          submit: backendMessage,
        }));
      }

      dispatch(setEmployeeError(backendMessage));
    } finally {
      setLoading(false);
      dispatch(setEmployeeLoading(false));
    }
  };

  useEffect(() => {
    const employee = window.history.state?.usr?.employee;

    if (employee) {
      setFormData({
        employeeId: employee.employeeId || "",
        fullName: employee.fullName || "",
        email: employee.email || "",
        mobileNumber: employee.mobileNumber || "",
        department: employee.department || "",
        designation: employee.designation || "",
        salary: employee.salary || "",
        joiningDate: employee.joiningDate
          ? employee.joiningDate.substring(0, 10)
          : "",
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Edit Employee
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Update employee information.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/employees")}
              disabled={loading}
              className="w-fit rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              ← Back to Employees
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-5 py-5 md:px-7">
            <h2 className="text-lg font-semibold text-gray-900">
              Employee Information
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Update the employee details carefully.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="p-5 md:p-7">
              <div className="mb-8">
                <h3 className="mb-5 text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Basic Information
                </h3>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="employeeId"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Employee ID
                      <span className="ml-1 text-red-500">*</span>
                    </label>

                    <input
                      id="employeeId"
                      type="text"
                      name="employeeId"
                      value={formData.employeeId}
                      onChange={handleChange}
                      placeholder="Enter employee ID"
                      autoComplete="off"
                      maxLength={30}
                      readOnly
                      className={`w-full rounded-lg border bg-gray-100 px-4 py-3 text-sm text-gray-500 outline-none transition placeholder:text-gray-400 ${
                        errors.employeeId ? "border-red-400" : "border-gray-300"
                      }`}
                    />

                    {errors.employeeId && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.employeeId}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="fullName"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Full Name
                      <span className="ml-1 text-red-500">*</span>
                    </label>

                    <input
                      id="fullName"
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      autoComplete="name"
                      className={`w-full rounded-lg border px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 ${
                        errors.fullName
                          ? "border-red-400 focus:ring-2 focus:ring-red-100"
                          : "border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      }`}
                    />

                    {errors.fullName && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Email
                      <span className="ml-1 text-red-500">*</span>
                    </label>

                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="employee@example.com"
                      autoComplete="email"
                      className={`w-full rounded-lg border px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 ${
                        errors.email
                          ? "border-red-400 focus:ring-2 focus:ring-red-100"
                          : "border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      }`}
                    />

                    {errors.email && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="mobileNumber"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Mobile Number
                      <span className="ml-1 text-red-500">*</span>
                    </label>

                    <input
                      id="mobileNumber"
                      type="tel"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleChange}
                      placeholder="10 digit mobile number"
                      maxLength={10}
                      inputMode="numeric"
                      autoComplete="tel"
                      className={`w-full rounded-lg border px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 ${
                        errors.mobileNumber
                          ? "border-red-400 focus:ring-2 focus:ring-red-100"
                          : "border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      }`}
                    />

                    {errors.mobileNumber && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.mobileNumber}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-5 text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Professional Information
                </h3>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="department"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Department
                      <span className="ml-1 text-red-500">*</span>
                    </label>

                    <select
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className={`w-full rounded-lg border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition ${
                        errors.department ? "border-red-400" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select department</option>

                      <option value="Engineering">Engineering</option>

                      <option value="IT">IT</option>

                      <option value="HR">Human Resources</option>

                      <option value="Finance">Finance</option>

                      <option value="Marketing">Marketing</option>

                      <option value="Sales">Sales</option>

                      <option value="Operations">Operations</option>
                    </select>

                    {errors.department && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.department}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="designation"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Designation
                      <span className="ml-1 text-red-500">*</span>
                    </label>

                    <input
                      id="designation"
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      placeholder="e.g. Software Engineer"
                      className={`w-full rounded-lg border px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 ${
                        errors.designation
                          ? "border-red-400"
                          : "border-gray-300"
                      }`}
                    />

                    {errors.designation && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.designation}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="salary"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Salary
                      <span className="ml-1 text-red-500">*</span>
                    </label>

                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                        ₹
                      </span>

                      <input
                        id="salary"
                        type="number"
                        name="salary"
                        value={formData.salary}
                        onChange={handleChange}
                        min="1"
                        placeholder="Enter salary"
                        className={`w-full rounded-lg border py-3 pl-9 pr-4 text-sm text-gray-900 outline-none ${
                          errors.salary ? "border-red-400" : "border-gray-300"
                        }`}
                      />
                    </div>

                    {errors.salary && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.salary}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="joiningDate"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Joining Date
                      <span className="ml-1 text-red-500">*</span>
                    </label>

                    <input
                      id="joiningDate"
                      type="date"
                      name="joiningDate"
                      value={formData.joiningDate}
                      onChange={handleChange}
                      className={`w-full rounded-lg border px-4 py-3 text-sm text-gray-900 outline-none ${
                        errors.joiningDate
                          ? "border-red-400"
                          : "border-gray-300"
                      }`}
                    />

                    {errors.joiningDate && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.joiningDate}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {errors.submit && (
                <div
                  role="alert"
                  className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                >
                  {errors.submit}
                </div>
              )}
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-gray-200 bg-gray-50 px-5 py-5 sm:flex-row sm:justify-end md:px-7">
              <button
                type="button"
                disabled={loading}
                onClick={() => navigate("/employees")}
                className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Updating...
                  </span>
                ) : (
                  "Update Employee"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployeeEdit;
