import employeeModel from "../../models/employee.model.js"
import AppError from "../../utils/error.js"
import IEmployeeRepository from "../contracts/IEmployeeRespository.js";

class mongoEmployeeRespository extends IEmployeeRepository {
    async createEmployee(employeeData) {
        try {
            const employee = await employeeModel.create(employeeData);

            return employee;
        } catch (error) {
            throw new AppError(`Failed to create employee: ${error.message}`, 500, error)
        }
    }

    async findEmployeeByEmail(email) {
        try {
            return await employeeModel.findOne({ email });
        } catch (error) {
            throw new AppError(`Failed to find employee by email: ${error.message}`, 500, error)
        }
    }

    async findEmployeeById(id) {
        try {
            const employee = await employeeModel.findById(id);
            return employee;
        } catch (error) {
            throw new AppError(`Failed to find employee by id: ${error.message}`, 500, error)
        }
    }

    async updateEmployeeById(id, employeeData) {
        try {
            const employee = await employeeModel.findByIdAndUpdate(
                id,
                {
                    $set: employeeData,
                },
                {
                    new: true,
                    runValidators: true,
                }
            );

            return employee;
        } catch (error) {
            throw new AppError(`Failed to update employee: ${error.message}`, 500, error)
        }
    }

    async deleteEmployeeById(id) {
        try {
            const employee = await employeeModel.findByIdAndDelete(id);

            return employee;
        } catch (error) {
            throw new AppError(`Failed to delete employee: ${error.message}`, 500, error)
        }
    }

    async allEmployee({ search, department, sort }) {
        try {
            const filter = {};

            if (search) {
                filter.fullName = {
                    $regex: search,
                    $options: "i"
                };
            }

            if (department) {
                filter.department = {
                    $regex: `^${department}$`,
                    $options: "i"
                };
            }

            let sortOption = {
                updatedAt: -1
            };

            if (sort === "name") {
                sortOption = {
                    fullName: 1,
                    updatedAt: -1
                };
            }

            if (sort === "-name") {
                sortOption = {
                    fullName: -1,
                    updatedAt: -1
                };
            }

            const employee = await employeeModel.find(filter).sort(sortOption);

            return employee;
        } catch (error) {
            throw new AppError(`Failed to all employee: ${error.message}`, 500, error)
        }
    }
}

export default mongoEmployeeRespository;