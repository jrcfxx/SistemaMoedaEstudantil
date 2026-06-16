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

export interface Professor {
  id: string;
  nome: string;
  cpf: string;
  departamento: string;
  saldoMoedas: number;
  instituicaoId: string;
  instituicao?: Pick<Instituicao, 'id' | 'nome'>;
  createdAt: string;
  updatedAt: string;
}

export interface TransacaoMoeda {
  id: string;
  tipo: 'ENVIO' | 'RESGATE';
  valor: number;
  motivo: string;
  alunoId: string;
  professorId?: string;
  vantagemId?: string;
  createdAt: string;
  aluno?: Pick<Aluno, 'id' | 'nome' | 'email'>;
  professor?: Pick<Professor, 'id' | 'nome'>;
  vantagem?: Pick<Vantagem, 'id' | 'titulo'>;
}

export interface CreateProfessorInput {
  nome: string;
  email: string;
  senha: string;
  cpf: string;
  departamento: string;
  instituicaoId: string;
}

export interface DistribuirMoedasInput {
  alunoId: string;
  valor: number;
  motivo: string;
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
  senha: string;
  cpf: string;
  rg: string;
  endereco: string;
  curso: string;
  instituicaoId: string;
}

export interface Vantagem {
  id: string;
  titulo: string;
  descricao: string;
  fotoUrl?: string;
  custoMoedas: number;
  empresaParceiraId: string;
  empresa?: Pick<EmpresaParceira, 'id' | 'nome' | 'email'>;
  createdAt: string;
  updatedAt: string;
}

export interface Resgate {
  id: string;
  codigoCupom: string;
  status: 'PENDENTE' | 'UTILIZADO';
  alunoId: string;
  vantagemId: string;
  createdAt: string;
  aluno?: Pick<Aluno, 'id' | 'nome' | 'email'>;
  vantagem?: Vantagem;
}

export interface CreateVantagemInput {
  titulo: string;
  descricao: string;
  fotoUrl?: string;
  custoMoedas: number;
  empresaParceiraId: string;
}

export interface ResgateInput {
  alunoId?: string;
  vantagemId: string;
}

export interface CreateEmpresaParceiraInput {
  nome: string;
  email: string;
  senha: string;
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
  totalProfessores: number;
  totalMoedasDistribuidas: number;
  recentAlunos: Aluno[];
  recentEmpresas: EmpresaParceira[];
}

export interface ApiError {
  error: string;
  details?: Record<string, string>;
}
