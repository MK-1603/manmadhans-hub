import { query } from './src/lib/db.js';

async function migrate() {
  try {
    console.log('Migrating users to owner/member...');
    await query("UPDATE users SET role = 'owner' WHERE role IN ('super-admin', 'admin', 'Owner', 'Admin', 'Super-Admin')");
    await query("UPDATE users SET role = 'member' WHERE role IN ('user', 'Member', 'User')");
    console.log('Migration successful.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
migrate();
