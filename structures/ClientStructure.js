import { Client, Collection, } from "discord.js";
;
export default class ClientStructure extends Client {
    commands = new Collection();
    constructor(Options) {
        super(Options);
    }
    ;
}
;
