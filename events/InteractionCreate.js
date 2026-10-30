import { Events, MessageFlags } from "discord.js";
export default (Client) => {
    Client.on(Events.InteractionCreate, async (Interaction) => {
        if (!Interaction.isChatInputCommand())
            return;
        const Command = Client.commands.get(Interaction.commandName);
        if (!Command) {
            return await Interaction.reply({
                flags: MessageFlags.Ephemeral,
                content: "This command is outdated or no longer exists.",
            });
        }
        ;
        await Command.execute(Client, Interaction).catch(async (Error) => {
            console.error(Error);
            if (Interaction.replied || Interaction.deferred) {
                await Interaction.followUp({
                    flags: MessageFlags.Ephemeral,
                    content: "An error occurred while performing this action.",
                });
            }
            ;
            await Interaction.reply({
                flags: MessageFlags.Ephemeral,
                content: "An error occurred while performing this action.",
            });
        });
    });
};
