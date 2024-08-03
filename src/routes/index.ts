import { Router } from "express";
import { publicRouter } from "./public-api";
import { apiRouter } from "./api";

export const appRouter = Router();

appRouter.use("/api", publicRouter);
appRouter.use("/api", apiRouter);
