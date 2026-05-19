import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertCircle, CheckCircle2, Coins } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { professorService } from '../../services/professorService';
import { alunoService } from '../../services/alunoService';
import { Professor, Aluno } from '../../types';

const schema = z.object({
  alunoId: z.string().min(1, 'Selecione um aluno'),
  valor: z
    .number({ invalid_type_error: 'Informe um valor' })
    .int('O valor deve ser inteiro')
    .min(1, 'O valor mínimo é 1 moeda'),
  motivo: z
    .string()
    .min(1, 'O motivo é obrigatório')
    .max(500, 'Motivo muito longo (máx. 500 caracteres)'),
});

type FormData = z.infer<typeof schema>;

interface DistribuirMoedasModalProps {
  open: boolean;
  professor: Professor;
  onClose: () => void;
  onSuccess: () => void;
}

export function DistribuirMoedasModal({
  open,
  professor,
  onClose,
  onSuccess,
}: DistribuirMoedasModalProps) {
  const [loading, setLoading] = useState(false);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [error, setError] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [saldoAtual, setSaldoAtual] = useState(professor.saldoMoedas);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { alunoId: '', valor: undefined, motivo: '' },
  });

  const valorDigitado = watch('valor');
  const saldoRestante = saldoAtual - (Number(valorDigitado) || 0);
  const saldoInsuficiente = saldoRestante < 0;

  useEffect(() => {
    alunoService.findAll().then(setAlunos).catch(() => {});
  }, []);

  useEffect(() => {
    if (open) {
      reset({ alunoId: '', valor: undefined, motivo: '' });
      setSaldoAtual(professor.saldoMoedas);
      setError('');
      setSucesso('');
    }
  }, [open, professor, reset]);

  const onSubmit = async (data: FormData) => {
    if (saldoInsuficiente) return;
    setLoading(true);
    setError('');
    setSucesso('');
    try {
      const result = await professorService.distribuirMoedas(professor.id, data);
      setSaldoAtual(result.saldoProfessor);
      const alunoNome = alunos.find((a) => a.id === data.alunoId)?.nome ?? 'aluno';
      setSucesso(`${data.valor} moeda(s) enviada(s) para ${alunoNome} com sucesso!`);
      reset({ alunoId: '', valor: undefined, motivo: '' });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao distribuir moedas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Distribuir Moedas">
      <div className="space-y-5">
        {/* Saldo atual */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-indigo-500 font-medium uppercase tracking-wide">Saldo disponível</p>
            <p className="text-2xl font-bold text-indigo-700 mt-0.5">
              🪙 {saldoAtual}
            </p>
          </div>
          <Coins className="w-8 h-8 text-indigo-300" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Select
            label="Aluno destinatário"
            options={alunos.map((a) => ({ value: a.id, label: `${a.nome} — ${a.curso}` }))}
            placeholder="Selecione o aluno..."
            error={errors.alunoId?.message}
            required
            {...register('alunoId')}
          />

          <div>
            <label className="label">
              Quantidade de moedas <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={1}
              max={saldoAtual}
              placeholder="Ex: 50"
              className={`input-field ${saldoInsuficiente ? 'border-red-400 focus:ring-red-300' : ''}`}
              {...register('valor', { valueAsNumber: true })}
            />
            {errors.valor && (
              <p className="text-red-500 text-xs mt-1">{errors.valor.message}</p>
            )}
            {valorDigitado > 0 && (
              <p className={`text-xs mt-1 font-medium ${saldoInsuficiente ? 'text-red-600' : 'text-slate-500'}`}>
                {saldoInsuficiente
                  ? `Saldo insuficiente — faltam ${Math.abs(saldoRestante)} moeda(s)`
                  : `Saldo restante após envio: 🪙 ${saldoRestante}`}
              </p>
            )}
          </div>

          <div>
            <label className="label">
              Motivo <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="Ex: Excelente participação em aula, apresentação do trabalho final..."
              className={`input-field resize-none ${errors.motivo ? 'border-red-400 focus:ring-red-300' : ''}`}
              {...register('motivo')}
            />
            {errors.motivo && (
              <p className="text-red-500 text-xs mt-1">{errors.motivo.message}</p>
            )}
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-red-50 text-red-700 text-sm px-3 py-2.5 rounded-lg border border-red-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          {sucesso && (
            <div className="flex items-start gap-2 bg-green-50 text-green-700 text-sm px-3 py-2.5 rounded-lg border border-green-200">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
              {sucesso}
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1" disabled={loading}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1"
              loading={loading}
              disabled={saldoInsuficiente}
            >
              Enviar moedas
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
