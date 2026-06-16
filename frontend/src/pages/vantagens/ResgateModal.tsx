import { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, Gift, Copy, Check, RefreshCw } from 'lucide-react';
import { CoinAmount } from '../../components/ui/CoinIcon';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { vantagemService } from '../../services/vantagemService';
import { alunoService } from '../../services/alunoService';
import { authService } from '../../services/authService';
import { useSaldo } from '../../contexts/SaldoContext';
import { api } from '../../services/api';
import { Vantagem, Resgate } from '../../types';

type Etapa = 'confirmar' | 'sucesso';

interface ResgateModalProps {
  open: boolean;
  vantagem: Vantagem;
  onClose: () => void;
}

export function ResgateModal({ open, vantagem, onClose }: ResgateModalProps) {
  const { refreshSaldo } = useSaldo();
  const [etapa, setEtapa] = useState<Etapa>('confirmar');
  const [loading, setLoading] = useState(false);
  const [loadingSaldo, setLoadingSaldo] = useState(false);
  const [error, setError] = useState('');
  const [erroSaldo, setErroSaldo] = useState(false);
  const [resgate, setResgate] = useState<Resgate | null>(null);
  const [saldoAtual, setSaldoAtual] = useState<number | null>(null);
  const [saldoRestante, setSaldoRestante] = useState(0);
  const [copiado, setCopiado] = useState(false);

  const user = authService.getUser();

  // Busca o alunoId atualizado do servidor e depois o saldo
  async function carregarSaldo() {
    setLoadingSaldo(true);
    setErroSaldo(false);
    setSaldoAtual(null);
    try {
      // Sempre busca o perfil fresco para garantir alunoId atualizado
      const { data: perfil } = await api.get('/auth/me');
      // Atualiza localStorage com dados frescos
      const userAtualizado = { ...user, ...perfil };
      localStorage.setItem('auth_user', JSON.stringify(userAtualizado));

      if (perfil.alunoId) {
        const aluno = await alunoService.findById(perfil.alunoId);
        setSaldoAtual(aluno.saldoMoedas);
      } else {
        setErroSaldo(true);
      }
    } catch {
      setErroSaldo(true);
    } finally {
      setLoadingSaldo(false);
    }
  }

  useEffect(() => {
    if (!open) return;
    setEtapa('confirmar');
    setError('');
    setResgate(null);
    setCopiado(false);
    carregarSaldo();
  }, [open]);

  const saldoSuficiente = saldoAtual !== null && saldoAtual >= vantagem.custoMoedas;

  const handleConfirmar = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await vantagemService.resgatar({ vantagemId: vantagem.id });
      setResgate(result.resgate);
      setSaldoRestante(result.saldoRestante);
      await refreshSaldo();
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
        <div className="space-y-4">
          {/* Vantagem */}
          <div className="flex gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4">
            {vantagem.fotoUrl && (
              <img
                src={vantagem.fotoUrl}
                alt={vantagem.titulo}
                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-slate-800 text-sm leading-tight">{vantagem.titulo}</p>
                <CoinAmount
                  amount={vantagem.custoMoedas}
                  className="text-amber-600 font-bold text-base whitespace-nowrap ml-2"
                  iconClassName="text-amber-600"
                  iconSize={18}
                />
              </div>
              <p className="text-slate-500 text-xs mt-1 line-clamp-2">{vantagem.descricao}</p>
              {vantagem.empresa && (
                <p className="text-xs text-indigo-500 mt-1 font-medium">{vantagem.empresa.nome}</p>
              )}
            </div>
          </div>

          {/* Saldo */}
          {loadingSaldo ? (
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 flex items-center gap-2 text-slate-500 text-sm">
              <RefreshCw className="w-4 h-4 animate-spin" />
              Carregando saldo...
            </div>
          ) : erroSaldo ? (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
              <p className="text-amber-700 text-sm">Não foi possível carregar o saldo.</p>
              <button
                onClick={carregarSaldo}
                className="text-xs text-amber-700 underline hover:no-underline whitespace-nowrap"
              >
                Tentar novamente
              </button>
            </div>
          ) : saldoAtual !== null ? (
            <div className={`rounded-xl px-4 py-3 border flex items-center justify-between ${saldoSuficiente ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div>
                <p className={`text-xs font-medium uppercase tracking-wide ${saldoSuficiente ? 'text-green-600' : 'text-red-500'}`}>
                  Seu saldo atual
                </p>
                <CoinAmount
                  amount={saldoAtual}
                  className={`text-2xl font-bold mt-0.5 ${saldoSuficiente ? 'text-green-700' : 'text-red-600'}`}
                  iconClassName={saldoSuficiente ? 'text-green-600' : 'text-red-500'}
                  iconSize={24}
                />
                {!saldoSuficiente && (
                  <p className="text-red-500 text-xs mt-0.5 inline-flex items-center gap-1 flex-wrap">
                    Faltam
                    <CoinAmount
                      amount={vantagem.custoMoedas - saldoAtual}
                      suffix="moeda(s)"
                      iconSize={12}
                      iconClassName="text-red-500"
                    />
                  </p>
                )}
              </div>
              {saldoSuficiente
                ? <CheckCircle2 className="w-7 h-7 text-green-400" />
                : <AlertCircle className="w-7 h-7 text-red-400" />}
            </div>
          ) : null}

          {error && (
            <div className="flex items-start gap-2 bg-red-50 text-red-700 text-sm px-3 py-2.5 rounded-lg border border-red-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1" disabled={loading}>
              Cancelar
            </Button>
            <Button
              className="flex-1"
              onClick={handleConfirmar}
              loading={loading}
              disabled={loadingSaldo || erroSaldo || !saldoSuficiente}
            >
              <Gift className="w-4 h-4" />
              Confirmar resgate
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-5 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9 text-green-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Resgate realizado!</h3>
              <p className="text-slate-500 text-sm mt-1">Apresente o código abaixo na troca presencial.</p>
            </div>
          </div>

          <div className="bg-indigo-50 border-2 border-dashed border-indigo-300 rounded-2xl px-6 py-5">
            <p className="text-xs text-indigo-400 font-semibold uppercase tracking-widest mb-2">Código do Cupom</p>
            <p className="font-mono text-2xl font-bold text-indigo-700 tracking-widest">{resgate?.codigoCupom}</p>
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
            {vantagem.empresa && <p className="text-xs text-slate-500">{vantagem.empresa.nome}</p>}
            <p className="text-xs text-amber-600 font-semibold mt-1 inline-flex items-center gap-1">
              Saldo restante:
              <CoinAmount amount={saldoRestante} iconSize={14} iconClassName="text-amber-600" />
            </p>
          </div>

          <Button className="w-full" onClick={onClose}>Concluir</Button>
        </div>
      )}
    </Modal>
  );
}
