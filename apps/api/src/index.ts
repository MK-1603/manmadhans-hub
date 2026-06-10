import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env'), override: true });
import { createServer } from 'http';
import os from 'os';
import cluster from 'cluster';
import { setupMaster, setupWorker } from '@socket.io/sticky';
import { createAdapter, setupPrimary } from '@socket.io/cluster-adapter';

import app from './app.js';
import pool, { query } from './lib/db.js';
import { PORT, VERSION, ENV } from './config/constants.js';
import { initSocket } from './lib/socket.js';
import { 
  fetchRealStats, 
  fetchActivities, 
  triggerRealTimeUpdate,
  fetchSystemTelemetry,
  fetchAnalyticsStats
} from './lib/realtime.js';
import { logSecurityEvent, logAuditEvent } from './lib/logger.js';
import { sendPushToAll } from './routes/push.js';

// --- Global Logger ---
const logger = {
  info: (msg: string) => console.log(`\x1b[94m[i]\x1b[0m ${msg}`),
  success: (msg: string) => console.log(`\x1b[92m[✓]\x1b[0m ${msg}`),
  warn: (msg: string) => console.warn(`\x1b[93m[!]\x1b[0m ${msg}`),
  error: (msg: string) => console.error(`\x1b[91m[x]\x1b[0m ${msg}`),
  socket: (msg: string) => console.log(`\x1b[95m[⚡]\x1b[0m ${msg}`),
};

