import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.SESSION_SECRET || 'fallback_secret';

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    try {
      const token = authHeader.split(' ')[1];
      const decoded: any = jwt.verify(token, JWT_SECRET);
      
      const userRole = (decoded.role || '').toLowerCase();
      if (!roles.includes(userRole)) {
        res.status(403).json({ error: 'Insufficient permissions' });
        return;
      }
      
      (req as any).user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ error: 'Invalid or expired session' });
    }
  };
};

export const getCallerName = (req: Request): string => {
  try {
    const token = (req.headers.authorization || '').split(' ')[1];
    if (!token) return 'system';
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const rawName = decoded.username || decoded.email || decoded.id || 'system';
    if (typeof rawName === 'string' && rawName.includes('@')) {
      return rawName.split('@')[0];
    }
    return rawName;
  } catch {
    return 'system';
  }
};
