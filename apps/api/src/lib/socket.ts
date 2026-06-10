import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

export let io: Server;

export const initSocket = (httpServer: HttpServer, allowedOrigins: string | string[]) => {
  io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
      credentials: true,
    },
  });
  return io;
};
