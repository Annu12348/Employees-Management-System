import express from 'express';
import AuthController from '../controller/auth.controller.js';
import { loginValidator } from '../middleware/validator/user.validator.js';
import { errorValidator } from '../middleware/errorHandeling.middleware.js';
const router = express.Router();

const authController = new AuthController();

router.post(
    "/login",
    loginValidator,
    errorValidator,
    authController.login.bind(authController)
);

router.post(
    "/logout",
    authController.logout.bind(authController)
)

export default router;