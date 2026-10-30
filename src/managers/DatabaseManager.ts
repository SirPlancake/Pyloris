
import {Pool} from "pg";
import ConfigManager from "@/managers/ConfigManager.js";

class DatabaseManager {
    private Pool: Pool | null = null;

    /**
     *  Creates the PostgreSQL connection pool and verifies the connection.
     *  @throws {Error} If the database connection fails.
    **/

    public async create(): Promise<void> {
        const Startup = Date.now();
        const DatabaseConfig = ConfigManager.getPostgres();

        this.Pool = new Pool({
            user: DatabaseConfig.username,
            host: DatabaseConfig.host,
            password: DatabaseConfig.password,
            database: DatabaseConfig.database,
            port: DatabaseConfig.port,
        });

        await this.Pool.query("SELECT 1");
        console.log(`[Database]: Connected to PostgreSQL in ${Date.now() - Startup}ms.`,);
    };

    /**
     *  Creates the required database tables and indexes.
    **/

    public async setup(): Promise<void> {}

    /**
     *  Returns the PostgreSQL connection pool.
     *  @throws {Error} If the database has not been created.
    **/

    public get(): Pool {
        if (!this.Pool) throw new Error("Database instance has not been created.");
        return this.Pool;
    };
};

export default new DatabaseManager();