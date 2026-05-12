import { api } from './api';
import { EmpresaParceira, CreateEmpresaParceiraInput } from '../types';

export const empresaService = {
  findAll: async (search?: string): Promise<EmpresaParceira[]> => {
    const params = search ? { search } : {};
    const { data } = await api.get<EmpresaParceira[]>('/empresas-parceiras', { params });
    return data;
  },

  findById: async (id: string): Promise<EmpresaParceira> => {
    const { data } = await api.get<EmpresaParceira>(`/empresas-parceiras/${id}`);
    return data;
  },

  create: async (input: CreateEmpresaParceiraInput): Promise<EmpresaParceira> => {
    const { data } = await api.post<EmpresaParceira>('/empresas-parceiras', input);
    return data;
  },

  update: async (id: string, input: Partial<CreateEmpresaParceiraInput>): Promise<EmpresaParceira> => {
    const { data } = await api.put<EmpresaParceira>(`/empresas-parceiras/${id}`, input);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/empresas-parceiras/${id}`);
  },
};
