import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { vantagemService } from '../../services/vantagemService';
import { empresaService } from '../../services/empresaService';
import { Vantagem, EmpresaParceira } from '../../types';

const schema = z.object({
  titulo: z.string().min(2, 'Título deve ter ao menos 2 caracteres'),
  descricao: z.string().min(5, 'Descrição deve ter ao menos 5 caracteres'),
  fotoUrl: z.string().url('URL inválida').optional().or(z.literal('')),
  custoMoedas: z
    .number({ invalid_type_error: 'Informe o custo' })
    .int('Deve ser inteiro')
    .min(1, 'Mínimo 1 moeda'),
  empresaParceiraId: z.string().min(1, 'Selecione uma empresa'),
});

type FormData = z.infer<typeof schema>;

interface VantagemFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  vantagem?: Vantagem;
}

export function VantagemForm({ open, onClose, onSuccess, vantagem }: VantagemFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [empresas, setEmpresas] = useState<EmpresaParceira[]>([]);
  const isEdit = !!vantagem;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    empresaService.findAll().then(setEmpresas).catch(() => {});
  }, []);

  useEffect(() => {
    if (open) {
      reset(
        vantagem
          ? {
              titulo: vantagem.titulo,
              descricao: vantagem.descricao,
              fotoUrl: vantagem.fotoUrl ?? '',
              custoMoedas: vantagem.custoMoedas,
              empresaParceiraId: vantagem.empresaParceiraId,
            }
          : { titulo: '', descricao: '', fotoUrl: '', custoMoedas: undefined, empresaParceiraId: '' },
      );
      setError('');
    }
  }, [open, vantagem, reset]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError('');
    try {
      if (isEdit) {
        await vantagemService.update(vantagem.id, data);
      } else {
        await vantagemService.create(data);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar vantagem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Editar Vantagem' : 'Nova Vantagem'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Input
              label="Título"
              placeholder="Desconto no Restaurante Universitário"
              error={errors.titulo?.message}
              required
              {...register('titulo')}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Descrição <span className="text-red-500">*</span></label>
            <textarea
              rows={3}
              placeholder="Descreva os detalhes da vantagem..."
              className={`input-field resize-none ${errors.descricao ? 'border-red-400' : ''}`}
              {...register('descricao')}
            />
            {errors.descricao && <p className="text-red-500 text-xs mt-1">{errors.descricao.message}</p>}
          </div>
          <Input
            label="Custo (em moedas)"
            type="number"
            placeholder="100"
            error={errors.custoMoedas?.message}
            required
            {...register('custoMoedas', { valueAsNumber: true })}
          />
          <Input
            label="URL da foto"
            placeholder="https://..."
            error={errors.fotoUrl?.message}
            {...register('fotoUrl')}
          />
          <div className="sm:col-span-2">
            <Select
              label="Empresa Parceira"
              options={empresas.map((e) => ({ value: e.id, label: e.nome }))}
              placeholder="Selecione a empresa..."
              error={errors.empresaParceiraId?.message}
              required
              disabled={isEdit}
              {...register('empresaParceiraId')}
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
            {isEdit ? 'Salvar alterações' : 'Cadastrar vantagem'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
