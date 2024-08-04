import { type WASocket } from "@whiskeysockets/baileys";
import { Request } from "express";

export interface WaRequest extends Request {
    sock?: WASocket;
}
