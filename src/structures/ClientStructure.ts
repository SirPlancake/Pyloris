
import {
    Client,
    Collection,
    type ClientOptions,
    type SlashCommandBuilder,
    type ChatInputCommandInteraction,
} from "discord.js";

interface Command {
    data: SlashCommandBuilder;
    execute(Client: ClientStructure, Interaction: ChatInputCommandInteraction): Promise<void>;
};

export default class ClientStructure extends Client {
    public commands = new Collection<string, Command>();
    constructor(Options: ClientOptions) {
        super(Options);
    };
};