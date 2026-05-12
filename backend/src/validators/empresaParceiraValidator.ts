import { z } from 'zod'

const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$|^\d{14}$/

export const createEmpresaParceiraSchema = z.object({
  nome: z
    .string({ required_error: 'Nome é obrigatório' })
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(120),

  email: z
    .string({ required_error: 'E-mail é obrigatório' })
    .email('E-mail inválido')
    .toLowerCase(),

  cnpj: z
    .string({ required_error: 'CNPJ é obrigatório' })
    .regex(cnpjRegex, 'CNPJ inválido. Use 00.000.000/0000-00 ou apenas os 14 dígitos'),

  endereco: z
    .string({ required_error: 'Endereço é obrigatório' })
    .min(5, 'Endereço muito curto'),

  telefone: z
    .string()
    .min(8, 'Telefone muito curto')
    .max(20)
    .optional(),
})

export const updateEmpresaParceiraSchema = createEmpresaParceiraSchema
  .partial()
  .extend({
    status: z.enum(['ATIVA', 'INATIVA']).optional(),
  })

export type CreateEmpresaParceiraInput = z.infer<typeof createEmpresaParceiraSchema>
export type UpdateEmpresaParceiraInput = z.infer<typeof updateEmpresaParceiraSchema>
