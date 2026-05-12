import { Request, Response, NextFunction } from 'express';
import { alunoService } from '../services/alunoService';

export const alunoController = {
  findAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const search = req.query.search as string | undefined;
      const alunos = await alunoService.findAll(search);
      res.json(alunos);
    } catch (error) {
      next(error);
    }
  },

  findById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const aluno = await alunoService.findById(req.params.id);
      res.json(aluno);
    } catch (error) {
      next(error);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const aluno = await alunoService.create(req.body);
      res.status(201).json(aluno);
    } catch (error) {
      next(error);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const aluno = await alunoService.update(req.params.id, req.body);
      res.json(aluno);
    } catch (error) {
      next(error);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await alunoService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};
