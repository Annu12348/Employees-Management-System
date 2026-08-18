import { body, param, query } from "express-validator";

export const createEmployeeValidator = [
    body("employeeId")
        .trim()
        .notEmpty()
        .withMessage("Employee ID is required")
        .isString()
        .withMessage("Employee ID must be a string")
        .isLength({ max: 50 })
        .withMessage("Employee ID must not exceed 50 characters"),

    body("fullName")
        .trim()
        .notEmpty()
        .withMessage("Full name is required")
        .isString()
        .withMessage("Full name must be a string")
        .isLength({ min: 2, max: 100 })
        .withMessage("Full name must be between 2 and 100 characters"),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email format")
        .normalizeEmail(),

    body("mobileNumber")
        .trim()
        .notEmpty()
        .withMessage("Mobile number is required")
        .isMobilePhone("en-IN")
        .withMessage("Invalid Indian mobile number"),

    body("department")
        .trim()
        .notEmpty()
        .withMessage("Department is required")
        .isString()
        .withMessage("Department must be a string")
        .isLength({ max: 100 })
        .withMessage("Department must not exceed 100 characters"),

    body("designation")
        .trim()
        .notEmpty()
        .withMessage("Designation is required")
        .isString()
        .withMessage("Designation must be a string")
        .isLength({ max: 100 })
        .withMessage("Designation must not exceed 100 characters"),

    body("salary")
        .notEmpty()
        .withMessage("Salary is required")
        .isFloat({ min: 0 })
        .withMessage("Salary must be a valid positive number")
        .toFloat(),

    body("joiningDate")
        .notEmpty()
        .withMessage("Joining date is required")
        .isISO8601()
        .withMessage("Joining date must be a valid date")
        .toDate(),

    body("profileImage")
        .optional({ nullable: true })
        .trim()
        .isURL()
        .withMessage("Profile image must be a valid URL"),
];

export const updateEmployeeValidator = [
    param("id")
        .notEmpty()
        .withMessage("Employee ID is required")
        .isMongoId()
        .withMessage("Invalid employee ID"),

    body("fullName")
        .trim()
        .notEmpty()
        .withMessage("Full name is required")
        .isString()
        .withMessage("Full name must be a string")
        .isLength({ min: 2, max: 100 })
        .withMessage("Full name must be between 2 and 100 characters"),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email format")
        .normalizeEmail(),

    body("mobileNumber")
        .trim()
        .notEmpty()
        .withMessage("Mobile number is required")
        .isMobilePhone("en-IN")
        .withMessage("Invalid Indian mobile number"),

    body("department")
        .trim()
        .notEmpty()
        .withMessage("Department is required")
        .isString()
        .withMessage("Department must be a string")
        .isLength({ max: 100 })
        .withMessage("Department must not exceed 100 characters"),

    body("designation")
        .trim()
        .notEmpty()
        .withMessage("Designation is required")
        .isString()
        .withMessage("Designation must be a string")
        .isLength({ max: 100 })
        .withMessage("Designation must not exceed 100 characters"),

    body("salary")
        .notEmpty()
        .withMessage("Salary is required")
        .isFloat({ min: 0 })
        .withMessage("Salary must be a valid positive number")
        .toFloat(),

    body("joiningDate")
        .notEmpty()
        .withMessage("Joining date is required")
        .isISO8601()
        .withMessage("Joining date must be a valid date")
        .toDate(),

    body("profileImage")
        .optional({ nullable: true })
        .trim()
        .isURL()
        .withMessage("Profile image must be a valid URL"),
];

export const employeeIdValidator = [
    param("id")
        .trim()
        .notEmpty()
        .withMessage("Employee ID is required")

        .isMongoId()
        .withMessage("Invalid employee ID"),
];

export const employeeQueryValidator = [
    query("search")
        .optional()
        .trim()
        .isString()
        .withMessage("Search must be a string")
        .isLength({ max: 100 })
        .withMessage("Search must not exceed 100 characters"),

    query("department")
        .optional()
        .trim()
        .isString()
        .withMessage("Department must be a string")
        .isLength({ max: 100 })
        .withMessage("Department must not exceed 100 characters"),

    query("sort")
        .optional()
        .trim()
        .toLowerCase()
        .isIn(["name", "-name"])
        .withMessage(
            "Sort must be either 'name' or '-name'"
        ),
];