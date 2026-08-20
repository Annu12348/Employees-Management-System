import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    employees: [],
    selectedEmployee: null,
    loading: false,
    error: null,
};

const employeeSlice = createSlice({
    name: "Employee",
    initialState,

    reducers: {
        setEmployees: (state, action) => {
            state.employees = Array.isArray(action.payload)
                ? action.payload
                : [];

            state.error = null;
        },

        addEmployee: (state, action) => {
            const newEmployee = action.payload;

            if (!newEmployee) {
                return;
            }

            const exists = state.employees.some(
                (employee) =>
                    employee._id === newEmployee._id ||
                    employee.employeeId === newEmployee.employeeId
            );

            if (!exists) {
                state.employees.unshift(newEmployee);
            }
        },

        updateEmployee: (state, action) => {
            const updatedEmployee = action.payload;

            if (!updatedEmployee) {
                return;
            }

            const index = state.employees.findIndex(
                (employee) =>
                    employee._id === updatedEmployee._id
            );

            if (index !== -1) {
                state.employees[index] = updatedEmployee;
            }
        },

        removeEmployee: (state, action) => {
            state.employees = state.employees.filter(
                (employee) =>
                    employee._id !== action.payload
            );
        },

        setSelectedEmployee: (state, action) => {
            state.selectedEmployee = action.payload;
        },

        clearSelectedEmployee: (state) => {
            state.selectedEmployee = null;
        },

        setEmployeeLoading: (state, action) => {
            state.loading = action.payload;
        },

        setEmployeeError: (state, action) => {
            state.error = action.payload;
        },

        clearEmployeeError: (state) => {
            state.error = null;
        },

        clearEmployees: (state) => {
            state.employees = [];
            state.selectedEmployee = null;
            state.loading = false;
            state.error = null;
        },
    },
});

export const {
    setEmployees,
    addEmployee,
    updateEmployee,
    removeEmployee,
    setSelectedEmployee,
    clearSelectedEmployee,
    setEmployeeLoading,
    setEmployeeError,
    clearEmployeeError,
    clearEmployees,
} = employeeSlice.actions;

export default employeeSlice.reducer;