import { NextFunction, Request, Response } from "express";
import { WhatsappService } from "../service/whatsapp-service";

export class WhatsappController {
    static async connect(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await WhatsappService.connect();
            res.status(200).json({
                message: "Success",
                qr: result,
            });
        } catch (error) {
            next(error);
        }
    }

    static async sendMessage(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await WhatsappService.sendMessage();
            res.status(200).json({
                message: "Success send message",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }
}
