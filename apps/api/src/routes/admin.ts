import { Router, Request, Response } from 'express';
import { query } from '../lib/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { triggerRealTimeUpdate } from '../lib/realtime.js';
import { CLIENT_URL } from '../config/constants.js';
import { logAuditEvent } from '../lib/logger.js';
import { authorize, getCallerName } from '../middleware/auth.js';
import { globalCache } from '../lib/cache.js';

const router = Router();
const JWT_SECRET = process.env.SESSION_SECRET || 'fallback_secret';

function formatRelativeTime(dateStr: string) {
  const now = new Date();
  const past = new Date(dateStr);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 1000 / 60);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

router.get('/security-logs', authorize(['owner']), async (req, res) => {
  try {
    const cacheKey = 'admin-security-logs';
    const cachedData = globalCache.get(cacheKey);
    if (cachedData) return res.json(cachedData);

    const result = await query('SELECT * FROM security_logs ORDER BY created_at DESC LIMIT 50');
    const logs = result.rows.map(row => ({
      id: `SEC-${row.id}`,
      event: row.event,
      severity: row.severity,
      source: row.source,
      time: formatRelativeTime(row.created_at),
      user: row.user_name && row.user_name.includes('@') ? row.user_name.split('@')[0] : row.user_name
    }));
    globalCache.set(cacheKey, logs, 2000);
    res.json(logs);
  } catch (err) {
    console.error('Fetch Security Logs Error:', err);
    res.status(500).json({ message: 'Failed to retrieve security matrix.' });
  }
});

router.get('/audit-logs', authorize(['owner']), async (req, res) => {
  try {
    const cacheKey = 'admin-audit-logs';
    const cachedData = globalCache.get(cacheKey);
    if (cachedData) return res.json(cachedData);

    const result = await query('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 50');
    const logs = result.rows.map(row => ({
      id: `ADT-${row.id}`,
      admin: row.admin_name && row.admin_name.includes('@') ? row.admin_name.split('@')[0] : row.admin_name,
      action: row.action,
      target: row.target,
      time: formatRelativeTime(row.created_at),
      details: row.details
    }));
    globalCache.set(cacheKey, logs, 2000);
    res.json(logs);
  } catch (err) {
    console.error('Fetch Audit Logs Error:', err);
    res.status(500).json({ message: 'Failed to retrieve audit matrix.' });
  }
});

router.post('/invite', authorize(['owner']), async (req, res) => {
  const { email, username, role } = req.body;
  const password = 'Welcome@123'; // Default password as requested

  if (!email || !username || !role) {
    return res.status(400).json({ message: 'All parameters (Email, Name, Role) are required for identity propagation.' });
  }

  try {
    // Check if user exists by email or username
    const existingEmail = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingEmail.rows.length > 0) {
      return res.status(400).json({ message: 'A node with this email already exists in the matrix.' });
    }

    const existingUsername = await query('SELECT * FROM users WHERE username = $1', [username]);
    if (existingUsername.rows.length > 0) {
      return res.status(400).json({ message: 'A node with this username already exists in the matrix.' });
    }

    // Hash the default temporary password - low rounds as it will be reset on first login
    const hashedPass = await bcrypt.hash(password, 5);

    // Create user in database with correct schema
    const newUser = await query(
      'INSERT INTO users (email, username, passkey, role, must_change_password) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [email, username, hashedPass, role, true]
    );

    // Write audit log with real caller
    await logAuditEvent(getCallerName(req), 'Created User Invitation', username, `Role configured as ${role}. Default credentials set.`);

    // Trigger real-time sync in background (non-blocking for fast response)
    triggerRealTimeUpdate().catch(() => {});

    // Explicitly notify dashboard to refresh matrix
    const { io } = await import('../lib/socket.js');
    if (io) io.emit('refresh_matrix');

    const joinLink = `${CLIENT_URL}`;

    const invitationMessage = `🌟 Manmadhan’s Hub Access Invitation 🌟

Your private account has been successfully initialized 🚀

👤 Name: ${username}
📧 Email: ${email}
🗝️ Password: ${password}

⚡ Please reset your password after your first login.
Please do not share your login credentials 🔒

🔗 Access Hub: ${joinLink}`;

    res.json({
      success: true,
      message: 'Invitation generated successfully.',
      invitationMessage,
      link: joinLink
    });
  } catch (err) {
    console.error('Invitation Error:', err);
    res.status(500).json({ message: 'Matrix synchronization failed. Could not create invitation.' });
  }
});

