import { useEffect, useState, useCallback } from 'react';
import { ArrowUpCircle, ReceiptText, Coins, Users } from 'lucide-react';
import { CoinAmount } from '../../components/ui/CoinIcon';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { professorService } from '../../services/professorService';
import { authService } from '../../services/authService';
import { TransacaoMoeda } from '../../types';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export default function ExtratoProfessor() {
  const [transacoes, setTransacoes] = useState<TransacaoMoeda[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const user = authService.getUser();
  const professorId = user?.professorId;

  const load = useCallback(async () => {
    if (!professorId) return;
    setLoading(true);
    try {
      const data = await professorService.findTransacoes(professorId);
      setTransacoes(data);
      setError('');
    } catch {
      setError('Erro ao carregar extrato.');
    } finally {
      setLoading(false);
    }
  }, [professorId]);

  useEffect(() => { load(); }, [load]);

  if (!professorId) {
    return (
      <div className="card p-8 text-center text-slate-500">
        Seu usuário não está vinculado a um cadastro de professor.
      </div>
    );
  }

  const totalDistribuido = transacoes.reduce((s, t) => s + t.valor, 0);
  const alunosAtendidos = new Set(transacoes.map(t => t.alunoId)).size;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <ReceiptText className="w-6 h-6 text-indigo-600" />
        <h1 className="text-xl font-bold text-slate-800">Extrato do Professor</h1>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4 flex items-center gap-4">
          <div className="p-3 bg-indigo-100 rounded-xl">
            <ArrowUpCircle className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Total distribuído</p>
            <p className="text-xl font-bold text-indigo-700"><CoinAmount amount={totalDistribuido} iconClassName="text-indigo-600" /></p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-4">
          <div className="p-3 bg-amber-100 rounded-xl">
            <Coins className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Transações</p>
            <p className="text-xl font-bold text-amber-700">{transacoes.length}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-xl">
            <Users className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Alunos beneficiados</p>
            <p className="text-xl font-bold text-green-700">{alunosAtendidos}</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg border border-red-200">{error}</div>
      )}

      <div className="card p-0 overflow-hidden">
        {loading ? (
          <Spinner message="Carregando extrato..." />
        ) : transacoes.length === 0 ? (
          <EmptyState
            icon={ReceiptText}
            title="Nenhuma distribuição"
            description="Você ainda não distribuiu moedas para nenhum aluno."
          />
        ) : (
          <div className="divide-y divide-slate-100">
            {transacoes.map((t) => (
              <div key={t.id} className="flex items-center gap-4 px-5 py-4">
                <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200 flex-shrink-0">
                  <ArrowUpCircle className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{t.motivo}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Para: <span className="font-medium text-slate-600">{t.aluno?.nome}</span>
                    {t.aluno?.email && ` • ${t.aluno.email}`}
                  </p>
                  <p className="text-xs text-slate-400">{formatDate(t.createdAt)}</p>
                </div>
                <span className="text-sm font-bold text-indigo-600 whitespace-nowrap inline-flex items-center gap-1">
                  -<CoinAmount amount={t.valor} iconSize={14} iconClassName="text-indigo-600" />
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
