import makeWASocket, {
    AuthenticationState,
    WASocket,
} from "@whiskeysockets/baileys";

// export const authState = useMultiFileAuthState("session");
export const socket = async (authState: {
    state: AuthenticationState;
    saveCreds: () => Promise<void>;
}): Promise<WASocket> => {
    const auth = authState;
    const sock = makeWASocket({
        printQRInTerminal: true,
        browser: ["windows", "chrome", "10"],
        auth: auth.state,
    });
    return sock;
};
