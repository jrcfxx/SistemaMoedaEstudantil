import { z } from 'zod';

export const createInstituicaoSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
});

export const updateInstituicaoSchema = createInstituicaoSchema.partial();

export type CreateInstituicaoInput = z.infer<typeof createInstituicaoSchema>;
export type UpdateInstituicaoInput = z.infer<typeof updateInstituicaoSchema>;