const boxWidth = 88;
const line = '━'.repeat(boxWidth + 2);
const printLine = (content: string) => {
  const realLength = content.replace(/\x1b\[[0-9;]*m/g, '').length;
  const padding = ' '.repeat(Math.max(0, boxWidth - realLength));
  console.log(`\x1b[90m   ┃\x1b[0m ${content}${padding} \x1b[90m┃\x1b[0m`);
};

if (cluster.isPrimary) {
  // Clear console on primary only
  process.stdout.write('\x1Bc');
  console.log(`\x1b[96m
   ███╗   ███╗ █████╗ ███╗   ██╗███╗   ███╗ █████╗ ██████╗ ██╗  ██╗ █████╗ ███╗   ██╗
   ████╗ ████║██╔══██╗████╗  ██║████╗ ████║██╔══██╗██╔══██╗██║  ██║██╔══██╗████╗  ██║
   ██╔████╔██║███████║██╔██╗ ██║██╔████╔██║███████║██║  ██║███████║███████║██╔██╗ ██║
   ██║╚██╔╝██║██╔══██║██║╚██╗██║██║╚██╔╝██║██╔══██║██║  ██║██╔══██║██╔══██║██║╚██╗██║
   ██║ ╚═╝ ██║██║  ██║██║ ╚████║██║ ╚═╝ ██║██║  ██║██████╔╝██║  ██║██║  ██║██║ ╚████║
   ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝     ╚═╝╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝
\x1b[0m`);

  const mem = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
  const cpus = os.cpus();
  const cpu = cpus.length > 0 ? cpus[0].model.substring(0, 45) : 'Unknown CPU';
  const numCPUs = ENV === 'production' ? cpus.length : 1;
  const localIp =
    Object.values(os.networkInterfaces())
      .flat()
      .find((i) => i?.family === 'IPv4' && !i.internal)?.address || 'localhost';

  let apiEndpoint = `http://${localIp}:${PORT}/api/${VERSION}`;
  let wsEndpoint = `ws://${localIp}:${PORT}`;

  if (process.env.API_URL) {
    const cleanUrl = process.env.API_URL.replace(/\/$/, '');
    apiEndpoint = `${cleanUrl}/api/${VERSION}`;
    wsEndpoint = cleanUrl.replace(/^http/, 'ws');
  }

  console.log(`\x1b[90m   ┏${line}┓\x1b[0m`);
  printLine(
    `\x1b[1mSTATUS:\x1b[0m \x1b[92mREADY (CLUSTERED)\x1b[0m │ \x1b[1mVERSION:\x1b[0m \x1b[94m${VERSION}\x1b[0m  │ \x1b[1mNODE:\x1b[0m \x1b[95m${process.version}\x1b[0m  │ \x1b[1mMODE:\x1b[0m \x1b[95m${ENV.toUpperCase()}\x1b[0m`
  );
  console.log(`\x1b[90m   ┣${line}┫\x1b[0m`);
  printLine(
    `\x1b[1mTELEMETRY:\x1b[0m \x1b[37mRAM: ${mem} MB | CPU: ${cpu} | WORKERS: ${numCPUs}\x1b[0m`
  );
  console.log(`\x1b[90m   ┣${line}┫\x1b[0m`);
  printLine(
    `\x1b[1mENDPOINTS:\x1b[0m \x1b[34mAPI: ${apiEndpoint}\x1b[0m`
  );
  printLine(`           \x1b[34mWS : ${wsEndpoint}\x1b[0m`);
  console.log(`\x1b[90m   ┗${line}┛\x1b[0m\n`);

  const httpServer = createServer();
  
  setupMaster(httpServer, {
    loadBalancingMethod: 'round-robin',
  });
  
  setupPrimary();

  httpServer.listen(Number(PORT), '0.0.0.0', () => {
    logger.success(`API Gateway Master [${process.pid}] is fully operational on port ${PORT}`);
  });

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    logger.warn(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });

  const shutdown = async () => {
    logger.warn('System shutdown initiated...');
    httpServer.close();
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

} else {
  // ================= WORKER PROCESS =================

  interface ActiveSession {
    id: string;
    node: string;
    browser: string;
    ip: string;
    location: string;
    user: string;
    active: boolean;
  }
  const activeSessions = new Map<string, ActiveSession>();

  const httpServer = createServer(app);

  const originEnv = process.env.CORS_ORIGIN || '*';
  const allowedOrigins = originEnv === '*'
    ? '*'
    : (originEnv.includes(',')
        ? originEnv.split(',').flatMap(o => [o.trim(), o.trim().replace(/\/$/, '')])
        : [originEnv.trim(), originEnv.trim().replace(/\/$/, '')]);

  const io = initSocket(httpServer, allowedOrigins);
  io.adapter(createAdapter());
  setupWorker(io);

  const broadcastSessionsUpdate = (user: string) => {
    const userSessions = Array.from(activeSessions.values()).filter(s => s.user === user);
    userSessions.forEach(s => {
      io.to(s.id).emit('sessions_update', userSessions);
    });
  };

  const broadcastAllSessionsUpdate = () => {
    io.emit('all_sessions_update', Array.from(activeSessions.values()));
  };

  // Setup inter-worker communication for sessions
  io.serverSideEmit = (io as any).serverSideEmit || function() {}; // Fallback for types
  
  io.on('add_session_sync', (session: ActiveSession) => {
    activeSessions.set(session.id, session);
    broadcastSessionsUpdate(session.user);
    broadcastAllSessionsUpdate();
  });

  io.on('remove_session_sync', (data: { id: string, user: string }) => {
    activeSessions.delete(data.id);
    broadcastSessionsUpdate(data.user);
    broadcastAllSessionsUpdate();
  });

  io.on('force_logout_sync', (data: { targetSocketId: string }) => {
    const targetSocket = io.sockets.sockets.get(data.targetSocketId);
    if (targetSocket) {
      targetSocket.emit('force_logout');
      targetSocket.disconnect(true);
    }
  });

  io.on('connection', async (socket) => {
    logger.socket(`[Worker ${process.pid}] Client connected: \x1b[90m${socket.id}\x1b[0m`);

    const stats = await fetchRealStats();
    if (stats) socket.emit('stats_update', stats);

    const activities = await fetchActivities();
    activities.forEach(activity => socket.emit('activity_update', activity));

    const telemetry = await fetchSystemTelemetry();
    if (telemetry) socket.emit('system_telemetry', telemetry);

    const analytics = await fetchAnalyticsStats();
    if (analytics) socket.emit('analytics_update', analytics);

    socket.on('request_stats', async () => {
      const freshStats = await fetchRealStats();
      if (freshStats) socket.emit('stats_update', freshStats);
    });

    socket.on('request_all_sessions', () => {
      socket.emit('all_sessions_update', Array.from(activeSessions.values()));
    });

    socket.on('request_my_sessions', (user: string) => {
      const userSessions = Array.from(activeSessions.values()).filter(s => s.user === user);
      socket.emit('sessions_update', userSessions);
    });

    socket.on('request_activities', async () => {
      const freshActivities = await fetchActivities();
      freshActivities.forEach(activity => socket.emit('activity_update', activity));
    });

    socket.on('request_telemetry', async () => {
      const freshTelemetry = await fetchSystemTelemetry();
      if (freshTelemetry) socket.emit('system_telemetry', freshTelemetry);
    });

    socket.on('request_analytics', async () => {
      const freshAnalytics = await fetchAnalyticsStats();
      if (freshAnalytics) socket.emit('analytics_update', freshAnalytics);
    });

    socket.on('client_security_alert', async (data: { event: string; severity: 'Low' | 'Medium' | 'High' | 'Critical'; source: string; user: string }) => {
      logger.socket(`Client security alert received: ${data.event} by ${data.user}`);
      await logSecurityEvent(data.event, data.severity, data.source, data.user);
    });

    socket.on('client_audit_log', async (data: { action: string; target: string; details: string; user: string }) => {
      logger.socket(`Client audit log received: ${data.action} on ${data.target} by ${data.user}`);
      await logAuditEvent(data.user, data.action, data.target, data.details);
    });

    socket.on('register_session', (data: { user: string; browser: string; ip: string; location: string }) => {
      const newSession: ActiveSession = {
        id: socket.id,
        node: `MM-WORKER-${process.pid}`,
        browser: data.browser,
        ip: data.ip,
        location: data.location,
        user: data.user,
        active: true
      };
      activeSessions.set(socket.id, newSession);
      (io as any).serverSideEmit('add_session_sync', newSession);
      broadcastSessionsUpdate(data.user);
      broadcastAllSessionsUpdate();
    });

    socket.on('revoke_session', (targetSocketId: string) => {
      const session = activeSessions.get(targetSocketId);
      if (session) {
        const targetSocket = io.sockets.sockets.get(targetSocketId);
        if (targetSocket) {
          targetSocket.emit('force_logout');
          targetSocket.disconnect(true);
        } else {
          (io as any).serverSideEmit('force_logout_sync', { targetSocketId });
        }
        
        activeSessions.delete(targetSocketId);
        (io as any).serverSideEmit('remove_session_sync', { id: targetSocketId, user: session.user });
        broadcastSessionsUpdate(session.user);
        broadcastAllSessionsUpdate();
      }
    });

    socket.on('password_changed', () => {
      const currentSession = activeSessions.get(socket.id);
      if (currentSession) {
        const otherSessions = Array.from(activeSessions.values()).filter(
          s => s.user === currentSession.user && s.id !== socket.id
        );
        
        otherSessions.forEach(s => {
          const ts = io.sockets.sockets.get(s.id);
          if (ts) {
            ts.emit('force_logout');
            ts.disconnect(true);
          } else {
            (io as any).serverSideEmit('force_logout_sync', { targetSocketId: s.id });
          }
          activeSessions.delete(s.id);
          (io as any).serverSideEmit('remove_session_sync', { id: s.id, user: currentSession.user });
        });
        
        broadcastSessionsUpdate(currentSession.user);
      }
    });

    socket.on('client_trigger_notification', (data: { title: string; desc: string; type: string; roles: string[] }) => {
      io.emit('notification', {
        title: data.title,
        desc: data.desc,
        type: data.type,
        roles: data.roles
      });
      // Also send real push to offline users
      sendPushToAll(data.title, data.desc || '', '/dashboard').catch(() => {});
    });

    socket.on('join_compare_room', (roomName: string) => {
      const targetRoom = roomName || 'global_compare';
      socket.join(targetRoom);
    });

    socket.on('leave_compare_room', (roomName: string) => {
      const targetRoom = roomName || 'global_compare';
      socket.leave(targetRoom);
    });

    socket.on('compare_slot_changed', (data: { roomName: string; slotIndex: number; tool: any }) => {
      const targetRoom = data.roomName || 'global_compare';
      socket.to(targetRoom).emit('compare_slot_changed', {
        slotIndex: data.slotIndex,
        tool: data.tool,
        sender: socket.id
      });
    });

    socket.on('compare_verdict_triggered', (data: { roomName: string }) => {
      const targetRoom = data.roomName || 'global_compare';
      socket.to(targetRoom).emit('compare_verdict_triggered');
    });

    socket.on('compare_verdict_completed', (data: { roomName: string; verdictHTML: string }) => {
      const targetRoom = data.roomName || 'global_compare';
      socket.to(targetRoom).emit('compare_verdict_completed', { verdictHTML: data.verdictHTML });
    });

    socket.on('ping_heartbeat', (ack) => {
      if (typeof ack === 'function') ack();
    });

    socket.on('disconnect', () => {
      const session = activeSessions.get(socket.id);
      if (session) {
        activeSessions.delete(socket.id);
        (io as any).serverSideEmit('remove_session_sync', { id: socket.id, user: session.user });
        broadcastSessionsUpdate(session.user);
        broadcastAllSessionsUpdate();
      }
    });
  });

  const startStatsEmitter = () => {
    const emitUpdates = async () => {
      await triggerRealTimeUpdate();
      setTimeout(emitUpdates, 12000);
    };
    emitUpdates();
  };

  const shutdown = async () => {
    logger.warn(`Worker ${process.pid} shutting down...`);
    io.close();
    if (pool && (pool as any).end) await (pool as any).end();
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  async function workerMain() {
    try {
      await query('SELECT 1');
      logger.success(`[Worker ${process.pid}] Database Link: \x1b[32mESTABLISHED\x1b[0m`);
      
      if (cluster.worker && cluster.worker.id === 1) {
        startStatsEmitter();
      }
    } catch (err) {
      logger.error(`[Worker ${process.pid}] System bootstrap failed.`);
      console.error(err);
      process.exit(1);
    }
  }

  workerMain();
}

export default app;
// Trigger restart
