import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { AppError } from '../middlewares/errorHandler';
import { criarUsuario } from '../lib/createUsuario';
import { creditoSemestralService } from './creditoSemestralService';
import {
  LoginInput,
  RegisterInput,
  RegisterAlunoInput,
  RegisterEmpresaInput,
  registerAlunoSchema,
  registerEmpresaSchema,
  registerAdminSchema,
} from '../validators/authValidator';

const JWT_SECRET = process.env.JWT_SECRET || 'moeda_estudantil_secret_dev';
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']) || '7d';

export interface JwtPayload {
  sub: string;
  nome: string;
  email: string;
  tipo: string;
  iat?: number;
  exp?: number;
}

export interface AuthResponse {
  token: string;
  usuario: {
    id: string;
    nome: string;
    email: string;
    tipo: string;
  };
  creditoSemestral?: { valor: number };
}

function gerarToken(usuario: { id: string; nome: string; email: string; tipo: string }): string {
  return jwt.sign(
    { sub: usuario.id, nome: usuario.nome, email: usuario.email, tipo: usuario.tipo },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN },
  );
}

function normalizeCpf(cpf: string): string {
  return cpf.replace(/\D/g, '');
}

function normalizeCnpj(cnpj: string): string {
  return cnpj.replace(/\D/g, '');
}

async function aplicarCreditoProfessor(usuarioId: string): Promise<{ valor: number } | undefined> {
  const professor = await prisma.professor.findFirst({
    where: { usuarioId },
    select: { id: true },
  });
  if (!professor) return undefined;

  const resultado = await creditoSemestralService.garantirCredito(professor.id);
  return resultado.creditado && resultado.valor ? { valor: resultado.valor } : undefined;
}

export const authService = {
  login: async ({ email, senha }: LoginInput): Promise<AuthResponse> => {
    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) throw new AppError('Credenciais inválidas', 401);

    const senhaValida = await bcrypt.compare(senha, usuario.senhaHash);
    if (!senhaValida) throw new AppError('Credenciais inválidas', 401);

    let creditoSemestral: { valor: number } | undefined;
    if (usuario.tipo === 'PROFESSOR') {
      creditoSemestral = await aplicarCreditoProfessor(usuario.id);
    }

    const token = gerarToken(usuario);
    return {
      token,
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, tipo: usuario.tipo },
      creditoSemestral,
    };
  },

  registerAdmin: async (data: unknown): Promise<AuthResponse> => {
    const { nome, email, senha, tipo } = registerAdminSchema.parse(data);
    const existing = await prisma.usuario.findUnique({ where: { email } });
    if (existing) throw new AppError('E-mail já cadastrado', 409);
    const senhaHash = await bcrypt.hash(senha, 10);
    const usuario = await prisma.usuario.create({ data: { nome, email, senhaHash, tipo } });
    const token = gerarToken(usuario);
    return { token, usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, tipo: usuario.tipo } };
  },

  register: async ({ nome, email, senha, tipo }: RegisterInput): Promise<AuthResponse> => {
    const existing = await prisma.usuario.findUnique({ where: { email } });
    if (existing) throw new AppError('E-mail já cadastrado', 409);

    const senhaHash = await bcrypt.hash(senha, 10);
    const usuario = await prisma.usuario.create({
      data: { nome, email, senhaHash, tipo },
    });

    const token = gerarToken(usuario);
    return {
      token,
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, tipo: usuario.tipo },
    };
  },

  registerAluno: async (data: RegisterAlunoInput): Promise<AuthResponse> => {
    const { senha, ...perfil } = registerAlunoSchema.parse(data);
    perfil.cpf = normalizeCpf(perfil.cpf);

    const instituicao = await prisma.instituicao.findUnique({ where: { id: perfil.instituicaoId } });
    if (!instituicao) throw new AppError('Instituição não encontrada', 404);

    const emailExistente = await prisma.aluno.findUnique({ where: { email: perfil.email } });
    if (emailExistente) throw new AppError('E-mail já cadastrado', 409);

    const cpfExistente = await prisma.aluno.findUnique({ where: { cpf: perfil.cpf } });
    if (cpfExistente) throw new AppError('CPF já cadastrado', 409);

    const usuario = await prisma.$transaction(async (tx) => {
      const novoUsuario = await criarUsuario(tx, {
        nome: perfil.nome,
        email: perfil.email,
        senha,
        tipo: 'ALUNO',
      });

      await tx.aluno.create({
        data: { ...perfil, saldoMoedas: 0, usuarioId: novoUsuario.id },
      });

      return novoUsuario;
    });

    const token = gerarToken(usuario);
    return {
      token,
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, tipo: usuario.tipo },
    };
  },

  registerEmpresa: async (data: RegisterEmpresaInput): Promise<AuthResponse> => {
    const { senha, ...perfil } = registerEmpresaSchema.parse(data);
    perfil.cnpj = normalizeCnpj(perfil.cnpj);

    const emailExistente = await prisma.empresaParceira.findUnique({ where: { email: perfil.email } });
    if (emailExistente) throw new AppError('E-mail já cadastrado', 409);

    const cnpjExistente = await prisma.empresaParceira.findUnique({ where: { cnpj: perfil.cnpj } });
    if (cnpjExistente) throw new AppError('CNPJ já cadastrado', 409);

    const usuario = await prisma.$transaction(async (tx) => {
      const novoUsuario = await criarUsuario(tx, {
        nome: perfil.nome,
        email: perfil.email,
        senha,
        tipo: 'EMPRESA',
      });

      await tx.empresaParceira.create({
        data: { ...perfil, status: 'ATIVA', usuarioId: novoUsuario.id },
      });

      return novoUsuario;
    });

    const token = gerarToken(usuario);
    return {
      token,
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, tipo: usuario.tipo },
    };
  },

  me: async (userId: string) => {
    const usuario = await prisma.usuario.findUnique({
      where: { id: userId },
      select: { id: true, nome: true, email: true, tipo: true, createdAt: true },
    });
    if (!usuario) throw new AppError('Usuário não encontrado', 404);

    const [aluno, empresa, professor] = await Promise.all([
      prisma.aluno.findFirst({ where: { usuarioId: userId }, select: { id: true } }),
      prisma.empresaParceira.findFirst({ where: { usuarioId: userId }, select: { id: true } }),
      prisma.professor.findFirst({ where: { usuarioId: userId }, select: { id: true } }),
    ]);

    return {
      ...usuario,
      alunoId: aluno?.id ?? null,
      empresaId: empresa?.id ?? null,
      professorId: professor?.id ?? null,
    };
  },

  verificarToken: (token: string): JwtPayload => {
    try {
      return jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch {
      throw new AppError('Token inválido ou expirado', 401);
    }
  },
};
