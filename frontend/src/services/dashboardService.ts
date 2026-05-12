import { api } from './api';
import { DashboardStats } from '../types';

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const { data } = await api.get<DashboardStats>('/dashboard');
    return data;
  },
};
