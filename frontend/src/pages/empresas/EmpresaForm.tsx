import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { empresaService } from '../../services/empresaService';
import { EmpresaParceira } from '../../types';

const cnpjRegex = /^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}$/;

const schema = z.object({
  nome: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  cnpj: z.string().regex(cnpjRegex, 'CNPJ inválido (ex: 12.345.678/0001-95)'),
  endereco: z.string().min(5, 'Endereço deve ter ao menos 5 caracteres'),
  telefone: z.string().optional(),
  status: z.enum(['ATIVA', 'INATIVA']).optional().default('ATIVA'),
});

const schemaEdit = schema.omit({ senha: true });

type FormData = z.infer<typeof schema>;

interface EmpresaFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  empresa?: EmpresaParceira;
}

export function EmpresaForm({ open, onClose, onSuccess, empresa }: EmpresaFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isEdit = !!empresa;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(isEdit ? schemaEdit : schema),
  });

  useEffect(() => {
    if (open) {
      reset(
        empresa
          ? {
              nome: empresa.nome,
              email: empresa.email,
              cnpj: empresa.cnpj,
              endereco: empresa.endereco,
              telefone: empresa.telefone ?? '',
              status: empresa.status,
            }
          : { nome: '', email: '', senha: '', cnpj: '', endereco: '', telefone: '', status: 'ATIVA' },
      );
      setError('');
    }
  }, [open, empresa, reset]);

  const onSubmit = async (data: FormData | z.infer<typeof schemaEdit>) => {
    setLoading(true);
    setError('');
    try {
      if (isEdit) {
        await empresaService.update(empresa.id, data);
      } else {
        await empresaService.create(data as FormData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar empresa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Editar Empresa Parceira' : 'Nova Empresa Parceira'}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Input
              label="Nome da empresa"
              placeholder="Empresa Exemplo Ltda."
              error={errors.nome?.message}
              required
              {...register('nome')}
            />
          </div>
          <Input
            label="E-mail"
            type="email"
            placeholder="contato@empresa.com"
            error={errors.email?.message}
            required
            {...register('email')}
          />
          {!isEdit && (
            <Input
              label="Senha de acesso"
              type="password"
              placeholder="Mínimo 6 caracteres"
              error={errors.senha?.message}
              required
              {...register('senha')}
            />
          )}
          <Input
            label="CNPJ"
            placeholder="12.345.678/0001-95"
            error={errors.cnpj?.message}
            required
            {...register('cnpj')}
          />
          <div className="sm:col-span-2">
            <Input
              label="Endereço"
              placeholder="Av. Paulista, 1000 — São Paulo, SP"
              error={errors.endereco?.message}
              required
              {...register('endereco')}
            />
          </div>
          <Input
            label="Telefone"
            type="tel"
            placeholder="(31) 99999-9999"
            {...register('telefone')}
          />
          <Select
            label="Status"
            options={[
              { value: 'ATIVA', label: 'Ativa' },
              { value: 'INATIVA', label: 'Inativa' },
            ]}
            {...register('status')}
          />
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1" disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" className="flex-1" loading={loading}>
            {isEdit ? 'Salvar alterações' : 'Cadastrar empresa'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
