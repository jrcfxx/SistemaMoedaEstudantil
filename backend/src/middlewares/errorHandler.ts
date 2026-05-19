import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 400,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

const PRISMA_CONFLICT_CODES = new Set(['P2002', 'P2014', 'P2019']);
const PRISMA_FK_CODES = new Set(['P2003', 'P2004']);
const PRISMA_NOT_FOUND_CODE = 'P2025';

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({ error: `Rota ${req.method} ${req.path} não encontrada` });
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  if (err instanceof ZodError) {
    const details: Record<string, string> = {};
    err.errors.forEach((e) => {
      const field = e.path.join('.') || '_';
      details[field] = e.message;
    });
    res.status(422).json({ error: 'Dados inválidos', details });
    return;
  }

  if (err instanceof PrismaClientKnownRequestError) {
    if (PRISMA_CONFLICT_CODES.has(err.code)) {
      res.status(409).json({ error: 'Registro já existe ou viola restrição de unicidade' });
      return;
    }
    if (PRISMA_FK_CODES.has(err.code)) {
      res.status(409).json({ error: 'Não é possível realizar a operação: existem registros vinculados' });
      return;
    }
    if (err.code === PRISMA_NOT_FOUND_CODE) {
      res.status(404).json({ error: 'Registro não encontrado' });
      return;
    }
  }

  console.error('[ErrorHandler]', err);
  res.status(500).json({ error: 'Erro interno do servidor' });
}
