import { Router } from "express";
import { authRoutes } from "./v1/auth.routes.js";

const indexRouter = Router();

indexRouter.use("/auth",authRoutes);

export {indexRouter as indexRoutes};
