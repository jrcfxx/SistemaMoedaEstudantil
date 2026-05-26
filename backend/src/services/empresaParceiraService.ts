import { empresaParceiraRepository } from '../repositories/empresaParceiraRepository';
import { AppError } from '../middlewares/errorHandler';
import { assertEmpresaAutorizada, RequestUser } from '../lib/authHelpers';
import {
  CreateEmpresaParceiraInput,
  UpdateEmpresaParceiraInput,
  createEmpresaParceiraSchema,
  updateEmpresaParceiraSchema,
} from '../validators/empresaParceiraValidator';

function normalizeCnpj(cnpj: string): string {
  return cnpj.replace(/\D/g, '');
}

export const empresaParceiraService = {
  findAll: async (search?: string) => {
    return empresaParceiraRepository.findAll(search);
  },

  findById: async (id: string) => {
    const empresa = await empresaParceiraRepository.findById(id);
    if (!empresa) throw new AppError('Empresa parceira não encontrada', 404);
    return empresa;
  },

  create: async (data: CreateEmpresaParceiraInput) => {
    const parsed = createEmpresaParceiraSchema.parse(data);
    parsed.cnpj = normalizeCnpj(parsed.cnpj);

    const emailExistente = await empresaParceiraRepository.findByEmail(parsed.email);
    if (emailExistente) throw new AppError('E-mail já cadastrado', 409);

    const cnpjExistente = await empresaParceiraRepository.findByCnpj(parsed.cnpj);
    if (cnpjExistente) throw new AppError('CNPJ já cadastrado', 409);

    return empresaParceiraRepository.create(parsed);
  },

  update: async (id: string, data: UpdateEmpresaParceiraInput, usuario?: RequestUser) => {
    await assertEmpresaAutorizada(id, usuario);

    const parsed = updateEmpresaParceiraSchema.parse(data);

    const empresa = await empresaParceiraRepository.findById(id);
    if (!empresa) throw new AppError('Empresa parceira não encontrada', 404);

    if (parsed.cnpj) {
      parsed.cnpj = normalizeCnpj(parsed.cnpj);
    }

    if (parsed.email && parsed.email !== empresa.email) {
      const emailExistente = await empresaParceiraRepository.findByEmail(parsed.email);
      if (emailExistente) throw new AppError('E-mail já cadastrado', 409);
    }

    if (parsed.cnpj && parsed.cnpj !== empresa.cnpj) {
      const cnpjExistente = await empresaParceiraRepository.findByCnpj(parsed.cnpj);
      if (cnpjExistente) throw new AppError('CNPJ já cadastrado', 409);
    }

    return empresaParceiraRepository.update(id, parsed);
  },

  delete: async (id: string) => {
    const empresa = await empresaParceiraRepository.findById(id);
    if (!empresa) throw new AppError('Empresa parceira não encontrada', 404);
    await empresaParceiraRepository.delete(id);
  },
};
