import { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'
import { AppError } from './AppError'

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // Erros de validação Zod
  if (err instanceof ZodError) {
    res.status(422).json({
      status: 'error',
      message: 'Dados inválidos',
      errors: err.errors.map((e) => ({
        campo: e.path.join('.'),
        mensagem: e.message,
      })),
    })
    return
  }

  // Erros de negócio controlados
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    })
    return
  }

  // Erros inesperados
  console.error('Erro interno:', err)
  res.status(500).json({
    status: 'error',
    message: 'Erro interno do servidor',
  })
}
