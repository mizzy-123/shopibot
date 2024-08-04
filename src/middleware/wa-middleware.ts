import { NextFunction, Response } from "express";
import { WASocket } from "@whiskeysockets/baileys";
import { WaRequest } from "../request/wa-request";

export const waMiddleware = (sock: WASocket) => {
    // const auth = await useMultiFileAuthState("session");
    // const sock = await socket(auth);

    // req.sock = sock as WASocket;

    return (req: WaRequest, res: Response, next: NextFunction) => {
        req.sock = sock as WASocket;
        next();
    };
};
