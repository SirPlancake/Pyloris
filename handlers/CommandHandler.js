import { Collection } from "discord.js";
import { readdir } from "node:fs/promises";
import { resolve, dirname, extname } from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";
import Client from "../Client.js";
const CommandsPath = resolve(dirname(fileURLToPath(import.meta.url)), "../commands");
class CommandHandler {
    /**
     *  Recursively retrieves JavaScript files from a directory.
     *  @param Directory - Directory to scan.
     *  @returns Absolute paths to JavaScript files.
    **/
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
    /**
     *  Loads and registers all command modules.
     *  @throws If a command module is invalid or fails to import.
    **/
    async initialize() {
        Client.commands = new Collection();
        const Files = await this.getFiles(CommandsPath);
        for (const File of Files) {
            const { default: Command } = await import(pathToFileURL(File).href);
            if (!Command?.data?.name || typeof Command.execute !== "function")
                throw new Error(`Invalid command module: ${File}`);
            Client.commands.set(Command.data.name, Command);
        }
        ;
    }
    ;
}
;
export default new CommandHandler();
