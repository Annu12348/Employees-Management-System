import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from './routes/auth.routes.js'
import employeeRouter from "./routes/employee.routes.js"
import errorHandlingMiddleware from "./middleware/errorHandeling.middleware.js";

const app = express();
app.use(cors({
    origin: [
        "http://localhost:5173",
    ],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/employee", employeeRouter)

app.use(errorHandlingMiddleware)

export default app;