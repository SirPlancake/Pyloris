import { Events } from "discord.js";
export default function (Client) {
    Client.once(Events.ClientReady, () => {
        if (!Client.user)
            return;
        console.log(`[Discord]: Logged in as ${Client.user?.id}.`);
    });
}
;
