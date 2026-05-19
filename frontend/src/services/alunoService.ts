import { api } from './api';
import { Aluno, CreateAlunoInput, TransacaoMoeda } from '../types';

export const alunoService = {
  findAll: async (search?: string): Promise<Aluno[]> => {
    const params = search ? { search } : {};
    const { data } = await api.get<Aluno[]>('/alunos', { params });
    return data;
  },

  findById: async (id: string): Promise<Aluno> => {
    const { data } = await api.get<Aluno>(`/alunos/${id}`);
    return data;
  },

  create: async (input: CreateAlunoInput): Promise<Aluno> => {
    const { data } = await api.post<Aluno>('/alunos', input);
    return data;
  },

  update: async (id: string, input: Partial<CreateAlunoInput>): Promise<Aluno> => {
    const { data } = await api.put<Aluno>(`/alunos/${id}`, input);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/alunos/${id}`);
  },

  findTransacoes: async (id: string): Promise<TransacaoMoeda[]> => {
    const { data } = await api.get<TransacaoMoeda[]>(`/alunos/${id}/transacoes`);
    return data;
  },
};
