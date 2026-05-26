import { Request, Response, NextFunction } from 'express';
import { empresaParceiraService } from '../services/empresaParceiraService';

type IdParam = { id: string };

export const empresaParceiraController = {
  findAll: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const search = req.query.search as string | undefined;
      const empresas = await empresaParceiraService.findAll(search);
      res.json(empresas);
    } catch (error) {
      next(error);
    }
  },

  findById: async (req: Request<IdParam>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const empresa = await empresaParceiraService.findById(req.params.id);
      res.json(empresa);
    } catch (error) {
      next(error);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const empresa = await empresaParceiraService.create(req.body);
      res.status(201).json(empresa);
    } catch (error) {
      next(error);
    }
  },

  update: async (req: Request<IdParam>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const empresa = await empresaParceiraService.update(req.params.id, req.body, req.user);
      res.json(empresa);
    } catch (error) {
      next(error);
    }
  },

  delete: async (req: Request<IdParam>, res: Response, next: NextFunction): Promise<void> => {
    try {
      await empresaParceiraService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};
