import { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, Gift, Copy, Check } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { vantagemService } from '../../services/vantagemService';
import { alunoService } from '../../services/alunoService';
import { authService } from '../../services/authService';
import { Vantagem, Resgate } from '../../types';

type Etapa = 'confirmar' | 'sucesso';

interface ResgateModalProps {
  open: boolean;
  vantagem: Vantagem;
  onClose: () => void;
}

export function ResgateModal({ open, vantagem, onClose }: ResgateModalProps) {
  const [etapa, setEtapa] = useState<Etapa>('confirmar');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resgate, setResgate] = useState<Resgate | null>(null);
  const [saldoAtual, setSaldoAtual] = useState<number | null>(null);
  const [saldoRestante, setSaldoRestante] = useState(0);
  const [copiado, setCopiado] = useState(false);

  const user = authService.getUser();

  useEffect(() => {
    if (!open) return;
    setEtapa('confirmar');
    setError('');
    setResgate(null);
    setCopiado(false);

    if (user?.alunoId) {
      vantagemService.findResgatesByAluno(user.alunoId)
        .then(() => {})
        .catch(() => {});
    }
  }, [open, user?.id]);

  useEffect(() => {
    if (!open || !user?.alunoId) return;
    alunoService.findById(user.alunoId).then((a) => setSaldoAtual(a.saldoMoedas)).catch(() => {});
  }, [open, user?.alunoId]);

  const saldoSuficiente = saldoAtual !== null && saldoAtual >= vantagem.custoMoedas;
  const semCadastroAluno = !user?.alunoId && user?.tipo !== 'ADMIN';

  const handleConfirmar = async () => {
    setLoading(true);
    setError('');
    try {
      const body = user?.tipo === 'ALUNO'
        ? { vantagemId: vantagem.id }
        : { alunoId: user?.alunoId, vantagemId: vantagem.id };
      const result = await vantagemService.resgatar(body as { alunoId: string; vantagemId: string });
      setResgate(result.resgate);
      setSaldoRestante(result.saldoRestante);
      setEtapa('sucesso');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao resgatar vantagem');
    } finally {
      setLoading(false);
    }
  };

  const handleCopiar = () => {
    if (!resgate) return;
    navigator.clipboard.writeText(resgate.codigoCupom);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <Modal open={open} onClose={onClose} title="Resgatar Vantagem">
      {etapa === 'confirmar' ? (
        <div className="space-y-5">
          {/* Card da vantagem */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-800">{vantagem.titulo}</p>
                <p className="text-slate-500 text-sm mt-1">{vantagem.descricao}</p>
                {vantagem.empresa && (
                  <p className="text-xs text-indigo-500 mt-1 font-medium">{vantagem.empresa.nome}</p>
                )}
              </div>
              <span className="text-amber-600 font-bold text-lg whitespace-nowrap">
                🪙 {vantagem.custoMoedas}
              </span>
            </div>
          </div>

          {/* Saldo */}
          {semCadastroAluno ? (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-amber-700 text-sm">
              Seu usuário não está vinculado a um cadastro de aluno.
            </div>
          ) : saldoAtual !== null ? (
            <div className={`rounded-xl px-4 py-3 border flex items-center justify-between ${saldoSuficiente ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div>
                <p className={`text-xs font-medium uppercase tracking-wide ${saldoSuficiente ? 'text-green-600' : 'text-red-500'}`}>
                  Seu saldo atual
                </p>
                <p className={`text-xl font-bold mt-0.5 ${saldoSuficiente ? 'text-green-700' : 'text-red-600'}`}>
                  🪙 {saldoAtual}
                </p>
              </div>
              {saldoSuficiente
                ? <CheckCircle2 className="w-6 h-6 text-green-400" />
                : <AlertCircle className="w-6 h-6 text-red-400" />}
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-500 text-sm animate-pulse">
              Carregando saldo...
            </div>
          )}

          {!saldoSuficiente && saldoAtual !== null && (
            <p className="text-red-600 text-sm text-center">
              Saldo insuficiente — faltam 🪙 {vantagem.custoMoedas - saldoAtual} moeda(s).
            </p>
          )}

          {error && (
            <div className="flex items-start gap-2 bg-red-50 text-red-700 text-sm px-3 py-2.5 rounded-lg border border-red-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1" disabled={loading}>
              Cancelar
            </Button>
            <Button
              className="flex-1"
              onClick={handleConfirmar}
              loading={loading}
              disabled={semCadastroAluno || !saldoSuficiente}
            >
              <Gift className="w-4 h-4" />
              Confirmar resgate
            </Button>
          </div>
        </div>
      ) : (
        /* Etapa de sucesso — exibe o cupom */
        <div className="space-y-5 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9 text-green-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Resgate realizado!</h3>
              <p className="text-slate-500 text-sm mt-1">
                Apresente o código abaixo na troca presencial.
              </p>
            </div>
          </div>

          {/* Código do cupom */}
          <div className="bg-indigo-50 border-2 border-dashed border-indigo-300 rounded-2xl px-6 py-5">
            <p className="text-xs text-indigo-400 font-semibold uppercase tracking-widest mb-2">
              Código do Cupom
            </p>
            <p className="font-mono text-2xl font-bold text-indigo-700 tracking-widest">
              {resgate?.codigoCupom}
            </p>
            <button
              onClick={handleCopiar}
              className="mt-3 inline-flex items-center gap-1.5 text-xs text-indigo-500 hover:text-indigo-700 transition-colors"
            >
              {copiado ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiado ? 'Copiado!' : 'Copiar código'}
            </button>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 text-left space-y-1">
            <p className="text-sm font-medium text-slate-700">{vantagem.titulo}</p>
            {vantagem.empresa && (
              <p className="text-xs text-slate-500">{vantagem.empresa.nome}</p>
            )}
            <p className="text-xs text-amber-600 font-semibold mt-1">
              Saldo restante: 🪙 {saldoRestante}
            </p>
          </div>

          <Button className="w-full" onClick={onClose}>
            Concluir
          </Button>
        </div>
      )}
    </Modal>
  );
}
