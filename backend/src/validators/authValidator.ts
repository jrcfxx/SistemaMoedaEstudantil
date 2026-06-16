import { z } from 'zod';

const cpfRegex = /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/;
const cnpjRegex = /^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}$/;
const senhaSchema = z.string().min(6, 'Senha deve ter pelo menos 6 caracteres');

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  senha: senhaSchema,
});

export const registerSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  senha: senhaSchema,
  tipo: z.enum(['ALUNO', 'PROFESSOR', 'EMPRESA'], {
    errorMap: () => ({ message: 'Tipo inválido. Use ALUNO, PROFESSOR ou EMPRESA' }),
  }),
});

export const registerAlunoSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  senha: senhaSchema,
  cpf: z.string().regex(cpfRegex, 'CPF inválido'),
  rg: z.string().min(5, 'RG inválido'),
  endereco: z.string().min(5, 'Endereço deve ter ao menos 5 caracteres'),
  curso: z.string().min(2, 'Curso deve ter ao menos 2 caracteres'),
  instituicaoId: z.string().min(1, 'Instituição é obrigatória'),
});

export const registerEmpresaSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  senha: senhaSchema,
  cnpj: z.string().regex(cnpjRegex, 'CNPJ inválido'),
  endereco: z.string().min(5, 'Endereço deve ter ao menos 5 caracteres'),
  telefone: z.string().optional(),
});

export const registerAdminSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  senha: senhaSchema,
  tipo: z.enum(['ALUNO', 'PROFESSOR', 'EMPRESA', 'ADMIN'], {
    errorMap: () => ({ message: 'Tipo inválido' }),
  }),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type RegisterAlunoInput = z.infer<typeof registerAlunoSchema>;
export type RegisterEmpresaInput = z.infer<typeof registerEmpresaSchema>;
