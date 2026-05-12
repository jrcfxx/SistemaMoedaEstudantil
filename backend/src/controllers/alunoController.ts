import { NextFunction, Request, Response } from 'express'
import { alunoService } from '../services/alunoService'
import { createAlunoSchema, updateAlunoSchema } from '../validators/alunoValidator'

export const alunoController = {
  // GET /api/alunos
  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const alunos = await alunoService.listarAlunos()
      res.json({ data: alunos, total: alunos.length })
    } catch (err) {
      next(err)
    }
  },

  // GET /api/alunos/:id
  async show(req: Request, res: Response, next: NextFunction) {
    try {
      const aluno = await alunoService.buscarAluno(req.params.id)
      res.json({ data: aluno })
    } catch (err) {
      next(err)
    }
  },

  // POST /api/alunos
  async store(req: Request, res: Response, next: NextFunction) {
    try {
      const input = createAlunoSchema.parse(req.body)
      const aluno = await alunoService.criarAluno(input)
      res.status(201).json({ data: aluno })
    } catch (err) {
      next(err)
    }
  },

  // PUT /api/alunos/:id
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const input = updateAlunoSchema.parse(req.body)
      const aluno = await alunoService.atualizarAluno(req.params.id, input)
      res.json({ data: aluno })
    } catch (err) {
      next(err)
    }
  },

  // DELETE /api/alunos/:id
  async destroy(req: Request, res: Response, next: NextFunction) {
    try {
      await alunoService.removerAluno(req.params.id)
      res.status(204).send()
    } catch (err) {
      next(err)
    }
  },
}
