import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function checkTables() {
  try {
    const res = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('Tables:', res.rows.map(r => r.table_name));
    
    // Check if categories table exists
    const hasCategories = res.rows.some(r => r.table_name === 'categories');
    if (hasCategories) {
        const catRes = await pool.query('SELECT * FROM categories LIMIT 1');
        console.log('Categories columns:', Object.keys(catRes.rows[0] || {}));
    }

  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

checkTables();
