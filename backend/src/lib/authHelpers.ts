import { prisma } from './prisma';
import { AppError } from '../middlewares/errorHandler';

export type RequestUser = { sub: string; tipo: string; email: string };

export async function findEmpresaIdByUsuarioId(usuarioId: string): Promise<string> {
  const empresa = await prisma.empresaParceira.findFirst({
    where: { usuarioId },
    select: { id: true },
  });
  if (!empresa) throw new AppError('Cadastro de empresa não encontrado para este usuário', 404);
  return empresa.id;
}

export async function assertEmpresaAutorizada(
  empresaParceiraId: string,
  usuario?: RequestUser,
): Promise<void> {
  if (!usuario || usuario.tipo !== 'EMPRESA') return;
  const idAutorizado = await findEmpresaIdByUsuarioId(usuario.sub);
  if (idAutorizado !== empresaParceiraId) {
    throw new AppError('Acesso negado: operação permitida apenas para a própria empresa', 403);
  }
}

export async function findAlunoIdByUsuarioId(usuarioId: string): Promise<string> {
  const aluno = await prisma.aluno.findFirst({
    where: { usuarioId },
    select: { id: true },
  });
  if (!aluno) throw new AppError('Cadastro de aluno não encontrado para este usuário', 404);
  return aluno.id;
}

export async function assertAlunoAutorizado(alunoId: string, usuario?: RequestUser): Promise<void> {
  if (!usuario || usuario.tipo !== 'ALUNO') return;
  const idAutorizado = await findAlunoIdByUsuarioId(usuario.sub);
  if (idAutorizado !== alunoId) {
    throw new AppError('Acesso negado', 403);
  }
}

export async function findProfessorIdByUsuarioId(usuarioId: string): Promise<string> {
  const professor = await prisma.professor.findFirst({
    where: { usuarioId },
    select: { id: true },
  });
  if (!professor) throw new AppError('Cadastro de professor não encontrado para este usuário', 404);
  return professor.id;
}

export async function findProfessorByUsuarioId(usuarioId: string) {
  const professor = await prisma.professor.findFirst({
    where: { usuarioId },
    select: { id: true, instituicaoId: true },
  });
  if (!professor) throw new AppError('Cadastro de professor não encontrado para este usuário', 404);
  return professor;
}

export async function assertAlunoMesmaInstituicaoDoProfessor(
  alunoInstituicaoId: string,
  usuario?: RequestUser,
): Promise<void> {
  if (!usuario || usuario.tipo !== 'PROFESSOR') return;
  const professor = await findProfessorByUsuarioId(usuario.sub);
  if (professor.instituicaoId !== alunoInstituicaoId) {
    throw new AppError('Acesso negado: aluno pertence a outra instituição', 403);
  }
}

export async function assertProfessorAutorizado(professorId: string, usuario?: RequestUser): Promise<void> {
  if (!usuario || usuario.tipo !== 'PROFESSOR') return;
  const idAutorizado = await findProfessorIdByUsuarioId(usuario.sub);
  if (idAutorizado !== professorId) {
    throw new AppError('Acesso negado: operação permitida apenas na sua própria conta', 403);
  }
}
