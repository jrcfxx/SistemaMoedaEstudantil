import { useEffect, useState } from 'react';
import { GraduationCap, Building2, School, Coins, Clock } from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { Spinner } from '../components/ui/Spinner';
import { Badge } from '../components/ui/Badge';
import { dashboardService } from '../services/dashboardService';
import { DashboardStats } from '../types';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    dashboardService
      .getStats()
      .then(setStats)
      .catch(() => setError('Não foi possível carregar os dados. Verifique a conexão com o servidor.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner message="Carregando dashboard..." />;

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6 text-sm">
        {error}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Cards de resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total de Alunos"
          value={stats.totalAlunos}
          icon={GraduationCap}
          color="violet"
          description="alunos cadastrados"
        />
        <StatCard
          title="Empresas Parceiras"
          value={stats.totalEmpresas}
          icon={Building2}
          color="blue"
          description="empresas ativas"
        />
        <StatCard
          title="Instituições"
          value={stats.totalInstituicoes}
          icon={School}
          color="emerald"
          description="instituições parceiras"
        />
        <StatCard
          title="Moedas Distribuídas"
          value="—"
          icon={Coins}
          color="gold"
          description="Sprint 03"
        />
      </div>

      {/* Últimos cadastros */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alunos recentes */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-primary-600" />
              <h3 className="font-semibold text-slate-800">Alunos Recentes</h3>
            </div>
            <a href="/alunos" className="text-xs text-primary-600 hover:underline font-medium">
              Ver todos
            </a>
          </div>
          {stats.recentAlunos.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-6">Nenhum aluno cadastrado ainda.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {stats.recentAlunos.map((aluno) => (
                <div key={aluno.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-700 text-xs font-bold">
                        {aluno.nome.charAt(0).toUpperCase()}
                      </span>
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

        {/* Empresas recentes */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-slate-800">Empresas Recentes</h3>
            </div>
            <a href="/empresas" className="text-xs text-primary-600 hover:underline font-medium">
              Ver todas
            </a>
          </div>
          {stats.recentEmpresas.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-6">Nenhuma empresa cadastrada ainda.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {stats.recentEmpresas.map((empresa) => (
                <div key={empresa.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-700 text-xs font-bold">
                        {empresa.nome.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{empresa.nome}</p>
                      <p className="text-xs text-slate-500">{empresa.email}</p>
                    </div>
                  </div>
                  <Badge
                    label={empresa.status}
                    variant={empresa.status === 'ATIVA' ? 'success' : 'default'}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
