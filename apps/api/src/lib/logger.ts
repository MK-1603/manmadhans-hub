import { query } from './db.js';
import { io } from './socket.js';

// Setup tables automatically on import
async function ensureLogTablesExist() {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS security_logs (
        id SERIAL PRIMARY KEY,
        event TEXT NOT NULL,
        severity VARCHAR(50) NOT NULL,
        source TEXT NOT NULL,
        user_name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        admin_name VARCHAR(255) NOT NULL,
        action TEXT NOT NULL,
        target VARCHAR(255) NOT NULL,
        details TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS system_snapshots (
        id SERIAL PRIMARY KEY,
        backup_id VARCHAR(50) NOT NULL UNIQUE,
        type VARCHAR(50) DEFAULT 'Full System',
        size VARCHAR(50) DEFAULT '1.2 MB',
        status VARCHAR(50) DEFAULT 'Completed',
        payload JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Ensure payload column exists for database migration compatibility
    await query(`ALTER TABLE system_snapshots ADD COLUMN IF NOT EXISTS payload JSONB;`);



    console.log('Security, Audit, & Snapshot Tables verified (Strictly Real-time).');
  } catch (err) {
    console.error('Error ensuring Log Tables exist:', err);
  }
}

ensureLogTablesExist();

export const logSecurityEvent = async (
  event: string,
  severity: 'Low' | 'Medium' | 'High' | 'Critical',
  source: string,
  userName: string
) => {
  try {
    const res = await query(
      'INSERT INTO security_logs (event, severity, source, user_name) VALUES ($1, $2, $3, $4) RETURNING *',
      [event, severity, source, userName]
    );

    const logEntry = {
      id: `SEC-${res.rows[0].id}`,
      event: res.rows[0].event,
      severity: res.rows[0].severity,
      source: res.rows[0].source,
      time: 'Just now',
      user: res.rows[0].user_name,
    };

    if (io) {
      io.emit('security_log_update', logEntry);
    }
    return logEntry;
  } catch (err) {
    console.error('Failed to log security event:', err);
    return null;
  }
};

export const logAuditEvent = async (
  adminName: string,
  action: string,
  target: string,
  details: string
) => {
  try {
    const res = await query(
      'INSERT INTO audit_logs (admin_name, action, target, details) VALUES ($1, $2, $3, $4) RETURNING *',
      [adminName, action, target, details]
    );

    const logEntry = {
      id: `ADT-${res.rows[0].id}`,
      admin: res.rows[0].admin_name,
      action: res.rows[0].action,
      target: res.rows[0].target,
      time: 'Just now',
      details: res.rows[0].details,
    };

    if (io) {
      io.emit('audit_log_update', logEntry);
    }
    return logEntry;
  } catch (err) {
    console.error('Failed to log audit event:', err);
    return null;
  }
};
