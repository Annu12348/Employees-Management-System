import express from "express";
import employeeController from "../controller/employee.controller.js";
import { userAuth } from "../middleware/auth.middleware.js";
import { createEmployeeValidator, employeeIdValidator, employeeQueryValidator, updateEmployeeValidator } from "../middleware/validator/employee.validator.js";
import { errorValidator } from "../middleware/errorValidator.js";
const router = express.Router();

const employeeControllers = new employeeController()

router.get(
    "/",
    userAuth,
    employeeQueryValidator,
    errorValidator,
    employeeControllers.allEmployee.bind(employeeControllers)
);

router.get(
    "/:id",
    userAuth,
    employeeIdValidator,
    errorValidator,
    employeeControllers.getEmployeeById.bind(employeeControllers)
)

router.post(
    "/create",
    userAuth,
    createEmployeeValidator,
    errorValidator,
    employeeControllers.createEmployee.bind(employeeControllers)
)

router.put(
    "/:id", 
    userAuth,
    updateEmployeeValidator,
    errorValidator,
    employeeControllers.updateEmployee.bind(employeeControllers)
)

router.delete(
    "/:id",
    userAuth,
    employeeIdValidator,
    errorValidator,
    employeeControllers.deleteEmployee.bind(employeeControllers)
)

export default router;