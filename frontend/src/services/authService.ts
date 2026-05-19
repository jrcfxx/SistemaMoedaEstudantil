import { api } from './api';

export interface AuthUser {
  id: string;
  nome: string;
  email: string;
  tipo: string;
  alunoId?: string | null;
  empresaId?: string | null;
}

interface LoginResponse {
  token: string;
  usuario: AuthUser;
}

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

async function fetchAndStoreProfile(token: string): Promise<AuthUser> {
  const { data } = await api.get<AuthUser>('/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  localStorage.setItem(USER_KEY, JSON.stringify(data));
  return data;
}

export const authService = {
  login: async (email: string, senha: string): Promise<AuthUser> => {
    const { data } = await api.post<LoginResponse>('/auth/login', { email, senha });
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.usuario));
    // Busca perfil completo para obter alunoId/empresaId
    return fetchAndStoreProfile(data.token).catch(() => data.usuario);
  },

  register: async (
    nome: string,
    email: string,
    senha: string,
    tipo: string,
  ): Promise<AuthUser> => {
    const { data } = await api.post<LoginResponse>('/auth/register', { nome, email, senha, tipo });
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.usuario));
    return fetchAndStoreProfile(data.token).catch(() => data.usuario);
  },

  logout: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getToken: (): string | null => localStorage.getItem(TOKEN_KEY),

  getUser: (): AuthUser | null => {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  },

  isAuthenticated: (): boolean => !!localStorage.getItem(TOKEN_KEY),
};
