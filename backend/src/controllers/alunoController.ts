import { Request, Response, NextFunction } from 'express';
import {
  assertAlunoAutorizado,
  assertAlunoMesmaInstituicaoDoProfessor,
  findProfessorByUsuarioId,
  RequestUser,
} from '../lib/authHelpers';
import { alunoService } from '../services/alunoService';

type IdParam = { id: string };

async function instituicaoIdDoProfessor(usuario?: RequestUser): Promise<string | undefined> {
  if (!usuario || usuario.tipo !== 'PROFESSOR') return undefined;
  const professor = await findProfessorByUsuarioId(usuario.sub);
  return professor.instituicaoId;
}

export const alunoController = {
  findAll: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const search = req.query.search as string | undefined;
      const instituicaoId = await instituicaoIdDoProfessor(req.user);
      const alunos = await alunoService.findAll(search, instituicaoId);
      res.json(alunos);
    } catch (error) {
      next(error);
    }
  },

  findById: async (req: Request<IdParam>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const aluno = await alunoService.findById(req.params.id);
      await assertAlunoMesmaInstituicaoDoProfessor(aluno.instituicaoId, req.user);
      res.json(aluno);
    } catch (error) {
      next(error);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = { ...req.body };
      if (req.user?.tipo === 'PROFESSOR') {
        const professor = await findProfessorByUsuarioId(req.user.sub);
        body.instituicaoId = professor.instituicaoId;
      }
      const aluno = await alunoService.create(body);
      res.status(201).json(aluno);
    } catch (error) {
      next(error);
    }
  },

  update: async (req: Request<IdParam>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const existente = await alunoService.findById(req.params.id);
      await assertAlunoMesmaInstituicaoDoProfessor(existente.instituicaoId, req.user);

      const body = { ...req.body };
      if (req.user?.tipo === 'PROFESSOR') {
        delete body.instituicaoId;
      }

      const aluno = await alunoService.update(req.params.id, body);
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
      const aluno = await alunoService.findById(req.params.id);
      await assertAlunoMesmaInstituicaoDoProfessor(aluno.instituicaoId, req.user);
      res.json(await alunoService.findTransacoes(req.params.id));
    } catch (error) {
      next(error);
    }
  },
};
