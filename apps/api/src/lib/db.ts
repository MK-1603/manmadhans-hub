import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
  connectionTimeoutMillis: 30000,
  ssl: (connectionString?.includes('sslmode=') || connectionString?.includes('neon.tech'))
    ? { rejectUnauthorized: false }
    : false,
});

// Network error codes that should be silently ignored (DB unreachable / Neon paused)
const SILENT_CODES = new Set(['ENOTFOUND', 'ETIMEDOUT', 'ECONNREFUSED', 'ECONNRESET']);

export const query = async (text: string, params?: any[]) => {
  try {
    return await pool.query(text, params);
  } catch (err: any) {
    if (!SILENT_CODES.has(err?.code)) {
      // Only log genuine query errors, not transient network issues
      console.error('[DB Query Error]', err?.message || err);
    }
    throw err;
  }
};

export default pool;
