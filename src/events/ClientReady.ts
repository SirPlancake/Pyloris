import {Events} from "discord.js";
import type ClientStructure from "@/structures/ClientStructure.js";

export default function (Client: ClientStructure): void {
    Client.once(Events.ClientReady, () => {
        if (!Client.user) return;
        console.log(`[Discord]: Logged in as ${Client.user?.id}.`);
    });
};