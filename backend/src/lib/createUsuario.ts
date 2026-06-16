import bcrypt from 'bcryptjs';
import { Prisma, TipoUsuario } from '@prisma/client';
import { AppError } from '../middlewares/errorHandler';

type Tx = Prisma.TransactionClient;

interface CriarUsuarioInput {
  nome: string;
  email: string;
  senha: string;
  tipo: TipoUsuario;
}

export async function criarUsuario(tx: Tx, { nome, email, senha, tipo }: CriarUsuarioInput) {
  const existente = await tx.usuario.findUnique({ where: { email } });
  if (existente) throw new AppError('E-mail já cadastrado', 409);

  const senhaHash = await bcrypt.hash(senha, 10);
  return tx.usuario.create({
    data: { nome, email, senhaHash, tipo },
  });
}
