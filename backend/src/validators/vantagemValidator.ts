import { z } from 'zod';

export const createVantagemSchema = z.object({
  titulo: z.string().min(2, 'Título deve ter ao menos 2 caracteres'),
  descricao: z.string().min(5, 'Descrição deve ter ao menos 5 caracteres'),
  fotoUrl: z.string().url('URL da foto inválida').optional().or(z.literal('')),
  custoMoedas: z.number().int('Custo deve ser inteiro').min(1, 'Custo mínimo é 1 moeda'),
  empresaParceiraId: z.string().min(1, 'Empresa parceira é obrigatória'),
});

export const updateVantagemSchema = createVantagemSchema.partial().omit({ empresaParceiraId: true });

export const resgateSchema = z.object({
  alunoId: z.string().min(1, 'Aluno é obrigatório'),
  vantagemId: z.string().min(1, 'Vantagem é obrigatória'),
});

export type CreateVantagemInput = z.infer<typeof createVantagemSchema>;
export type UpdateVantagemInput = z.infer<typeof updateVantagemSchema>;
export type ResgateInput = z.infer<typeof resgateSchema>;
