import { Router } from 'express';
import webpush from 'web-push';
import { query } from '../lib/db.js';
import { authorize } from '../middleware/auth.js';

const router = Router();

// Configure VAPID
webpush.setVapidDetails(
  process.env.VAPID_EMAIL || 'mailto:admin@hub.local',
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

// In-memory fallback store if DB is unreachable
const memorySubscriptions: any[] = [];

// ── GET /vapid-public-key ────────────────────────────────
router.get('/vapid-public-key', (req, res) => {
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
});

// ── POST /subscribe ─────────────────────────────────────
router.post('/subscribe', async (req, res) => {
  const { subscription, username } = req.body;
  if (!subscription?.endpoint) {
    return res.status(400).json({ message: 'Invalid subscription object.' });
  }

  try {
    await query(
      `INSERT INTO push_subscriptions (username, endpoint, subscription_json)
       VALUES ($1, $2, $3)
       ON CONFLICT (endpoint) DO UPDATE SET subscription_json = $3, username = $1`,
      [username || 'anonymous', subscription.endpoint, JSON.stringify(subscription)]
    );
  } catch {
    // DB unreachable — use memory store as fallback
    const idx = memorySubscriptions.findIndex(s => s.endpoint === subscription.endpoint);
    if (idx >= 0) memorySubscriptions[idx] = { username, endpoint: subscription.endpoint, subscription };
    else memorySubscriptions.push({ username, endpoint: subscription.endpoint, subscription });
  }

  res.json({ success: true, message: 'Push subscription registered.' });
});

// ── DELETE /unsubscribe ──────────────────────────────────
router.delete('/unsubscribe', async (req, res) => {
  const { endpoint } = req.body;
  if (!endpoint) return res.status(400).json({ message: 'Endpoint required.' });

  try {
    await query('DELETE FROM push_subscriptions WHERE endpoint = $1', [endpoint]);
  } catch {
    const idx = memorySubscriptions.findIndex(s => s.endpoint === endpoint);
    if (idx >= 0) memorySubscriptions.splice(idx, 1);
  }

  res.json({ success: true });
});

// ── POST /send ─────────────────────────────────────────── (owner only)
router.post('/send', authorize(['owner']), async (req, res) => {
  const { title, body, url, username } = req.body;
  if (!title) return res.status(400).json({ message: 'title is required.' });

  const payload = JSON.stringify({ title, body: body || '', url: url || '/dashboard' });

  let subs: any[] = [];

  try {
    const q = username
      ? await query('SELECT subscription_json FROM push_subscriptions WHERE username = $1', [username])
      : await query('SELECT subscription_json FROM push_subscriptions');
    subs = q.rows.map(r => JSON.parse(r.subscription_json));
  } catch {
    subs = username
      ? memorySubscriptions.filter(s => s.username === username).map(s => s.subscription)
      : memorySubscriptions.map(s => s.subscription);
  }

  let sent = 0, failed = 0;
  await Promise.all(subs.map(async (sub) => {
    try {
      await webpush.sendNotification(sub, payload);
      sent++;
    } catch (err: any) {
      failed++;
      // 410 = subscription expired/invalid
      if (err?.statusCode === 410) {
        try { await query('DELETE FROM push_subscriptions WHERE endpoint = $1', [sub.endpoint]); } catch {}
      }
    }
  }));

  res.json({ success: true, sent, failed });
});

// ── Exported helper to send push from anywhere in the API ──
export const sendPushToAll = async (title: string, body: string, url = '/dashboard') => {
  const payload = JSON.stringify({ title, body, url });
  let subs: any[] = [];

  try {
    const q = await query('SELECT subscription_json FROM push_subscriptions');
    subs = q.rows.map(r => JSON.parse(r.subscription_json));
  } catch {
    subs = memorySubscriptions.map(s => s.subscription);
  }

  await Promise.allSettled(subs.map(sub => webpush.sendNotification(sub, payload)));
};

export const sendPushToUser = async (username: string, title: string, body: string, url = '/dashboard') => {
  const payload = JSON.stringify({ title, body, url });
  let subs: any[] = [];

  try {
    const q = await query('SELECT subscription_json FROM push_subscriptions WHERE username = $1', [username]);
    subs = q.rows.map(r => JSON.parse(r.subscription_json));
  } catch {
    subs = memorySubscriptions.filter(s => s.username === username).map(s => s.subscription);
  }

  await Promise.allSettled(subs.map(sub => webpush.sendNotification(sub, payload)));
};

export default router;
