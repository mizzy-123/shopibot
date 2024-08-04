import QRCode from "qrcode";
import { ResponseError } from "../error/response-error";
import { outSock } from "..";

export class WhatsappService {
    static async connect(): Promise<string> {
        const sock = outSock;
        if (!sock) {
            throw new ResponseError(400, "Whatsapp Error");
        }
        return new Promise((resolve, reject) => {
            let qrCodeHandled = false;
            sock.ev.on("connection.update", async (update) => {
                const { qr, connection } = update;

                if (connection === "open") {
                    reject(new ResponseError(400, "Whatsapp Active"));
                } else if (qr) {
                    qrCodeHandled = true;
                    try {
                        const qrBase64 = await QRCode.toDataURL(qr);
                        resolve(qrBase64);
                    } catch (error) {
                        reject(new Error("Failed to generate QR code"));
                    }
                }
            });

            // Timeout if QR code is not found within a certain time
            setTimeout(() => {
                if (!qrCodeHandled) {
                    reject(new ResponseError(404, "QR code not found"));
                }
            }, 5000); // 10 seconds timeout
        });
    }

    static async sendMessage(): Promise<string> {
        const sock = outSock;
        if (!sock) {
            throw new ResponseError(400, "Whatsapp Error");
        }

        // sock.ev.on("messages.upsert", async () => {
        const sendmsg = await sock.sendMessage("6282141765353@s.whatsapp.net", {
            text: "Helo 123",
        });
        // });
        console.log("send", sendmsg?.toJSON);
        return "berhasil";
    }
}
