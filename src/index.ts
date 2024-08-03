import {
    DisconnectReason,
    useMultiFileAuthState,
} from "@whiskeysockets/baileys";
import { logger } from "./application/logging";
// import { authState, socket } from "./application/wa";
import { web } from "./application/web";
import "dotenv/config";
import fs from "fs";
import { Boom } from "@hapi/boom";
import { socket } from "./application/wa";

const port: number =
    process.env.PORT != null ? parseInt(process.env.PORT) : 3000;

web.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
    logger.info(`Listening on http://localhost:${port}`);
});

// (async () => {
//     const [sock, auth] = await Promise.all([socket(), authState]);
//     sock.ev.on("creds.update", auth.saveCreds);
//     sock.ev.on("connection.update", async (update) => {
//         const { connection } = update;

//         if (connection === "open") {
//             console.log("WhatsApp Active");
//             logger.info("WhatsApp Active");
//         } else if (connection === "close") {
//             console.log("WhatsApp Closed...");
//             logger.info("WhatsApp Closed...");
//         } else if (connection === "connecting") {
//             console.log("WhatsApp connecting");
//             logger.info("WhatsApp connecting");
//         }
//     });
// })();

// let cek: boolean = false

export async function connectToWhatsApp() {
    const auth = await useMultiFileAuthState("session");
    const sock = await socket(auth);

    sock.ev.on("creds.update", auth.saveCreds);
    sock.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (connection === "open") {
            console.log("WhatsApp Active");
            logger.info("WhatsApp Active");
        } else if (connection === "close") {
            console.log("WhatsApp Closed...");
            logger.info("WhatsApp Closed...");

            const error = (lastDisconnect?.error as Boom)?.output || {};
            const errorCode = error.statusCode;
            const errorMessage = error.payload?.message || "Unknown error";

            console.log(`Error Code: ${errorCode}`);
            console.log(`Error Message: ${errorMessage}`);
            logger.error(`Error Code: ${errorCode}`);
            logger.error(`Error Message: ${errorMessage}`);

            if (errorCode === DisconnectReason.loggedOut) {
                // Hapus sesi dan tampilkan QR code baru
                fs.rmSync("session", { recursive: true, force: true });
                console.log("Session deleted due to logout.");
                logger.info("Session deleted due to logout.");

                // Mulai ulang koneksi setelah 5 detik untuk menampilkan QR code baru
                setTimeout(connectToWhatsApp, 5000);
            } else {
                // Error lain, coba koneksi ulang setelah 5 detik
                setTimeout(connectToWhatsApp, 5000);
            }
        } else if (connection === "connecting") {
            console.log("WhatsApp connecting");
            logger.info("WhatsApp connecting");
        }

        if (qr) {
            console.log("Scan QR Code to connect:", qr);
        }
    });
    sock.ev.on("messages.upsert", async (m) => {
        console.log(m.messages[0]);
        const fromMe = m.messages[0].key.fromMe;
        const message = m.messages[0].message?.conversation;
        const nomor = m.messages[0].key.remoteJid;
        if (!fromMe) {
            if (message == "/pesan") {
                await sock.sendMessage(nomor!, {
                    text: `Pilih salah satu dari opsi di bawah ini:
1. Ayam
2. Ikan
3. Telur`,
                });
            }
        }
    });
}

connectToWhatsApp();
