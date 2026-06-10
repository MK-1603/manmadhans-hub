import pg from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function resetUsers() {
  try {
    console.log('=== DATABASE USER RESET PROTOCOL INITIATED ===');
    
    // 1. Purge all other users except the main Owner email
    console.log('Purging all user accounts except Owner (hemanthmm1107@gmail.com)...');
    const deleteRes = await pool.query(
      "DELETE FROM users WHERE email != 'hemanthmm1107@gmail.com'"
    );
    console.log(`Successfully purged ${deleteRes.rowCount} accounts from the user directory.`);

    // 2. Upsert the Owner profile
    console.log('Ensuring Owner account is seeded...');
    const email = 'hemanthmm1107@gmail.com';
    const username = 'MM1107';
    const password = 'Welcome@123';
    const role = 'owner';
    
    const checkRes = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const hashedPass = await bcrypt.hash(password, 10);

    if (checkRes.rows.length > 0) {
      await pool.query(
        `UPDATE users 
         SET username = $1, passkey = $2, role = $3, must_change_password = true 
         WHERE email = $4`,
        [username, hashedPass, role, email]
      );
      console.log(`[UPDATE] Confirmed Owner credentials updated for: ${email}`);
    } else {
      await pool.query(
        `INSERT INTO users (email, username, passkey, role, must_change_password) 
         VALUES ($1, $2, $3, $4, true)`,
        [email, username, hashedPass, role]
      );
      console.log(`[INSERT] Created brand new Owner profile: ${email}`);
    }

    console.log(`   └─ MSG: Welcome Owner, ${username}! Deepmind Antigravity Core Synchronized. Owner Clearance Cleared.`);
    
    console.log('\n======================================================');
    console.log('USER DATABASE RESET TO EXCLUSIVE OWNER COMPLETED.');
    console.log('======================================================\n');
  } catch (err) {
    console.error('User reset protocol failed:', err);
  } finally {
    await pool.end();
  }
}

resetUsers();
