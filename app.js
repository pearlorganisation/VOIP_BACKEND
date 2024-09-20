import express from "express";
import cookieParser from "cookie-parser";

// Create an Express application
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//Routes imports
import authRouter from "./src/routes/authRoutes.js";

// Routes declaration
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter)

export { app };
