import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgres://postgres:root@localhost:5433/main",
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

pool.on('connect', async (client) => {
  await client.query('SET statement_timeout TO 3000')
});
