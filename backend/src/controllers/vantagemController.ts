import { Request, Response, NextFunction } from 'express';
import { vantagemService } from '../services/vantagemService';

type IdParam = { id: string };

export const vantagemController = {
  findAll: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const search = req.query.search as string | undefined;
      res.json(await vantagemService.findAll(search));
    } catch (err) { next(err); }
  },

  findById: async (req: Request<IdParam>, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.json(await vantagemService.findById(req.params.id));
    } catch (err) { next(err); }
  },

  findByEmpresa: async (req: Request<IdParam>, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.json(await vantagemService.findByEmpresa(req.params.id));
    } catch (err) { next(err); }
  },

  create: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(201).json(await vantagemService.create(req.body));
    } catch (err) { next(err); }
  },

  update: async (req: Request<IdParam>, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.json(await vantagemService.update(req.params.id, req.body));
    } catch (err) { next(err); }
  },

  delete: async (req: Request<IdParam>, res: Response, next: NextFunction): Promise<void> => {
    try {
      await vantagemService.delete(req.params.id);
      res.status(204).send();
    } catch (err) { next(err); }
  },

  resgatar: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(201).json(await vantagemService.resgatar(req.body));
    } catch (err) { next(err); }
  },

  findResgatesByAluno: async (req: Request<IdParam>, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.json(await vantagemService.findResgatesByAluno(req.params.id));
    } catch (err) { next(err); }
  },
};
