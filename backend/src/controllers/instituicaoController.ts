import { Request, Response, NextFunction } from 'express';
import { instituicaoService } from '../services/instituicaoService';

export const instituicaoController = {
  findAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const search = req.query.search as string | undefined;
      const instituicoes = await instituicaoService.findAll(search);
      res.json(instituicoes);
    } catch (error) {
      next(error);
    }
  },

  findById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const inst = await instituicaoService.findById(req.params.id);
      res.json(inst);
    } catch (error) {
      next(error);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const inst = await instituicaoService.create(req.body);
      res.status(201).json(inst);
    } catch (error) {
      next(error);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const inst = await instituicaoService.update(req.params.id, req.body);
      res.json(inst);
    } catch (error) {
      next(error);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await instituicaoService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};
