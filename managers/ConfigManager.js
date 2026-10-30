import "dotenv/config";
;
;
;
class ConfigManager {
    getDiscord() {
        return {
            id: this.getString("DISCORD_ID"),
            token: this.getString("DISCORD_TOKEN"),
            server_id: this.getString("DISCORD_SERVER_ID"),
        };
    }
    ;
    getPostgres() {
        return {
            host: this.getString("POSTGRES_HOST"),
            username: this.getString("POSTGRES_USERNAME"),
            password: this.getString("POSTGRES_PASSWORD"),
            database: this.getString("POSTGRES_DATABASE"),
            port: this.getNumber("POSTGRES_PORT"),
        };
    }
    ;
    getRedis() {
        return {
            host: this.getString("REDIS_HOST"),
            password: this.getString("REDIS_PASSWORD"),
            port: this.getNumber("REDIS_PORT"),
        };
    }
    ;
    getString(ID) {
        const Value = process.env[ID];
        if (!Value)
            throw new Error(`Missing environment variable: ${ID}`);
        return Value;
    }
    ;
    getNumber(ID) {
        const Value = this.getString(ID);
        const Parsed = Number(Value);
        if (!Number.isFinite(Parsed))
            throw new Error(`Environment variable ${ID} must be a number.`);
        return Parsed;
    }
    ;
    getBoolean(ID) {
        const Value = this.getString(ID).toLowerCase();
        if (Value === "true")
            return true;
        if (Value === "false")
            return false;
        throw new Error(`Environment variable ${ID} must be "true" or "false".`);
    }
    ;
}
;
export default new ConfigManager();