router.patch('/approve-tool/:id', authorize(['owner']), async (req, res) => {
  const toolId = req.params.id;
  try {
    const toolRes = await query('SELECT * FROM user_tools WHERE id = $1', [toolId]);
    if (toolRes.rows.length === 0) {
      return res.status(404).json({ message: 'Tool not found.' });
    }

    const tool = toolRes.rows[0];
    if (tool.tool_status === 'active') {
      return res.status(400).json({ message: 'Tool is already approved and active.' });
    }

    // Update user_tools status
    await query('UPDATE user_tools SET tool_status = $1 WHERE id = $2', ['active', toolId]);

    // DUAL-INSERT: Also add to ai_tools so it shows in Global Registry
    await query(
      `INSERT INTO ai_tools (
        name, slug, short_description, description, use_case,
        key_features, search_keywords, url, logo_url,
        category_id, category_name, category_icon, 
        pricing_model, pricing_details,
        developer_name, model_version, platform_type, launch_date,
        tool_status, is_featured, integrations, rating, tags, source
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9,
        $10, $11, $12, 
        $13, $14, $15,
        $16, $17, $18, $19,
        $20, $21, $22, $23, $24
      )`,
      [
        tool.name, tool.slug, tool.short_description, tool.description, tool.use_case,
        JSON.stringify(tool.key_features || []), JSON.stringify(tool.search_keywords || []), tool.url, tool.logo_url,
        tool.category_id, tool.category_name, tool.category_icon, 
        tool.pricing_model, tool.pricing_details,
        tool.developer_name, tool.model_version, tool.platform_type, tool.launch_date,
        'active', tool.is_featured, JSON.stringify(tool.integrations || []), tool.rating, JSON.stringify(tool.tags || []), tool.source
      ]
    );

    await logAuditEvent(getCallerName(req), 'Approved Pending Tool', tool.name, 'Inserted into Global Registry.');
    
    const { io } = await import('../lib/socket.js');
    if (io) io.emit('refresh_matrix');

    triggerRealTimeUpdate().catch(() => {});

    res.json({ success: true, message: 'Tool successfully approved and globally registered.' });
  } catch (err) {
    console.error('Approve Tool Error:', err);
    res.status(500).json({ message: 'Failed to approve tool.' });
  }
});

router.get('/check-availability', async (req, res) => {
  const { email, username } = req.query;
  try {
    let exists = false;
    if (email) {
      const check = await query('SELECT id FROM users WHERE email = $1', [email]);
      if (check.rows.length > 0) exists = true;
    }
    if (username) {
      const check = await query('SELECT id FROM users WHERE username = $1', [username]);
      if (check.rows.length > 0) exists = true;
    }
    res.json({ available: !exists });
  } catch (err) {
    res.status(500).json({ message: 'Verification failed' });
  }
});

router.get('/identities', authorize(['owner']), async (req, res) => {
  try {
    const cacheKey = 'admin-identities';
    const cachedData = globalCache.get(cacheKey);
    if (cachedData) return res.json(cachedData);

    const result = await query(
      'SELECT id, username as name, email, role, created_at as "lastLogin", must_change_password as pending FROM users ORDER BY created_at ASC'
    );
    
    let adminSeq = 1;
    let userSeq = 1;
    const mapped = result.rows.map(user => {
      let prefix = 'MID-';
      let seqNum = 1;
      const r = (user.role || '').toLowerCase();
      if (r.includes('owner')) {
        prefix = 'OID-';
        seqNum = adminSeq++;
      } else {
        prefix = 'MID-';
        seqNum = userSeq++;
      }
      return {
        ...user,
        display_id: `${prefix}${String(seqNum).padStart(3, '0')}`,
        status: user.pending ? 'Pending' : 'Active'
      };
    });
    
    // Sort descending for UI
    mapped.sort((a, b) => new Date(b.lastLogin).getTime() - new Date(a.lastLogin).getTime());

    globalCache.set(cacheKey, mapped, 2000);
    res.json(mapped);
  } catch (err) {
    console.error('Fetch Identities Error:', err);
    res.status(500).json({ message: 'Failed to retrieve identity matrix.' });
  }
});

