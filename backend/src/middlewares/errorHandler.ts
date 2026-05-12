import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 400,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  if (err instanceof ZodError) {
    const details: Record<string, string> = {};
    err.errors.forEach((e) => {
      const field = e.path.join('.');
      details[field] = e.message;
    });
    res.status(422).json({ error: 'Dados inválidos', details });
    return;
  }

  console.error('[ErrorHandler]', err);
  res.status(500).json({ error: 'Erro interno do servidor' });
}
