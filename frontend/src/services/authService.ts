import { api } from './api';

export type TipoUsuario = 'ADMIN' | 'PROFESSOR' | 'ALUNO' | 'EMPRESA';

export interface AuthUser {
  id: string;
  nome: string;
  email: string;
  tipo: TipoUsuario;
  alunoId?: string | null;
  empresaId?: string | null;
  professorId?: string | null;
}

interface LoginResponse {
  token: string;
  usuario: AuthUser;
  creditoSemestral?: { valor: number };
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
    if (data.creditoSemestral) {
      sessionStorage.setItem('credito_semestral', String(data.creditoSemestral.valor));
    }
    return fetchAndStoreProfile(data.token).catch(() => data.usuario);
  },

  registerAluno: async (payload: {
    nome: string;
    email: string;
    senha: string;
    cpf: string;
    rg: string;
    endereco: string;
    curso: string;
    instituicaoId: string;
  }): Promise<AuthUser> => {
    const { data } = await api.post<LoginResponse>('/auth/register/aluno', payload);
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.usuario));
    return fetchAndStoreProfile(data.token).catch(() => data.usuario);
  },

  registerEmpresa: async (payload: {
    nome: string;
    email: string;
    senha: string;
    cnpj: string;
    endereco: string;
    telefone?: string;
  }): Promise<AuthUser> => {
    const { data } = await api.post<LoginResponse>('/auth/register/empresa', payload);
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.usuario));
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

  refreshProfile: async (): Promise<AuthUser | null> => {
    const token = authService.getToken();
    if (!token) return null;
    try {
      return await fetchAndStoreProfile(token);
    } catch {
      return authService.getUser();
    }
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
