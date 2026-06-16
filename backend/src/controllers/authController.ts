import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';
import { loginSchema, registerSchema, registerAlunoSchema, registerEmpresaSchema } from '../validators/authValidator';

export const authController = {
  login: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = loginSchema.parse(req.body);
      const result = await authService.login(data);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  register: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = registerSchema.parse(req.body);
      const result = await authService.register(data);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  },

  registerAluno: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = registerAlunoSchema.parse(req.body);
      const result = await authService.registerAluno(data);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  },

  registerEmpresa: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = registerEmpresaSchema.parse(req.body);
      const result = await authService.registerEmpresa(data);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  },

  registerAdmin: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await authService.registerAdmin(req.body);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  },

  me: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await authService.me(req.user!.sub);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
};
