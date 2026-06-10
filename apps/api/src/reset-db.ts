import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const tables = [
  'ai_tools',
  'categories',
  'users',
  'user_tools',
  'security_logs',
  'audit_logs',
  'system_snapshots',
  'activity_logs',
  'push_subscriptions'
];

async function resetDB() {
  try {
    console.log('=== DATABASE RESET PROTOCOL INITIATED ===');
    console.log('Truncating tables without dropping schemas...');

    // Fetch all tables in the public schema
    const result = await pool.query(`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public';
    `);
    
    const existingTables = result.rows.map(r => r.tablename);
    
    if (existingTables.length > 0) {
      const query = `TRUNCATE TABLE ${existingTables.map(t => `"${t}"`).join(', ')} RESTART IDENTITY CASCADE;`;
      await pool.query(query);
      console.log(`✅ All data cleared successfully from ${existingTables.length} tables. Schemas preserved.`);
    } else {
      console.log('No tables found to truncate.');
    }
    console.log('=============================================');
  } catch (err) {
    console.error('Database reset failed:', err);
  } finally {
    await pool.end();
  }
}

resetDB();
