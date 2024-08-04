import { Router } from "express";
import { WhatsappController } from "../controller/whatsapp-controller";
// import { WaMiddleware } from "../middleware/wa-middleware";

export const publicRouter = Router();
publicRouter.get("/connect/whatsapp", WhatsappController.connect);
publicRouter.get("/send-message", WhatsappController.sendMessage);
