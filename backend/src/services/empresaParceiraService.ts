import { AppError } from '../middlewares/AppError'
import { empresaParceiraRepository } from '../repositories/empresaParceiraRepository'
import {
  CreateEmpresaParceiraInput,
  UpdateEmpresaParceiraInput,
} from '../validators/empresaParceiraValidator'

export const empresaParceiraService = {
  async listarEmpresas() {
    return empresaParceiraRepository.findAll()
  },

  async buscarEmpresa(id: string) {
    const empresa = await empresaParceiraRepository.findById(id)
    if (!empresa) throw new AppError('Empresa parceira não encontrada', 404)
    return empresa
  },

  async criarEmpresa(data: CreateEmpresaParceiraInput) {
    const emailExistente = await empresaParceiraRepository.findByEmail(data.email)
    if (emailExistente) throw new AppError('E-mail já cadastrado', 409)

    const cnpjExistente = await empresaParceiraRepository.findByCnpj(data.cnpj)
    if (cnpjExistente) throw new AppError('CNPJ já cadastrado', 409)

    return empresaParceiraRepository.create(data)
  },

  async atualizarEmpresa(id: string, data: UpdateEmpresaParceiraInput) {
    await empresaParceiraService.buscarEmpresa(id)

    if (data.email) {
      const emailExistente = await empresaParceiraRepository.findByEmail(data.email)
      if (emailExistente && emailExistente.id !== id) {
        throw new AppError('E-mail já cadastrado por outra empresa', 409)
      }
    }

    if (data.cnpj) {
      const cnpjExistente = await empresaParceiraRepository.findByCnpj(data.cnpj)
      if (cnpjExistente && cnpjExistente.id !== id) {
        throw new AppError('CNPJ já cadastrado por outra empresa', 409)
      }
    }

    return empresaParceiraRepository.update(id, data)
  },

  async removerEmpresa(id: string) {
    await empresaParceiraService.buscarEmpresa(id)
    await empresaParceiraRepository.delete(id)
  },
}
