import {RESTPostAPIChatInputApplicationCommandsJSONBody, REST, Routes} from "discord.js";
import {readdir} from "node:fs/promises";
import {resolve, dirname, extname} from "node:path";
import {pathToFileURL, fileURLToPath} from "node:url";

import ConfigManager from "@/managers/ConfigManager.js";
const CommandsPath = resolve(dirname(fileURLToPath(import.meta.url)), "../commands");

class DeployScript {
    private async getFiles(Directory: string): Promise<string[]> {
        const Entries = await readdir(Directory, {
            withFileTypes: true,
        });

        const Files = await Promise.all(Entries.map(async (Entry): Promise<string[]> => {
            const FilePath = resolve(Directory, Entry.name);
            if (Entry.isDirectory()) return this.getFiles(FilePath);
            return Entry.isFile() && [".js", ".ts"].includes(extname(Entry.name)) ? [FilePath] : [];
        }));

        return Files.flat();
    };

    public async deploy(): Promise<void> {
        const Commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
        const Files = await this.getFiles(CommandsPath);

        for (const File of Files) {
            const {default: Command} = await import(pathToFileURL(File).href);

            if (!Command?.data?.name || typeof Command.data.toJSON !== "function" || typeof Command.execute !== "function") {
                throw new Error(`Invalid command module: ${File}`);
            };

            Commands.push(Command.data.toJSON());
        };

        const DiscordConfig = ConfigManager.getDiscord();
        const Rest = new REST({version: "10"}).setToken(DiscordConfig.token);
        await Rest.put(Routes.applicationGuildCommands(DiscordConfig.id, DiscordConfig.server_id), {
            body: Commands
        });

        console.log(`Successfully deployed ${Commands.length} slash commands.`);
    };
};

new DeployScript().deploy().catch((Error: unknown) => {
    console.error("Failed to deploy slash commands:", Error);
    process.exitCode = 1;
});