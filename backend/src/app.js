import express from "express";
import authRouter from './routes/auth.routes.js'
const app = express();

app.get("/", authRouter);

export default app;