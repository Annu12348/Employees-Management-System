import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import EmployeeList from "../pages/employee/EmployeeList";
import EmployeeAdd from "../pages/employee/EmployeeAdd";
import EmployeeEdit from "../pages/employee/EmployeeEdit";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import AuthRedirect from "../components/auth/AuthRedirect";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthRedirect />} />
      <Route path="/login" element={<Login />} />
      
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employees"
        element={
          <ProtectedRoute>
            <EmployeeList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employees/add"
        element={
          <ProtectedRoute>
            <EmployeeAdd />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employees/edit/:id"
        element={
          <ProtectedRoute>
            <EmployeeEdit />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default Router;
