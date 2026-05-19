import { api } from './api';
import { Vantagem, CreateVantagemInput, Resgate, ResgateInput } from '../types';

interface ResgateResponse {
  resgate: Resgate;
  saldoRestante: number;
}

export const vantagemService = {
  findAll: async (search?: string): Promise<Vantagem[]> => {
    const params = search ? { search } : {};
    const { data } = await api.get<Vantagem[]>('/vantagens', { params });
    return data;
  },

  findById: async (id: string): Promise<Vantagem> => {
    const { data } = await api.get<Vantagem>(`/vantagens/${id}`);
    return data;
  },

  findByEmpresa: async (empresaId: string): Promise<Vantagem[]> => {
    const { data } = await api.get<Vantagem[]>(`/vantagens/empresa/${empresaId}`);
    return data;
  },

  create: async (input: CreateVantagemInput): Promise<Vantagem> => {
    const { data } = await api.post<Vantagem>('/vantagens', input);
    return data;
  },

  update: async (id: string, input: Partial<CreateVantagemInput>): Promise<Vantagem> => {
    const { data } = await api.put<Vantagem>(`/vantagens/${id}`, input);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/vantagens/${id}`);
  },

  resgatar: async (input: ResgateInput): Promise<ResgateResponse> => {
    const { data } = await api.post<ResgateResponse>('/vantagens/resgatar', input);
    return data;
  },


  findResgatesByAluno: async (alunoId: string): Promise<Resgate[]> => {
    const { data } = await api.get<Resgate[]>(`/vantagens/resgates/aluno/${alunoId}`);
    return data;
  },
};
