import { Router } from "express";
import { WhatsappController } from "../controller/whatsapp-controller";

export const publicRouter = Router();
publicRouter.get("/connect/whatsapp", WhatsappController.connect);
