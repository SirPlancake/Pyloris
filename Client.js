import { IntentsBitField, Partials } from "discord.js";
import ConfigManager from "./managers/ConfigManager.js";
import DatabaseManager from "./managers/DatabaseManager.js";
import RedisManager from "./managers/RedisManager.js";
import ClientStructure from "./structures/ClientStructure.js";
import CommandHandler from "./handlers/CommandHandler.js";
import EventHandler from "./handlers/EventHandler.js";
const DiscordConfig = ConfigManager.getDiscord();
const Client = new ClientStructure({
    intents: [IntentsBitField.Flags.Guilds],
    partials: [Partials.User, Partials.Channel, Partials.GuildMember],
});
DatabaseManager.create().then(() => {
    RedisManager.create().then(async () => {
        await CommandHandler.initialize();
        await EventHandler.initialize();
        Client.login(DiscordConfig.token);
    });
});
export default Client;
