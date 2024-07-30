import makeWASocket, { useMultiFileAuthState } from "@whiskeysockets/baileys";
import { log } from "console";

async function connectToWhatssapp() {
    const authState = await useMultiFileAuthState("session");
    const sock = makeWASocket({
        printQRInTerminal: true,
        browser: ["windows", "chrome", "10"],
        auth: authState.state,
    });

    sock.ev.on("creds.update", authState.saveCreds);
    sock.ev.on("connection.update", (update) => {
        const { connection, qr } = update;
        if (connection == "open") {
            log("Whatssapp Active");
        } else if (connection == "close") {
            log("Whatssapp Closed...");
            connectToWhatssapp();
        } else if (connection == "connecting") {
            log("Whatssapp connecting");
        }
        if (qr) {
            console.log("kode qr: ", qr);
        }
    });
}

connectToWhatssapp();