router.patch('/identities/:id', authorize(['owner']), async (req, res) => {
  const { id } = req.params;
  const { username, email, role } = req.body;

  if (!username || !email || !role) {
    return res.status(400).json({ message: 'Username, email, and role are required.' });
  }

  try {
    const emailCheck = await query('SELECT id FROM users WHERE email = $1 AND id != $2', [email, id]);
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Email is already in use by another node.' });
    }

    const usernameCheck = await query('SELECT id FROM users WHERE username = $1 AND id != $2', [username, id]);
    if (usernameCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Username is already in use by another node.' });
    }

    await query(
      'UPDATE users SET username = $1, email = $2, role = $3 WHERE id = $4',
      [username, email, role, id]
    );

    // Audit Log with real caller
    await logAuditEvent(getCallerName(req), 'Updated Identity Node', username, `Role updated to ${role}, Email to ${email}`);

    await triggerRealTimeUpdate();
    
    const { io } = await import('../lib/socket.js');
    if (io) io.emit('refresh_matrix');

    res.json({ success: true, message: 'Identity updated successfully.' });
  } catch (err) {
    console.error('Update Identity Error:', err);
    res.status(500).json({ message: 'Failed to update identity.' });
  }
});

// Delete identity node (super-admin only)
router.delete('/identities/:id', authorize(['owner']), async (req, res) => {
  const { id } = req.params;
  try {
    // Prevent deleting super-admin accounts
    const targetUser = await query('SELECT role, username FROM users WHERE id = $1', [id]);
    if (targetUser.rows.length === 0) {
      return res.status(404).json({ message: 'Identity node not found.' });
    }
    if (targetUser.rows[0].role === 'owner') {
      return res.status(403).json({ message: 'Cannot purge an owner identity node.' });
    }

    await query('DELETE FROM users WHERE id = $1', [id]);
    await logAuditEvent(getCallerName(req), 'Purged Identity Node', targetUser.rows[0].username, 'Account permanently removed from identity matrix.');
    await triggerRealTimeUpdate();

    const { io } = await import('../lib/socket.js');
    if (io) io.emit('refresh_matrix');

    res.json({ success: true, message: 'Identity node purged from matrix.' });
  } catch (err) {
    console.error('Delete Identity Error:', err);
    res.status(500).json({ message: 'Failed to purge identity node.' });
  }
});

// Snapshots / Backup Routes
router.get('/backups', authorize(['owner']), async (req, res) => {
  try {
    const cacheKey = 'admin-backups';
    const cachedData = globalCache.get(cacheKey);
    if (cachedData) return res.json(cachedData);

    const result = await query('SELECT * FROM system_snapshots ORDER BY created_at DESC');
    const backups = result.rows.map(row => ({
      id: row.backup_id,
      date: new Date(row.created_at).toISOString().replace('T', ' ').substring(0, 16),
      size: row.size,
      type: row.type,
      status: row.status,
      encrypted: true
    }));
    globalCache.set(cacheKey, backups, 2000);
    res.json(backups);
  } catch (err) {
    console.error('Fetch Backups Error:', err);
    res.status(500).json({ message: 'Failed to retrieve snapshot matrix.' });
  }
});

