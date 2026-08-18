import AuthService from "../services/auth.service.js";

class AuthController {
    constructor() {
        this.authService = new AuthService()
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;

            const result = await this.authService.login(email, password);

            res.cookie("token", result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                maxAge: 24 * 60 * 60 * 1000,
            })

            res.status(200).json({
                success: true,
                message: "User logged in successfully",
                result: result.user
            });
        } catch (error) {
            console.error("Login error:", error);

            res.status(500).json({
                message: error.message || "Internal server error"
            })
        }
    }

    async logout(req, res) {
        try {
            res.clearCookie("token", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/"
            });

            return res.status(200).json({
                success: true,
                message: "Logged out successfully",
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

export default AuthController;