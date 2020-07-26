import { Client as PgClient } from 'pg';

const pgClient = new PgClient({
    connectionString: process.env.DATABASE_URL || "postgres://postgres:root@localhost:5433/main"
});

export let connected = false;

export async function waitConnection(): Promise<PgClient> {
    if (!connected) {
        await pgClient.connect();
        connected = true;
    }
    return pgClient;
}

export default pgClient;
