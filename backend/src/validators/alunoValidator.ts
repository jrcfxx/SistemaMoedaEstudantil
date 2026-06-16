import { z } from 'zod';

const cpfRegex = /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/;

const senhaSchema = z.string().min(6, 'Senha deve ter pelo menos 6 caracteres');

export const createAlunoSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  cpf: z.string().regex(cpfRegex, 'CPF inválido (ex: 12345678901 ou 123.456.789-01)'),
  rg: z.string().min(5, 'RG inválido'),
  endereco: z.string().min(5, 'Endereço deve ter ao menos 5 caracteres'),
  curso: z.string().min(2, 'Curso deve ter ao menos 2 caracteres'),
  instituicaoId: z.string().min(1, 'Instituição é obrigatória'),
  senha: senhaSchema,
});

export const updateAlunoSchema = createAlunoSchema.omit({ senha: true }).partial();

export type CreateAlunoInput = z.infer<typeof createAlunoSchema>;
export type UpdateAlunoInput = z.infer<typeof updateAlunoSchema>;
