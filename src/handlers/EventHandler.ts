import {readdir} from "node:fs/promises";
import {resolve, dirname, extname} from "node:path";
import {pathToFileURL, fileURLToPath} from "node:url";

import Client from "@/Client.js";
const EventsPath = resolve(dirname(fileURLToPath(import.meta.url)), "../events");

class EventHandler {
    /**
     *  Recursively retrieves JavaScript files from a directory.
     *  @param Directory - Directory to scan.
     *  @returns Absolute paths to JavaScript files.
    **/

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

    /**
     *  Loads and registers all event modules.
     *  @throws If an event module is invalid or fails to import.
    **/

    public async initialize(): Promise<void> {
        const Files = await this.getFiles(EventsPath);

        for (const File of Files) {
            const {default: Event} = await import(pathToFileURL(File).href);
            if (typeof Event !== "function") throw new Error(`Invalid event module: ${File}`);
            Event(Client);
        };
    };
};

export default new EventHandler();