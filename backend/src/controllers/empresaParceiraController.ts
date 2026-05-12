import { NextFunction, Request, Response } from 'express'
import { empresaParceiraService } from '../services/empresaParceiraService'
import {
  createEmpresaParceiraSchema,
  updateEmpresaParceiraSchema,
} from '../validators/empresaParceiraValidator'

export const empresaParceiraController = {
  // GET /api/empresas
  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const empresas = await empresaParceiraService.listarEmpresas()
      res.json({ data: empresas, total: empresas.length })
    } catch (err) {
      next(err)
    }
  },

  // GET /api/empresas/:id
  async show(req: Request, res: Response, next: NextFunction) {
    try {
      const empresa = await empresaParceiraService.buscarEmpresa(req.params.id)
      res.json({ data: empresa })
    } catch (err) {
      next(err)
    }
  },

  // POST /api/empresas
  async store(req: Request, res: Response, next: NextFunction) {
    try {
      const input = createEmpresaParceiraSchema.parse(req.body)
      const empresa = await empresaParceiraService.criarEmpresa(input)
      res.status(201).json({ data: empresa })
    } catch (err) {
      next(err)
    }
  },

  // PUT /api/empresas/:id
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const input = updateEmpresaParceiraSchema.parse(req.body)
      const empresa = await empresaParceiraService.atualizarEmpresa(req.params.id, input)
      res.json({ data: empresa })
    } catch (err) {
      next(err)
    }
  },

  // DELETE /api/empresas/:id
  async destroy(req: Request, res: Response, next: NextFunction) {
    try {
      await empresaParceiraService.removerEmpresa(req.params.id)
      res.status(204).send()
    } catch (err) {
      next(err)
    }
  },
}
