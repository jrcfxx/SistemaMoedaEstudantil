import { instituicaoRepository } from '../repositories/instituicaoRepository';
import { AppError } from '../middlewares/errorHandler';
import {
  CreateInstituicaoInput,
  UpdateInstituicaoInput,
  createInstituicaoSchema,
  updateInstituicaoSchema,
} from '../validators/instituicaoValidator';

export const instituicaoService = {
  findAll: async (search?: string) => {
    return instituicaoRepository.findAll(search);
  },

  findById: async (id: string) => {
    const inst = await instituicaoRepository.findById(id);
    if (!inst) throw new AppError('Instituição não encontrada', 404);
    return inst;
  },

  create: async (data: CreateInstituicaoInput) => {
    const parsed = createInstituicaoSchema.parse(data);

    const existente = await instituicaoRepository.findByNome(parsed.nome);
    if (existente) throw new AppError('Já existe uma instituição com este nome', 409);

    return instituicaoRepository.create(parsed);
  },

  update: async (id: string, data: UpdateInstituicaoInput) => {
    const parsed = updateInstituicaoSchema.parse(data);

    const inst = await instituicaoRepository.findById(id);
    if (!inst) throw new AppError('Instituição não encontrada', 404);

    if (parsed.nome && parsed.nome !== inst.nome) {
      const existente = await instituicaoRepository.findByNome(parsed.nome);
      if (existente) throw new AppError('Já existe uma instituição com este nome', 409);
    }

    return instituicaoRepository.update(id, parsed);
  },

  delete: async (id: string) => {
    const inst = await instituicaoRepository.findById(id);
    if (!inst) throw new AppError('Instituição não encontrada', 404);
    await instituicaoRepository.delete(id);
  },
};
