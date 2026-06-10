import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function run() {
  try {
    const resUsers = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users';
    `);
    console.log("Users table columns:", resUsers.rows);

    const resTools = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'ai_tools';
    `);
    console.log("AI Tools table columns:", resTools.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
run();
