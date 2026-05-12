import { z } from 'zod';

const cnpjRegex = /^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}$/;

export const createEmpresaParceiraSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  cnpj: z.string().regex(cnpjRegex, 'CNPJ inválido (ex: 12345678000195 ou 12.345.678/0001-95)'),
  endereco: z.string().min(5, 'Endereço deve ter ao menos 5 caracteres'),
  telefone: z.string().optional(),
  status: z.enum(['ATIVA', 'INATIVA']).optional().default('ATIVA'),
});

export const updateEmpresaParceiraSchema = createEmpresaParceiraSchema.partial();

export type CreateEmpresaParceiraInput = z.infer<typeof createEmpresaParceiraSchema>;
export type UpdateEmpresaParceiraInput = z.infer<typeof updateEmpresaParceiraSchema>;
