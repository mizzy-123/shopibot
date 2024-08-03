import express from "express";
import corsMiddleware from "../middleware/cors-middleware";
import { errorMiddleware } from "../middleware/error-middleware";
import { appRouter } from "../routes";

export const web = express();

web.use(corsMiddleware);
web.use(express.json());
web.use(express.urlencoded({ extended: true }));
web.use(appRouter);
web.use(errorMiddleware);
