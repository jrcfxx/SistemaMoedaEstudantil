import { Request, Response, NextFunction } from 'express';
import { assertAlunoAutorizado } from '../lib/authHelpers';
import { alunoService } from '../services/alunoService';

type IdParam = { id: string };

export const alunoController = {
  findAll: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const search = req.query.search as string | undefined;
      const alunos = await alunoService.findAll(search);
      res.json(alunos);
    } catch (error) {
      next(error);
    }
  },

  findById: async (req: Request<IdParam>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const aluno = await alunoService.findById(req.params.id);
      res.json(aluno);
    } catch (error) {
      next(error);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const aluno = await alunoService.create(req.body);
      res.status(201).json(aluno);
    } catch (error) {
      next(error);
    }
  },

  update: async (req: Request<IdParam>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const aluno = await alunoService.update(req.params.id, req.body);
      res.json(aluno);
    } catch (error) {
      next(error);
    }
  },

  delete: async (req: Request<IdParam>, res: Response, next: NextFunction): Promise<void> => {
    try {
      await alunoService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },

  findTransacoes: async (req: Request<IdParam>, res: Response, next: NextFunction): Promise<void> => {
    try {
      await assertAlunoAutorizado(req.params.id, req.user);
      res.json(await alunoService.findTransacoes(req.params.id));
    } catch (error) {
      next(error);
    }
  },
};
