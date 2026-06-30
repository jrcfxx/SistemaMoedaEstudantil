import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Building2, School, Coins, Clock, BookOpen, Gift, ReceiptText, Users } from 'lucide-react';
import { CoinAmount } from '../components/ui/CoinIcon';
import { StatCard } from '../components/ui/StatCard';
import { Spinner } from '../components/ui/Spinner';
import { Badge } from '../components/ui/Badge';
import { dashboardService } from '../services/dashboardService';
import { authService } from '../services/authService';
import { useSaldo } from '../contexts/SaldoContext';
import { DashboardStats } from '../types';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function DashboardAluno() {
  const { saldo } = useSaldo();

  return (
    <div className="space-y-6">
      <div className="card p-6 bg-gradient-to-br from-indigo-50 to-white border-indigo-100">
        <p className="text-sm text-indigo-600 font-medium">Seu saldo atual</p>
        <CoinAmount
          amount={saldo ?? 0}
          suffix="moedas"
          className="text-4xl font-bold text-indigo-800 mt-1 gap-2"
          iconClassName="text-indigo-600"
          iconSize={32}
        />
        <p className="text-slate-500 text-sm mt-2">Use suas moedas para resgatar vantagens de empresas parceiras.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link to="/vantagens" className="card p-5 hover:border-indigo-300 transition-colors group">
          <Gift className="w-8 h-8 text-indigo-500 mb-3" />
          <h3 className="font-semibold text-slate-800 group-hover:text-indigo-700">Explorar vantagens</h3>
          <p className="text-sm text-slate-500 mt-1">Veja o catálogo e resgate benefícios.</p>
        </Link>
        <Link to="/extrato" className="card p-5 hover:border-indigo-300 transition-colors group">
          <ReceiptText className="w-8 h-8 text-indigo-500 mb-3" />
          <h3 className="font-semibold text-slate-800 group-hover:text-indigo-700">Meu extrato</h3>
          <p className="text-sm text-slate-500 mt-1">Acompanhe moedas recebidas e cupons.</p>
        </Link>
      </div>
    </div>
  );
}

function DashboardProfessor() {
  const { saldo } = useSaldo();
  const [creditoMsg, setCreditoMsg] = useState<string | null>(null);

  useEffect(() => {
    const valor = sessionStorage.getItem('credito_semestral');
    if (valor) {
      setCreditoMsg(`🎉 Você recebeu +${valor} moedas do crédito semestral!`);
      sessionStorage.removeItem('credito_semestral');
    }
  }, []);

  return (
    <div className="space-y-6">
      {creditoMsg && (
        <div className="bg-emerald-50 text-emerald-800 text-sm px-4 py-3 rounded-xl border border-emerald-200">
          {creditoMsg}
        </div>
      )}
      <div className="card p-6 bg-gradient-to-br from-amber-50 to-white border-amber-100">
        <p className="text-sm text-amber-600 font-medium">Saldo para distribuir</p>
        <CoinAmount
          amount={saldo ?? 0}
          suffix="moedas"
          className="text-4xl font-bold text-amber-800 mt-1 gap-2"
          iconClassName="text-amber-600"
          iconSize={32}
        />
        <p className="text-slate-500 text-sm mt-2">Reconheça o mérito dos seus alunos enviando moedas.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link to="/alunos" className="card p-5 hover:border-indigo-300 transition-colors group">
          <Users className="w-8 h-8 text-indigo-500 mb-3" />
          <h3 className="font-semibold text-slate-800 group-hover:text-indigo-700">Distribuir moedas</h3>
          <p className="text-sm text-slate-500 mt-1">Selecione um aluno e envie moedas com motivo.</p>
        </Link>
        <Link to="/extrato-professor" className="card p-5 hover:border-indigo-300 transition-colors group">
          <ReceiptText className="w-8 h-8 text-indigo-500 mb-3" />
          <h3 className="font-semibold text-slate-800 group-hover:text-indigo-700">Meu extrato</h3>
          <p className="text-sm text-slate-500 mt-1">Veja o histórico de distribuições.</p>
        </Link>
      </div>
    </div>
  );
}

