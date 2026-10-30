
import {Redis} from "ioredis";
import ConfigManager from "@/managers/ConfigManager.js";

class RedisManager {
    private Client: Redis | null = null;

    /**
     *  Creates the Redis connection and verifies the connection.
     *  @throws {Error} If the Redis connection fails.
    **/

    public async create(): Promise<void> {
        const Startup = Date.now();
        const RedisConfig = ConfigManager.getRedis();

        const Client = new Redis({
            host: RedisConfig.host,
            password: RedisConfig.password,
            port: RedisConfig.port,
            lazyConnect: true,
        });

        await Client.connect();
        await Client.ping();
        this.Client = Client;
        console.log(`[Redis]: Connected to Redis in ${Date.now() - Startup}ms.`);
    };

    /**
     *  Returns the Redis client.
     *  @throws {Error} If Redis has not been created.
    **/

    public get(): Redis {
        if (!this.Client) throw new Error("Redis instance has not been created.");
        return this.Client;
    };
};

export default new RedisManager();