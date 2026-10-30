import { REST, Routes } from "discord.js";
import { readdir } from "node:fs/promises";
import { resolve, dirname, extname } from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";
import ConfigManager from "../managers/ConfigManager.js";
const CommandsPath = resolve(dirname(fileURLToPath(import.meta.url)), "../commands");
class DeployScript {
    async getFiles(Directory) {
        const Entries = await readdir(Directory, {
            withFileTypes: true,
        });
        const Files = await Promise.all(Entries.map(async (Entry) => {
            const FilePath = resolve(Directory, Entry.name);
            if (Entry.isDirectory())
                return this.getFiles(FilePath);
            return Entry.isFile() && [".js", ".ts"].includes(extname(Entry.name)) ? [FilePath] : [];
        }));
        return Files.flat();
    }
    ;
    async deploy() {
        const Commands = [];
        const Files = await this.getFiles(CommandsPath);
        for (const File of Files) {
            const { default: Command } = await import(pathToFileURL(File).href);
            if (!Command?.data?.name || typeof Command.data.toJSON !== "function" || typeof Command.execute !== "function") {
                throw new Error(`Invalid command module: ${File}`);
            }
            ;
            Commands.push(Command.data.toJSON());
        }
        ;
        const DiscordConfig = ConfigManager.getDiscord();
        const Rest = new REST({ version: "10" }).setToken(DiscordConfig.token);
        await Rest.put(Routes.applicationGuildCommands(DiscordConfig.id, DiscordConfig.server_id), {
            body: Commands
        });
        console.log(`Successfully deployed ${Commands.length} slash commands.`);
    }
    ;
}
;
new DeployScript().deploy().catch((Error) => {
    console.error("Failed to deploy slash commands:", Error);
    process.exitCode = 1;
});
