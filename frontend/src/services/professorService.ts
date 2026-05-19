import { api } from './api';
import { Professor, CreateProfessorInput, TransacaoMoeda, DistribuirMoedasInput } from '../types';

interface DistribuirMoedasResponse {
  transacao: TransacaoMoeda;
  saldoProfessor: number;
}

export const professorService = {
  findAll: async (search?: string): Promise<Professor[]> => {
    const params = search ? { search } : {};
    const { data } = await api.get<Professor[]>('/professores', { params });
    return data;
  },

  findById: async (id: string): Promise<Professor> => {
    const { data } = await api.get<Professor>(`/professores/${id}`);
    return data;
  },

  findTransacoes: async (id: string): Promise<TransacaoMoeda[]> => {
    const { data } = await api.get<TransacaoMoeda[]>(`/professores/${id}/transacoes`);
    return data;
  },

  create: async (input: CreateProfessorInput): Promise<Professor> => {
    const { data } = await api.post<Professor>('/professores', input);
    return data;
  },

  update: async (id: string, input: Partial<CreateProfessorInput>): Promise<Professor> => {
    const { data } = await api.put<Professor>(`/professores/${id}`, input);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/professores/${id}`);
  },

  distribuirMoedas: async (
    professorId: string,
    input: DistribuirMoedasInput,
  ): Promise<DistribuirMoedasResponse> => {
    const { data } = await api.post<DistribuirMoedasResponse>(
      `/professores/${professorId}/distribuir-moedas`,
      input,
    );
    return data;
  },
};
