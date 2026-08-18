import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import mongoAuthRespository from "../respositories/implementations/mongoAuthRespository.js";
import AppError from "../utils/error.js";
import { config } from "../config/config.js";

class AuthService {
    constructor() {
        this.mongoAuthRespository = new mongoAuthRespository();
    }

    async login(email, password) {
        email = email.trim().toLowerCase();
       
        const user = await this.mongoAuthRespository.findAuthByEmail(email)

        if (!user) {
            throw new AppError("Invalid email or password", 401)
        }

        const matchPassword = await bcrypt.compare(password, user.password);

        if (!matchPassword) {
            throw new AppError("Invalid email or password", 401)
        }

        const token = jwt.sign(
            { id: user._id },
            config.JWT_SECRET_KEY,
            { expiresIn: '1d' }
        );

        return {
            user, 
            token
        };
    }
}

export default AuthService;