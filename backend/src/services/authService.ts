import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { AppError } from '../middlewares/errorHandler';
import { LoginInput, RegisterInput } from '../validators/authValidator';

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
}

function gerarToken(usuario: { id: string; nome: string; email: string; tipo: string }): string {
  return jwt.sign(
    { sub: usuario.id, nome: usuario.nome, email: usuario.email, tipo: usuario.tipo },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN },
  );
}

export const authService = {
  login: async ({ email, senha }: LoginInput): Promise<AuthResponse> => {
    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) throw new AppError('Credenciais inválidas', 401);

    const senhaValida = await bcrypt.compare(senha, usuario.senhaHash);
    if (!senhaValida) throw new AppError('Credenciais inválidas', 401);

    const token = gerarToken(usuario);
    return {
      token,
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, tipo: usuario.tipo },
    };
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

  me: async (userId: string) => {
    const usuario = await prisma.usuario.findUnique({
      where: { id: userId },
      select: { id: true, nome: true, email: true, tipo: true, createdAt: true },
    });
    if (!usuario) throw new AppError('Usuário não encontrado', 404);
    return usuario;
  },

  verificarToken: (token: string): JwtPayload => {
    try {
      return jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch {
      throw new AppError('Token inválido ou expirado', 401);
    }
  },
};
