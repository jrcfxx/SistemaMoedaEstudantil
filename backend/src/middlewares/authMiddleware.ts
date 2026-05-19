import { Request, Response, NextFunction } from 'express';
import { authService, JwtPayload } from '../services/authService';
import { AppError } from './errorHandler';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next(new AppError('Token de acesso não fornecido', 401));
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    req.user = authService.verificarToken(token);
    next();
  } catch (err) {
    next(err);
  }
}

export function requireRole(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError('Não autenticado', 401));
      return;
    }
    if (!roles.includes(req.user.tipo)) {
      next(new AppError('Acesso negado: permissão insuficiente', 403));
      return;
    }
    next();
  };
}
