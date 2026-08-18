class IEmployeeRepository {
    async createEmployee(employeeData) {
        throw new Error("metthod not implement")
    }

    async findEmployeeByEmail(email) {
        throw new Error("method not implement")
    } 

    async findEmployeeById(id) {
        throw new Error("method not implement")
    }

    async updateEmployeeById(id, employeeData) {
        throw new Error("method not implement")
    }

    async allEmployee() {
        throw new Error("method not implement")
    }
}

export default IEmployeeRepository;