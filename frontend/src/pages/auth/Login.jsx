import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../redux/reducer/authSlice";
import instance from "../../utils/axios";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      submit: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    const email = formData.email.trim();
    const password = formData.password;

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const loginApi = async () => {
    try {
      setLoading(true);
      setErrors({});
      const res = await instance.post(`/auth/login`, formData, {
        withCredentials: true,
      });
      dispatch(setUser(res.data.result));
      console.log(res.data.result);
      navigate("/dashboard");
      toast.success("successfully user login");
      setFormData({
        email: "",
        password: "",
      });
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrors({ submit: error.response.data.message });
      } else if (error.message) {
        setErrors({ submit: error.message });
      } else {
        setErrors({ submit: "Internal server error" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    loginApi();
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="hidden bg-blue-700 lg:flex">
          <div className="flex w-full flex-col justify-between p-12 xl:p-16">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-xl font-bold text-white">
                  EM
                </div>
                <span className="text-xl font-bold text-white">
                  Employee Management
                </span>
              </div>
            </div>
            <div className="max-w-xl">
              <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue-200">
                Employee Management System
              </p>
              <h1 className="text-4xl font-bold leading-tight text-white xl:text-5xl">
                Manage your employees
                <span className="block text-blue-200">efficiently.</span>
              </h1>
              <p className="mt-6 max-w-lg text-base leading-7 text-blue-100">
                Manage employee records, departments, designations and other
                workforce information from one centralized system.
              </p>
              <div className="mt-10 space-y-6">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/15 text-white">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">
                      Employee Management
                    </h3>
                    <p className="mt-1 text-sm text-blue-100">
                      Add, update, view and delete employee records.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/15 text-white">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">
                      Search & Filter
                    </h3>
                    <p className="mt-1 text-sm text-blue-100">
                      Quickly find employees by name and department.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/15 text-white">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Secure Access</h3>
                    <p className="mt-1 text-sm text-blue-100">
                      Protected access using authentication.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm text-blue-200">
              © 2026 Employee Management System
            </p>
          </div>
        </section>
        <section className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-12">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center lg:hidden">
              <h1 className="text-2xl font-bold text-slate-900">
                Employee Management
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Employee Management System
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900">
                  Welcome Back
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Sign in to access your dashboard
                </p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    autoComplete="email"
                    disabled={loading}
                    className={`w-full rounded-lg border px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 ${
                      errors.email
                        ? "border-red-500 focus:ring-2 focus:ring-red-100"
                        : "border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-xs text-red-600">
                      {errors.email}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      disabled={loading}
                      className={`w-full rounded-lg border px-4 py-3 pr-20 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 ${
                        errors.password
                          ? "border-red-500 focus:ring-2 focus:ring-red-100"
                          : "border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      disabled={loading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-500 hover:text-blue-600"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1.5 text-xs text-red-600">
                      {errors.password}
                    </p>
                  )}
                </div>
                {errors.submit && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                    <p className="text-sm text-red-600">{errors.submit}</p>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Login;