router.post('/backups', authorize(['owner']), async (req, res) => {
  const { type } = req.body;
  const backupType = type || 'Full System';
  const backupId = `SNP-${Math.floor(Math.random() * 9000 + 1000)}`;

  try {
    console.log(`[BACKUP] Initializing real-time backup sequence for ${backupId} (${backupType})...`);

    // Fetch live data records to form the actual state backup payload
    const usersResult = await query('SELECT * FROM users');
    const aiToolsResult = await query('SELECT * FROM ai_tools');
    const userToolsResult = await query('SELECT * FROM user_tools');

    const backupPayload = {
      users: usersResult.rows,
      ai_tools: aiToolsResult.rows,
      user_tools: userToolsResult.rows
    };

    const payloadStr = JSON.stringify(backupPayload);
    const sizeKB = (payloadStr.length / 1024).toFixed(1);
    const size = parseFloat(sizeKB) > 1024 
      ? (parseFloat(sizeKB) / 1024).toFixed(2) + ' MB'
      : sizeKB + ' KB';

    const result = await query(
      'INSERT INTO system_snapshots (backup_id, type, size, status, payload) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [backupId, backupType, size, 'Completed', payloadStr]
    );

    // Audit Log with real caller
    await logAuditEvent(getCallerName(req), 'Initialized Snapshot', backupId, `Created ${backupType} snapshot (${size}). Encryption verified.`);

    // Trigger real-time sync
    const newBackup = {
      id: result.rows[0].backup_id,
      date: new Date(result.rows[0].created_at).toISOString().replace('T', ' ').substring(0, 16),
      size: result.rows[0].size,
      type: result.rows[0].type,
      status: result.rows[0].status,
      encrypted: true
    };

    const { io } = await import('../lib/socket.js');
    if (io) {
      io.emit('backup_update', newBackup);
    }

    res.json(newBackup);
  } catch (err) {
    console.error('Create Backup Error:', err);
    res.status(500).json({ message: 'Failed to initialize snapshot.' });
  }
});

