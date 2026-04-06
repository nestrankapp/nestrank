import { Pool } from 'pg';

const globalForDb = globalThis;

export const pool =
  globalForDb.__nestrankPool ||
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

if (process.env.NODE_ENV !== 'production') {
  globalForDb.__nestrankPool = pool;
}

export async function query(text, params = []) {
  const client = await pool.connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
}

export async function ensureSavedSearchesTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS saved_searches (
      id UUID PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      address TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}
