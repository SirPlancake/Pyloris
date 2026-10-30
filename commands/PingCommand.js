import { InteractionContextType, MessageFlags, SlashCommandBuilder } from "discord.js";
export default {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Shows if the application is alive or not.")
        .setContexts([InteractionContextType.Guild]),
    async execute(Client, Interaction) {
        await Interaction.reply({
            flags: [MessageFlags.Ephemeral],
            content: "🏓 Pong!",
        });
    },
};