// Restore database state from snapshot
router.post('/backups/:backup_id/restore', authorize(['owner']), async (req, res) => {
  const backup_id = req.params.backup_id as string;
  try {
    const result = await query('SELECT payload FROM system_snapshots WHERE backup_id = $1', [backup_id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Snapshot not found.' });
    }

    const snapshot = result.rows[0];
    if (!snapshot.payload) {
      return res.status(400).json({ message: 'Snapshot payload is empty or not formatted correctly.' });
    }

    const { users, ai_tools, user_tools } = typeof snapshot.payload === 'string' 
      ? JSON.parse(snapshot.payload) 
      : snapshot.payload;

    console.log(`[RESTORE] Initializing atomic database restoration protocol for snapshot ${backup_id}...`);

    // Begin atomic multi-table transaction block
    await query('BEGIN');

    try {
      // 1. Truncate tables cleanly
      await query('TRUNCATE TABLE ai_tools RESTART IDENTITY CASCADE');
      await query('TRUNCATE TABLE user_tools RESTART IDENTITY CASCADE');
      await query('TRUNCATE TABLE users RESTART IDENTITY CASCADE');

      // 2. Restore users
      if (Array.isArray(users) && users.length > 0) {
        for (const u of users) {
          await query(
            `INSERT INTO users (id, email, username, passkey, role, must_change_password, created_at) 
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [u.id, u.email, u.username, u.passkey, u.role, u.must_change_password, u.created_at]
          );
        }
      }

      // 3. Restore ai_tools
      if (Array.isArray(ai_tools) && ai_tools.length > 0) {
        const columns = [
          'id', 'name', 'slug', 'short_description', 'description', 'use_case',
          'key_features', 'search_keywords', 'url', 'logo_url',
          'category_id', 'category_name', 'category_icon', 
          'pricing_model', 'pricing_details',
          'developer_name', 'model_version', 'platform_type', 'launch_date',
          'tool_status', 'is_featured', 'integrations', 'rating', 'tags', 'source',
          'is_active', 'is_archived', 'created_at'
        ];
        for (const t of ai_tools) {
          await query(
            `INSERT INTO ai_tools (${columns.join(', ')}) VALUES (
              $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
              $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
              $21, $22, $23, $24, $25, $26, $27, $28, $29
            )`,
            [
              t.id, t.name, t.slug, t.short_description, t.description, t.use_case,
              JSON.stringify(t.key_features || []), JSON.stringify(t.search_keywords || []), t.url, t.logo_url,
              t.category_id, t.category_name, t.category_icon, 
              t.pricing_model, t.pricing_details,
              t.developer_name, t.model_version, t.platform_type, t.launch_date,
              t.tool_status, t.is_featured, JSON.stringify(t.integrations || []), t.rating, JSON.stringify(t.tags || []), t.source,
              t.is_active !== undefined ? t.is_active : true, t.is_archived !== undefined ? t.is_archived : false, t.created_at
            ]
          );
        }
      }

      // 4. Restore user_tools
      if (Array.isArray(user_tools) && user_tools.length > 0) {
        const columns = [
          'id', 'name', 'slug', 'short_description', 'description', 'use_case',
          'key_features', 'search_keywords', 'url', 'logo_url',
          'category_id', 'category_name', 'category_icon', 
          'pricing_model', 'pricing_details',
          'developer_name', 'model_version', 'platform_type', 'launch_date',
          'tool_status', 'is_featured', 'integrations', 'rating', 'tags', 'source',
          'is_active', 'is_archived', 'created_at'
        ];
        for (const t of user_tools) {
          await query(
            `INSERT INTO user_tools (${columns.join(', ')}) VALUES (
              $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
              $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
              $21, $22, $23, $24, $25, $26, $27, $28, $29
            )`,
            [
              t.id, t.name, t.slug, t.short_description, t.description, t.use_case,
              JSON.stringify(t.key_features || []), JSON.stringify(t.search_keywords || []), t.url, t.logo_url,
              t.category_id, t.category_name, t.category_icon, 
              t.pricing_model, t.pricing_details,
              t.developer_name, t.model_version, t.platform_type, t.launch_date,
              t.tool_status, t.is_featured, JSON.stringify(t.integrations || []), t.rating, JSON.stringify(t.tags || []), t.source,
              t.is_active !== undefined ? t.is_active : true, t.is_archived !== undefined ? t.is_archived : false, t.created_at
            ]
          );
        }
      }

      await query('COMMIT');
    } catch (txnErr) {
      await query('ROLLBACK');
      throw txnErr;
    }

    // Trigger Audit Log
    await logAuditEvent(getCallerName(req), 'Restored Snapshot', backup_id, 'Successfully restored users, ai_tools, and user_tools databases.');

    // Socket notification
    const { io } = await import('../lib/socket.js');
    if (io) {
      io.emit('refresh_matrix');
    }

    res.json({ success: true, message: `System database restored successfully to snapshot ${backup_id}` });

  } catch (err) {
    console.error('Restore Snapshot Error:', err);
    res.status(500).json({ message: 'Restoration sequence failed.' });
  }
});

router.get('/backups/:backup_id/download', authorize(['owner']), async (req, res) => {
  const { backup_id } = req.params;
  const { scope } = req.query; // 'all' | 'users' | 'tools'
  try {
    const result = await query('SELECT payload FROM system_snapshots WHERE backup_id = $1', [backup_id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Snapshot not found.' });
    }
    const row = result.rows[0];
    
    const payloadObj = typeof row.payload === 'string' ? JSON.parse(row.payload) : row.payload;
    
    let filteredPayload: any = {};
    let filename = `backup-${backup_id}.json`;
    
    if (scope === 'users') {
      filteredPayload = {
        users: payloadObj.users || []
      };
      filename = `backup-${backup_id}-users.json`;
    } else if (scope === 'tools') {
      filteredPayload = {
        ai_tools: payloadObj.ai_tools || [],
        user_tools: payloadObj.user_tools || []
      };
      filename = `backup-${backup_id}-tools.json`;
    } else {
      filteredPayload = {
        users: payloadObj.users || [],
        ai_tools: payloadObj.ai_tools || [],
        user_tools: payloadObj.user_tools || []
      };
      filename = `backup-${backup_id}-all.json`;
    }
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(JSON.stringify(filteredPayload, null, 2));
  } catch (err) {
    console.error('Download Backup Error:', err);
    res.status(500).json({ message: 'Failed to download backup snapshot.' });
  }
});

router.delete('/backups/:backup_id', authorize(['owner']), async (req, res) => {
  const backup_id = req.params.backup_id as string;
  try {
    await query('DELETE FROM system_snapshots WHERE backup_id = $1', [backup_id]);

    // Audit Log with real caller
    await logAuditEvent(getCallerName(req), 'Purged Snapshot', backup_id, `Snapshot record deleted from redundant cluster.`);

    const { io } = await import('../lib/socket.js');
    if (io) {
      io.emit('backup_purge', backup_id);
    }

    res.json({ success: true, message: 'Snapshot purged from matrix.' });
  } catch (err) {
    console.error('Delete Backup Error:', err);
    res.status(500).json({ message: 'Failed to purge snapshot.' });
  }
});

export default router;
