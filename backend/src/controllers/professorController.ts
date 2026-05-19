import { Request, Response, NextFunction } from 'express';
import { professorService } from '../services/professorService';

type IdParam = { id: string };

export const professorController = {
  findAll: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const search = req.query.search as string | undefined;
      const data = await professorService.findAll(search);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  findById: async (req: Request<IdParam>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await professorService.findById(req.params.id);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  findTransacoes: async (req: Request<IdParam>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await professorService.findTransacoes(req.params.id);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await professorService.create(req.body);
      res.status(201).json(data);
    } catch (err) {
      next(err);
    }
  },

  update: async (req: Request<IdParam>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await professorService.update(req.params.id, req.body);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  delete: async (req: Request<IdParam>, res: Response, next: NextFunction): Promise<void> => {
    try {
      await professorService.delete(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },

  distribuirMoedas: async (req: Request<IdParam>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await professorService.distribuirMoedas(req.params.id, req.body);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  },
};
