import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import mongoAuthRespository from '../respositories/implementations/mongoAuthRespository.js';

const authRepository = new mongoAuthRespository();

export const userAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        const decoded = jwt.verify(token, config.JWT_SECRET_KEY);

        const user = await authRepository.userFetchById(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Authentication failed",
            });
        }

        req.user = user;

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired authentication token",
        });
    }
};