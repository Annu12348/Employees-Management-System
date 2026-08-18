import employeeServices from "../services/employee.service.js";

class employeeController {
    constructor() {
        this.employeeServices = new employeeServices()
    }

    async createEmployee(req, res, next) {
        try {
            const employee = await this.employeeServices.createEmployee(req.body);

            res.status(201).json({
                success: true,
                message: "Employee created successfully",
                result: employee
            });
        } catch (error) {
            next(error);
        }
    }

    async updateEmployee(req, res, next) {
        try {
            const { id } = req.params;

            const updatedEmployee = await this.employeeServices.updateEmployee(id, req.body);

            return res.status(200).json({
                success: true,
                message: "Employee updated successfully",
                data: updatedEmployee,
            });

        } catch (error) {
            next(error);
        }
    }

    async getEmployeeById(req, res, next) {
        try {
            const { id } = req.params;

            const employee = await this.employeeServices.getEmployeeById(id);

            return res.status(200).json({
                success: true,
                message: "Employee fetched successfully",
                data: employee,
            });
        } catch (error) {
            next(error)
        }
    }

    async deleteEmployee(req, res, next) {
        try {
            const { id } = req.params;

            await this.employeeServices.deleteEmployee(id);

            return res.status(200).json({
                success: true,
                message: "Employee deleted successfully",
            });
        } catch (error) {
            next(error)
        }
    }

    async allEmployee(req, res, next) {
        try {
            const employees = await this.employeeServices.allEmployee(req.query);

            return res.status(200).json({
                success: true,
                message: "Employees fetched successfully",
                count: employees.length,
                data: employees,
            });
        } catch (error) {
            next(error)
        }
    }
}

export default employeeController;