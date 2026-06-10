import dotenv from 'dotenv';
dotenv.config();

export const PORT = Number(process.env.PORT) || 4000;
export const VERSION = process.env.VERSION || 'v1';
export const ENV = process.env.NODE_ENV || 'development';
export const CLIENT_URL = process.env.CORS_ORIGIN || 'http://localhost:3000';
