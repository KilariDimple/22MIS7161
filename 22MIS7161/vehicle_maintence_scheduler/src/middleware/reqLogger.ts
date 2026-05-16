import { Request, Response, NextFunction } from 'express';
import { LogSync } from '../utils/logger';

export function reqLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  res.on('finish', () => {
    const dur = Date.now() - start;
    LogSync('backend', 'info', 'middleware', `${req.method} ${req.path} — ${res.statusCode} — ${dur}ms`);
  });

  next();
}
