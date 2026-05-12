import { z } from 'zod'

const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/

export const createAlunoSchema = z.object({
  nome: z
    .string({ required_error: 'Nome é obrigatório' })
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(120),

  email: z
    .string({ required_error: 'E-mail é obrigatório' })
    .email('E-mail inválido')
    .toLowerCase(),

  cpf: z
    .string({ required_error: 'CPF é obrigatório' })
    .regex(cpfRegex, 'CPF inválido. Use 000.000.000-00 ou apenas os 11 dígitos'),

  rg: z
    .string({ required_error: 'RG é obrigatório' })
    .min(4, 'RG muito curto')
    .max(20, 'RG muito longo'),

  endereco: z
    .string({ required_error: 'Endereço é obrigatório' })
    .min(5, 'Endereço muito curto'),

  curso: z
    .string({ required_error: 'Curso é obrigatório' })
    .min(3, 'Curso deve ter pelo menos 3 caracteres'),

  instituicaoId: z
    .string({ required_error: 'Instituição é obrigatória' })
    .cuid('ID de instituição inválido'),
})

export const updateAlunoSchema = createAlunoSchema.partial()

export type CreateAlunoInput = z.infer<typeof createAlunoSchema>
export type UpdateAlunoInput = z.infer<typeof updateAlunoSchema>
