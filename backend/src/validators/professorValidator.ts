import { z } from 'zod';

const cpfRegex = /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/;

export const createProfessorSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  cpf: z.string().regex(cpfRegex, 'CPF inválido (ex: 12345678901 ou 123.456.789-01)'),
  departamento: z.string().min(2, 'Departamento deve ter ao menos 2 caracteres'),
  instituicaoId: z.string().min(1, 'Instituição é obrigatória'),
});

export const updateProfessorSchema = createProfessorSchema.partial();

export const distribuirMoedasSchema = z.object({
  alunoId: z.string().min(1, 'Aluno é obrigatório'),
  valor: z.number().int('O valor deve ser um número inteiro').min(1, 'O valor deve ser pelo menos 1 moeda'),
  motivo: z.string().min(1, 'O motivo é obrigatório').max(500, 'Motivo muito longo'),
});

export type CreateProfessorInput = z.infer<typeof createProfessorSchema>;
export type UpdateProfessorInput = z.infer<typeof updateProfessorSchema>;
export type DistribuirMoedasInput = z.infer<typeof distribuirMoedasSchema>;
