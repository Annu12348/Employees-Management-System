import userModel from "../../models/user.model.js";
import AppError from "../../utils/error.js";
import IAuthRespository from "../contracts/IAuthRespository.js";

class mongoAuthRespository extends IAuthRespository {
    async findAuthByEmail(email) {
        try {
            return await userModel.findOne({email}).select("+password");
        } catch (error) {
            throw new AppError(`failed to email: ${error.message}`, 500, error)
        }
    }

    async userFetchById (userId) {
        try {
            const user = await userModel.findById(userId)

            return user;
        } catch (error) {
            throw new AppError(`Failed to fetch user by ID: ${error.message}`, 500, error)
        }
    }
}

export default mongoAuthRespository;