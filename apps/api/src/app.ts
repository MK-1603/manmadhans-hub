import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { VERSION, CLIENT_URL } from './config/constants.js';
import { query } from './lib/db.js';
import passport from './config/passport.js';

const app: Application = express();
app.set('trust proxy', 1);
// --- CORS Configuration ---
const originEnv = process.env.CORS_ORIGIN || '*';
const allowedOrigins = originEnv === '*'
  ? '*'
  : (originEnv.includes(',')
      ? originEnv.split(',').flatMap(o => [o.trim(), o.trim().replace(/\/$/, '')])
      : [originEnv.trim(), originEnv.trim().replace(/\/$/, '')]);

const corsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middleware
app.use(cors(corsOptions));
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false,
  crossOriginOpenerPolicy: false
}));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Request Pipeline Logger (Custom)
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const method = `\x1b[1m${req.method.padEnd(7)}\x1b[0m`;
    const status =
      res.statusCode >= 400
        ? `\x1b[91m${res.statusCode}\x1b[0m`
        : `\x1b[92m${res.statusCode}\x1b[0m`;
    console.log(
      `\x1b[90m${new Date().toLocaleTimeString()}\x1b[0m | ${method} | ${status} | \x1b[37m${req.url}\x1b[0m | \x1b[90m${duration}ms\x1b[0m`
    );
  });
  next();
});

// --- Root Health Check ---
app.all('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'operational',
    service: "Manmadhan's Hub API",
  });
});

// --- Health Check Routes ---
app.get(`/api/${VERSION}`, (req: Request, res: Response) => {
  res.json({
    message: "Welcome to Manmadhan's Hub API",
    version: VERSION,
    status: 'operational',
  });
});

app.get(`/api/${VERSION}/health`, async (req: Request, res: Response) => {
  try {
    await query('SELECT 1');
    res.status(200).json({
      status: 'online',
      db: 'connected',
      ws: 'active',
      uptime: Math.floor(process.uptime()),
    });
  } catch (e) {
    res.status(503).json({ status: 'offline' });
  }
});

// API Routes
app.use(`/api/${VERSION}`, routes);

// --- Legacy Redirects ---
app.get('/login', (req, res) => {
  res.redirect(`${CLIENT_URL}/auth/denied`);
});

// 404 Handler
app.use((req: Request, res: Response) => {
  if (req.method === 'GET' && !req.path.startsWith('/api/')) {
    return res.redirect(`${CLIENT_URL}/not-found-matrix`);
  }
  res.status(404).json({
    message: 'Node not found in the matrix.',
    path: req.url,
    method: req.method
  });
});

// Global Error Handler
app.use(errorHandler);

export default app;
