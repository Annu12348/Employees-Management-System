import { config } from "../config/config.js";
import AuthService from "../services/auth.service.js";
import jwt from "jsonwebtoken";

class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const result = await this.authService.login(email, password);

      res.cookie("token", result.token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      });

      res.status(200).json({
        success: true,
        message: "User logged in successfully",
        result: result.user,
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      });

      return res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async ProtectedRoute(req, res, next) {
    try {
      const token = req.cookies.token;

      if (!token) {
        return res.status(404).json({
          message: "Unauthorized token",
        });
      }

      const decoded = jwt.verify(token, config.JWT_SECRET_KEY);
      if (!decoded) {
        return res.status(401).json({
          message: "Unauthorized access",
        });
      }

      res.status(200).json({
        message: "Access to the protected resource was successful.",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
