export interface Instituicao {
  id: string;
  nome: string;
  createdAt: string;
  updatedAt: string;
}

export interface Aluno {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  rg: string;
  endereco: string;
  curso: string;
  saldoMoedas: number;
  instituicaoId: string;
  instituicao?: Pick<Instituicao, 'id' | 'nome'>;
  createdAt: string;
  updatedAt: string;
}

export interface EmpresaParceira {
  id: string;
  nome: string;
  email: string;
  cnpj: string;
  endereco: string;
  telefone?: string;
  status: 'ATIVA' | 'INATIVA';
  createdAt: string;
  updatedAt: string;
}

export interface CreateAlunoInput {
  nome: string;
  email: string;
  cpf: string;
  rg: string;
  endereco: string;
  curso: string;
  instituicaoId: string;
}

export interface CreateEmpresaParceiraInput {
  nome: string;
  email: string;
  cnpj: string;
  endereco: string;
  telefone?: string;
  status?: 'ATIVA' | 'INATIVA';
}

export interface CreateInstituicaoInput {
  nome: string;
}

export interface DashboardStats {
  totalAlunos: number;
  totalEmpresas: number;
  totalInstituicoes: number;
  recentAlunos: Aluno[];
  recentEmpresas: EmpresaParceira[];
}

export interface ApiError {
  error: string;
  details?: Record<string, string>;
}
