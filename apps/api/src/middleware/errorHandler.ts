import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  
  console.error(`[Error] ${status} - ${message}`);
  
  res.status(status).json({
    error: {
      message,
      status,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    },
  });
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
};
