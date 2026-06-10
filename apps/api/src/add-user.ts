import pg from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function addUser() {
  try {
    const defaultPassword = 'Welcome@123';
    const hashedPass = await bcrypt.hash(defaultPassword, 10);
    
    console.log('Seeding user TN813...');
    await pool.query(
      `INSERT INTO users (id, email, username, passkey, role, must_change_password) 
       VALUES ($1, $2, $3, $4, $5, true)
       ON CONFLICT (id) DO UPDATE SET 
       email = EXCLUDED.email, 
       username = EXCLUDED.username, 
       role = EXCLUDED.role;`,
      [23, 'harishtn813@gmail.com', 'TN813', hashedPass, 'Admin']
    );
    console.log('User harishtn813@gmail.com (TN813) seeded successfully.');
  } catch (err) {
    console.error('Failed to add user:', err);
  } finally {
    await pool.end();
  }
}

addUser();
