import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { professorService } from '../../services/professorService';
import { instituicaoService } from '../../services/instituicaoService';
import { Professor, Instituicao } from '../../types';

const cpfRegex = /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/;

const schema = z.object({
  nome: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  cpf: z.string().regex(cpfRegex, 'CPF inválido (ex: 123.456.789-01)'),
  departamento: z.string().min(2, 'Departamento deve ter ao menos 2 caracteres'),
  instituicaoId: z.string().min(1, 'Selecione uma instituição'),
});

const schemaEdit = schema.omit({ senha: true, email: true });

type FormData = z.infer<typeof schema>;

interface ProfessorFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  professor?: Professor;
}

export function ProfessorForm({ open, onClose, onSuccess, professor }: ProfessorFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [instituicoes, setInstituicoes] = useState<Instituicao[]>([]);
  const isEdit = !!professor;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(isEdit ? schemaEdit : schema),
  });

  useEffect(() => {
    instituicaoService.findAll().then(setInstituicoes).catch(() => {});
  }, []);

  useEffect(() => {
    if (open) {
      reset(
        professor
          ? { nome: professor.nome, cpf: professor.cpf, departamento: professor.departamento, instituicaoId: professor.instituicaoId }
          : { nome: '', email: '', senha: '', cpf: '', departamento: '', instituicaoId: '' },
      );
      setError('');
    }
  }, [open, professor, reset]);

  const onSubmit = async (data: FormData | z.infer<typeof schemaEdit>) => {
    setLoading(true);
    setError('');
    try {
      if (isEdit) {
        await professorService.update(professor.id, data);
      } else {
        await professorService.create(data as FormData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar professor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Editar Professor' : 'Novo Professor'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Input
              label="Nome completo"
              placeholder="Maria Oliveira"
              error={errors.nome?.message}
              required
              {...register('nome')}
            />
          </div>
          <Input
            label="CPF"
            placeholder="123.456.789-01"
            error={errors.cpf?.message}
            required
            {...register('cpf')}
          />
          {!isEdit && (
            <>
              <Input
                label="E-mail de acesso"
                type="email"
                placeholder="professor@instituicao.edu.br"
                error={errors.email?.message}
                required
                {...register('email')}
              />
              <Input
                label="Senha de acesso"
                type="password"
                placeholder="Mínimo 6 caracteres"
                error={errors.senha?.message}
                required
                {...register('senha')}
              />
            </>
          )}
          <Input
            label="Departamento"
            placeholder="Ciência da Computação"
            error={errors.departamento?.message}
            required
            {...register('departamento')}
          />
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
            {isEdit ? 'Salvar alterações' : 'Cadastrar professor'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
