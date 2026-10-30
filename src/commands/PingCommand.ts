import {InteractionContextType, MessageFlags, SlashCommandBuilder, type ChatInputCommandInteraction} from "discord.js";
import type ClientStructure from "@/structures/ClientStructure.js";

export default {
    data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Shows if the application is alive or not.")
    .setContexts([InteractionContextType.Guild]),
    async execute(Client: ClientStructure, Interaction: ChatInputCommandInteraction): Promise<void> {
        await Interaction.reply({
            flags: [MessageFlags.Ephemeral],
            content: "🏓 Pong!",
        });
    },
};