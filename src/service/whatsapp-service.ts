import { socket } from "../application/wa";
import QRCode from "qrcode";
import { ResponseError } from "../error/response-error";
import { useMultiFileAuthState, WASocket } from "@whiskeysockets/baileys";

let sock: WASocket;

export class WhatsappService {
    static async connect(): Promise<string> {
        return new Promise((resolve, reject) => {
            useMultiFileAuthState("session").then((auth) => {
                socket(auth)
                    .then(async (s) => {
                        sock = s;
                        let qrCodeHandled = false;

                        // const auth = await authState;

                        // sock.ev.on("creds.update", auth.saveCreds);
                        sock.ev.on("connection.update", async (update) => {
                            const { qr, connection } = update;

                            if (connection === "open") {
                                reject(
                                    new ResponseError(400, "Whatsapp Active")
                                );
                            } else if (qr) {
                                qrCodeHandled = true;
                                try {
                                    const qrBase64 = await QRCode.toDataURL(qr);
                                    resolve(qrBase64);
                                } catch (error) {
                                    reject(
                                        new Error("Failed to generate QR code")
                                    );
                                }
                            }
                        });

                        // Timeout if QR code is not found within a certain time
                        setTimeout(() => {
                            if (!qrCodeHandled) {
                                reject(
                                    new ResponseError(404, "QR code not found")
                                );
                            }
                        }, 5000); // 10 seconds timeout
                    })
                    .catch((error) => {
                        reject(new ResponseError(500, error.message));
                    });
            });
        });
    }
}
