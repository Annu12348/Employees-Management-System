import mongoEmployeeRespository from "../respositories/implementations/mongoEmployeeRespository.js";
import AppError from "../utils/error.js";

class employeeServices {
    constructor() {
        this.mongoEmployeeRespository = new mongoEmployeeRespository();
    }

    async createEmployee(employeeData) {
        employeeData.email = employeeData.email.trim().toLowerCase();

        const existingEmployee = await this.mongoEmployeeRespository.findEmployeeByEmail(employeeData.email);

        if (existingEmployee) {
            throw new AppError("Employee with this email already exists", 409)
        }

        const employee = await this.mongoEmployeeRespository.createEmployee(employeeData);

        if (!employee) {
            throw new AppError("Failed to create employee", 500);
        }

        return employee
    }

    async updateEmployee(id, employeeData) {
        const existingEmployee = await this.mongoEmployeeRespository.findEmployeeById(id);

        if (!existingEmployee) {
            throw new AppError("Employee not found", 404);
        }

        const {
            fullName,
            email,
            mobileNumber,
            department,
            designation,
            salary,
            joiningDate,
            profileImage
        } = employeeData;

        const updateData = {
            fullName,
            email: email.trim().toLowerCase(),
            mobileNumber,
            department,
            designation,
            salary,
            joiningDate,
            profileImage
        };

        const employeeWithEmail = await this.mongoEmployeeRespository.findEmployeeByEmail(updateData.email);

        if (employeeWithEmail && employeeWithEmail._id.toString() !== id) {
            throw new AppError("Employee with this email already exists", 409);
        }

        const updatedEmployee = await this.mongoEmployeeRespository.updateEmployeeById(id, updateData);

        if (!updatedEmployee) {
            throw new AppError(
                "Failed to update employee",
                500
            );
        }

        return updatedEmployee;
    }

    async getEmployeeById(id) {
        const employee = await this.mongoEmployeeRespository.findEmployeeById(id);

        if (!employee) {
            throw new AppError("Employee not found", 404)
        }

        return employee;
    }

    async deleteEmployee(id) {
        const existingEmployee = await this.mongoEmployeeRespository.findEmployeeById(id)

        if (!existingEmployee) {
            throw new AppError("Employee not found", 404)
        }

        const deleteEmployee = await this.mongoEmployeeRespository.deleteEmployeeById(id);

        if (!deleteEmployee) {
            throw new AppError("Failed to delete employee", 500)
        }

        return deleteEmployee;
    }

    async allEmployee(query) {
        const { search, department, sort } = query;

        const employee = await this.mongoEmployeeRespository.allEmployee({
            search,
            department,
            sort
        });

        return employee;
    }
};

export default employeeServices;