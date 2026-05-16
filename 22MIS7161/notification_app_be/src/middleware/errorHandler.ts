import { Request, Response, NextFunction } from 'express';
import { ApiRes } from '../types/notification';
import { LogSync } from '../utils/logger';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  LogSync('backend', 'error', 'middleware', `Unhandled error: ${err.message} — ${req.method} ${req.path}`);

  res.status(500).json({
    success: false,
    error: 'Internal server error'
  } as ApiRes);
}

export function notFound(req: Request, res: Response): void {
  LogSync('backend', 'warn', 'middleware', `Route not found: ${req.method} ${req.path}`);

  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.path}`
  } as ApiRes);
}
