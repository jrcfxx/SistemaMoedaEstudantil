import { useEffect, useState, useCallback } from 'react';
import { ArrowDownCircle, ShoppingBag, ReceiptText, Coins } from 'lucide-react';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { alunoService } from '../../services/alunoService';
import { vantagemService } from '../../services/vantagemService';
import { authService } from '../../services/authService';
import { TransacaoMoeda, Resgate } from '../../types';

const TIPO_CONFIG = {
  ENVIO: { label: 'Moedas recebidas', icon: ArrowDownCircle, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', sinal: '+' },
  RECEBIMENTO: { label: 'Recebimento', icon: ArrowDownCircle, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', sinal: '+' },
  RESGATE: { label: 'Resgate de vantagem', icon: ShoppingBag, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', sinal: '-' },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export default function ExtratoAluno() {
  const [transacoes, setTransacoes] = useState<TransacaoMoeda[]>([]);
  const [resgates, setResgates] = useState<Resgate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [aba, setAba] = useState<'transacoes' | 'cupons'>('transacoes');

  const user = authService.getUser();
  const alunoId = user?.alunoId;

  const load = useCallback(async () => {
    if (!alunoId) return;
    setLoading(true);
    try {
      const [t, r] = await Promise.all([
        alunoService.findTransacoes(alunoId),
        vantagemService.findResgatesByAluno(alunoId),
      ]);
      setTransacoes(t);
      setResgates(r);
      setError('');
    } catch {
      setError('Erro ao carregar extrato.');
    } finally {
      setLoading(false);
    }
  }, [alunoId]);

  useEffect(() => { load(); }, [load]);

  if (!alunoId) {
    return (
      <div className="card p-8 text-center text-slate-500">
        Seu usuário não está vinculado a um cadastro de aluno.
      </div>
    );
  }

  const totalRecebido = transacoes.filter(t => t.tipo !== 'RESGATE').reduce((s, t) => s + t.valor, 0);
  const totalGasto = transacoes.filter(t => t.tipo === 'RESGATE').reduce((s, t) => s + t.valor, 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <ReceiptText className="w-6 h-6 text-indigo-600" />
        <h1 className="text-xl font-bold text-slate-800">Meu Extrato</h1>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4 flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-xl">
            <ArrowDownCircle className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Total recebido</p>
            <p className="text-xl font-bold text-green-700">🪙 {totalRecebido}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-4">
          <div className="p-3 bg-red-100 rounded-xl">
            <ShoppingBag className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Total gasto</p>
            <p className="text-xl font-bold text-red-600">🪙 {totalGasto}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-4">
          <div className="p-3 bg-indigo-100 rounded-xl">
            <Coins className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Cupons resgatados</p>
            <p className="text-xl font-bold text-indigo-700">{resgates.length}</p>
          </div>
        </div>
      </div>

      {/* Abas */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setAba('transacoes')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${aba === 'transacoes' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Transações ({transacoes.length})
        </button>
        <button
          onClick={() => setAba('cupons')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${aba === 'cupons' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Meus Cupons ({resgates.length})
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg border border-red-200">{error}</div>
      )}

      <div className="card p-0 overflow-hidden">
        {loading ? (
          <Spinner message="Carregando extrato..." />
        ) : aba === 'transacoes' ? (
          transacoes.length === 0 ? (
            <EmptyState icon={ReceiptText} title="Nenhuma transação" description="Você ainda não recebeu ou gastou moedas." />
          ) : (
            <div className="divide-y divide-slate-100">
              {transacoes.map((t) => {
                const cfg = TIPO_CONFIG[t.tipo] || TIPO_CONFIG.ENVIO;
                const Icon = cfg.icon;
                return (
                  <div key={t.id} className="flex items-center gap-4 px-5 py-4">
                    <div className={`p-2.5 rounded-xl ${cfg.bg} border ${cfg.border} flex-shrink-0`}>
                      <Icon className={`w-4 h-4 ${cfg.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{t.motivo}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {cfg.label}
                        {t.professor && ` • Prof. ${t.professor.nome}`}
                        {t.vantagem && ` • ${t.vantagem.titulo}`}
                      </p>
                      <p className="text-xs text-slate-400">{formatDate(t.createdAt)}</p>
                    </div>
                    <span className={`text-sm font-bold whitespace-nowrap ${cfg.color}`}>
                      {cfg.sinal}🪙 {t.valor}
                    </span>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          resgates.length === 0 ? (
            <EmptyState icon={ShoppingBag} title="Nenhum cupom" description="Você ainda não resgatou nenhuma vantagem." />
          ) : (
            <div className="divide-y divide-slate-100">
              {resgates.map((r) => (
                <div key={r.id} className="px-5 py-4 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{r.vantagem?.titulo}</p>
                    {r.vantagem?.empresa && (
                      <p className="text-xs text-indigo-500 mt-0.5">{r.vantagem.empresa.nome}</p>
                    )}
                    <p className="text-xs text-slate-400 mt-1">{formatDate(r.createdAt)}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span
                      className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-1.5 ${r.status === 'UTILIZADO' ? 'bg-slate-100 text-slate-500' : 'bg-green-100 text-green-700'}`}
                    >
                      {r.status === 'UTILIZADO' ? 'Utilizado' : 'Ativo'}
                    </span>
                    <p className="font-mono text-sm font-bold text-indigo-700 tracking-wider">{r.codigoCupom}</p>
                    <p className="text-xs text-amber-600 mt-0.5">🪙 {r.vantagem?.custoMoedas}</p>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
