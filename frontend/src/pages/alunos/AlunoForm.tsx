import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { alunoService } from '../../services/alunoService';
import { instituicaoService } from '../../services/instituicaoService';
import { Aluno, Instituicao } from '../../types';

const cpfRegex = /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/;

const schema = z.object({
  nome: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  cpf: z.string().regex(cpfRegex, 'CPF inválido (ex: 123.456.789-01)'),
  rg: z.string().min(5, 'RG inválido'),
  endereco: z.string().min(5, 'Endereço deve ter ao menos 5 caracteres'),
  curso: z.string().min(2, 'Curso deve ter ao menos 2 caracteres'),
  instituicaoId: z.string().min(1, 'Selecione uma instituição'),
});

const schemaEdit = schema.omit({ senha: true });

type FormData = z.infer<typeof schema>;
type FormDataEdit = z.infer<typeof schemaEdit>;

interface AlunoFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  aluno?: Aluno;
}

export function AlunoForm({ open, onClose, onSuccess, aluno }: AlunoFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [instituicoes, setInstituicoes] = useState<Instituicao[]>([]);
  const isEdit = !!aluno;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(isEdit ? schemaEdit : schema),
    defaultValues: aluno
      ? {
          nome: aluno.nome,
          email: aluno.email,
          cpf: aluno.cpf,
          rg: aluno.rg,
          endereco: aluno.endereco,
          curso: aluno.curso,
          instituicaoId: aluno.instituicaoId,
        }
      : undefined,
  });

  useEffect(() => {
    instituicaoService.findAll().then(setInstituicoes).catch(() => {});
  }, []);

  useEffect(() => {
    if (open) {
      reset(
        aluno
          ? {
              nome: aluno.nome,
              email: aluno.email,
              cpf: aluno.cpf,
              rg: aluno.rg,
              endereco: aluno.endereco,
              curso: aluno.curso,
              instituicaoId: aluno.instituicaoId,
            }
          : { nome: '', email: '', senha: '', cpf: '', rg: '', endereco: '', curso: '', instituicaoId: '' },
      );
      setError('');
    }
  }, [open, aluno, reset]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError('');
    try {
      if (isEdit) {
        await alunoService.update(aluno.id, data);
      } else {
        await alunoService.create(data);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar aluno');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Editar Aluno' : 'Novo Aluno'} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Input
              label="Nome completo"
              placeholder="João da Silva"
              error={errors.nome?.message}
              required
              {...register('nome')}
            />
          </div>
          <Input
            label="E-mail"
            type="email"
            placeholder="joao@email.com"
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
            label="CPF"
            placeholder="123.456.789-01"
            error={errors.cpf?.message}
            required
            {...register('cpf')}
          />
          <Input
            label="RG"
            placeholder="MG-12.345.678"
            error={errors.rg?.message}
            required
            {...register('rg')}
          />
          <Input
            label="Curso"
            placeholder="Engenharia de Software"
            error={errors.curso?.message}
            required
            {...register('curso')}
          />
          <div className="sm:col-span-2">
            <Input
              label="Endereço"
              placeholder="Rua das Flores, 123 — Belo Horizonte, MG"
              error={errors.endereco?.message}
              required
              {...register('endereco')}
            />
          </div>
          <div className="sm:col-span-2">
            <Select
              label="Instituição de Ensino"
              options={instituicoes.map((i) => ({ value: i.id, label: i.nome }))}
              placeholder="Selecione a instituição..."
              error={errors.instituicaoId?.message}
              required
              {...register('instituicaoId')}
            />
          </div>
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
            {isEdit ? 'Salvar alterações' : 'Cadastrar aluno'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