function DashboardEmpresa() {
  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h3 className="font-semibold text-slate-800">Painel da empresa parceira</h3>
        <p className="text-slate-500 text-sm mt-1">Cadastre vantagens para que os alunos possam resgatá-las.</p>
      </div>
      <Link to="/vantagens" className="card p-5 hover:border-indigo-300 transition-colors group inline-block w-full sm:w-auto">
        <Gift className="w-8 h-8 text-indigo-500 mb-3" />
        <h3 className="font-semibold text-slate-800 group-hover:text-indigo-700">Gerenciar vantagens</h3>
        <p className="text-sm text-slate-500 mt-1">Cadastre, edite e acompanhe suas ofertas.</p>
      </Link>
    </div>
  );
}

function DashboardAdmin({ stats }: { stats: DashboardStats }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total de Alunos" value={stats.totalAlunos} icon={GraduationCap} color="violet" description="alunos cadastrados" />
        <StatCard title="Professores" value={stats.totalProfessores} icon={BookOpen} color="blue" description="professores ativos" />
        <StatCard title="Instituições" value={stats.totalInstituicoes} icon={School} color="emerald" description="instituições parceiras" />
        <StatCard title="Moedas Distribuídas" value={stats.totalMoedasDistribuidas} icon={Coins} color="gold" description="moedas em circulação" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-primary-600" />
              <h3 className="font-semibold text-slate-800">Alunos Recentes</h3>
            </div>
            <Link to="/alunos" className="text-xs text-primary-600 hover:underline font-medium">Ver todos</Link>
          </div>
          {stats.recentAlunos.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-6">Nenhum aluno cadastrado ainda.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {stats.recentAlunos.map((aluno) => (
                <div key={aluno.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-700 text-xs font-bold">{aluno.nome.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{aluno.nome}</p>
                      <p className="text-xs text-slate-500">{aluno.curso}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock className="w-3 h-3" />
                    {formatDate(aluno.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-slate-800">Empresas Recentes</h3>
            </div>
            <Link to="/empresas" className="text-xs text-primary-600 hover:underline font-medium">Ver todas</Link>
          </div>
          {stats.recentEmpresas.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-6">Nenhuma empresa cadastrada ainda.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {stats.recentEmpresas.map((empresa) => (
                <div key={empresa.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-700 text-xs font-bold">{empresa.nome.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{empresa.nome}</p>
                      <p className="text-xs text-slate-500">{empresa.email}</p>
                    </div>
                  </div>
                  <Badge label={empresa.status} variant={empresa.status === 'ATIVA' ? 'success' : 'default'} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const user = authService.getUser();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(user?.tipo === 'ADMIN');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.tipo !== 'ADMIN') return;
    dashboardService
      .getStats()
      .then(setStats)
      .catch(() => setError('Não foi possível carregar os dados. Verifique a conexão com o servidor.'))
      .finally(() => setLoading(false));
  }, [user?.tipo]);

  if (!user?.tipo) {
    return (
      <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-6 text-sm space-y-2">
        <p className="font-medium">Não foi possível carregar seu perfil.</p>
        <p>Verifique se o backend está no ar e se a variável <code className="text-xs bg-amber-100 px-1 rounded">VITE_API_URL</code> está configurada no Render. Depois, saia e entre novamente.</p>
      </div>
    );
  }

  if (user.tipo === 'ALUNO') return <DashboardAluno />;
  if (user.tipo === 'PROFESSOR') return <DashboardProfessor />;
  if (user.tipo === 'EMPRESA') return <DashboardEmpresa />;

  if (loading) return <Spinner message="Carregando dashboard..." />;

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6 text-sm">{error}</div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6 text-sm">
        Não foi possível carregar os dados do dashboard.
      </div>
    );
  }

  return <DashboardAdmin stats={stats} />;
}
