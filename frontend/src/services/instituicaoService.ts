import { api } from './api';
import { Instituicao, CreateInstituicaoInput } from '../types';

export const instituicaoService = {
  findAll: async (search?: string): Promise<Instituicao[]> => {
    const params = search ? { search } : {};
    const { data } = await api.get<Instituicao[]>('/instituicoes', { params });
    return data;
  },

  findById: async (id: string): Promise<Instituicao> => {
    const { data } = await api.get<Instituicao>(`/instituicoes/${id}`);
    return data;
  },

  create: async (input: CreateInstituicaoInput): Promise<Instituicao> => {
    const { data } = await api.post<Instituicao>('/instituicoes', input);
    return data;
  },

  update: async (id: string, input: Partial<CreateInstituicaoInput>): Promise<Instituicao> => {
    const { data } = await api.put<Instituicao>(`/instituicoes/${id}`, input);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/instituicoes/${id}`);
  },
};
