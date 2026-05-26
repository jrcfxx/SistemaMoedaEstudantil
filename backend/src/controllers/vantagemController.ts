import { Request, Response, NextFunction } from 'express';
import { vantagemService } from '../services/vantagemService';
import { assertAlunoAutorizado, findEmpresaIdByUsuarioId } from '../lib/authHelpers';
import { AppError } from '../middlewares/errorHandler';

type IdParam = { id: string };
type EmpresaParam = { empresaParceiraId: string };

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

  findByEmpresa: async (req: Request<EmpresaParam>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const search = req.query.search as string | undefined;
      if (req.user?.tipo === 'EMPRESA') {
        const empresaId = await findEmpresaIdByUsuarioId(req.user.sub);
        if (req.params.empresaParceiraId !== empresaId) {
          throw new AppError('Acesso negado', 403);
        }
      }
      res.json(await vantagemService.findByEmpresa(req.params.empresaParceiraId, search));
    } catch (err) { next(err); }
  },

  create: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(201).json(await vantagemService.create(req.body, req.user));
    } catch (err) { next(err); }
  },

  update: async (req: Request<IdParam>, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.json(await vantagemService.update(req.params.id, req.body, req.user));
    } catch (err) { next(err); }
  },

  delete: async (req: Request<IdParam>, res: Response, next: NextFunction): Promise<void> => {
    try {
      await vantagemService.delete(req.params.id, req.user);
      res.status(204).send();
    } catch (err) { next(err); }
  },

  resgatar: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const payload = { ...req.body };
      if (req.user?.tipo === 'ALUNO') {
        const aluno = await vantagemService.findAlunoByUsuarioId(req.user.sub);
        payload.alunoId = aluno.id;
      }
      if (!payload.alunoId) {
        throw new AppError('Aluno é obrigatório', 422);
      }
      res.status(201).json(await vantagemService.resgatar(payload));
    } catch (err) { next(err); }
  },

  findResgatesByAluno: async (req: Request<IdParam>, res: Response, next: NextFunction): Promise<void> => {
    try {
      await assertAlunoAutorizado(req.params.id, req.user);
      res.json(await vantagemService.findResgatesByAluno(req.params.id));
    } catch (err) { next(err); }
  },
};
