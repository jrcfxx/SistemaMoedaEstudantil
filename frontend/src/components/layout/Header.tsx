import { Bell, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Visão geral do sistema' },
  '/alunos': { title: 'Alunos', subtitle: 'Gerenciamento de alunos cadastrados' },
  '/empresas': { title: 'Empresas Parceiras', subtitle: 'Gerenciamento de empresas parceiras' },
  '/instituicoes': { title: 'Instituições', subtitle: 'Gerenciamento de instituições de ensino' },
  '/configuracoes': { title: 'Configurações', subtitle: 'Configurações do sistema' },
};

export function Header() {
  const { pathname } = useLocation();
  const page = pageTitles[pathname] ?? { title: 'Moeda Estudantil', subtitle: '' };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-20">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">{page.title}</h2>
        {page.subtitle && <p className="text-xs text-slate-500">{page.subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
          <div className="bg-primary-100 text-primary-700 rounded-full p-1.5">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-slate-800">Admin</p>
            <p className="text-xs text-slate-500">Administrador</p>
          </div>
        </div>
      </div>
    </header>
  );
}
