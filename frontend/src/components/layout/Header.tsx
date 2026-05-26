import { User } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useSaldo } from '../../contexts/SaldoContext';

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Administrador',
  PROFESSOR: 'Professor',
  ALUNO: 'Aluno',
  EMPRESA: 'Empresa Parceira',
};

function subtitleFor(pathname: string, tipo?: string): string {
  if (pathname === '/vantagens') {
    const map: Record<string, string> = {
      ALUNO: 'Catálogo de vantagens disponíveis para resgate',
      EMPRESA: 'Gerencie as vantagens oferecidas pela sua empresa',
      ADMIN: 'Gerenciamento do catálogo de vantagens',
      PROFESSOR: 'Vantagens disponíveis no sistema',
    };
    return map[tipo ?? ''] ?? 'Catálogo de vantagens disponíveis';
  }

  if (pathname === '/dashboard') {
    const map: Record<string, string> = {
      ADMIN: 'Visão geral do sistema',
      ALUNO: 'Bem-vindo ao programa de moeda estudantil',
      PROFESSOR: 'Distribua moedas e acompanhe seu extrato',
      EMPRESA: 'Gerencie as vantagens da sua empresa',
    };
    return map[tipo ?? ''] ?? 'Visão geral do sistema';
  }

  const defaults: Record<string, string> = {
    '/alunos': 'Gerenciamento de alunos cadastrados',
    '/professores': 'Gerenciamento de professores',
    '/empresas': 'Gerenciamento de empresas parceiras',
    '/instituicoes': 'Gerenciamento de instituições de ensino',
    '/extrato': 'Histórico de transações e cupons',
    '/extrato-professor': 'Histórico de moedas distribuídas',
  };

  return defaults[pathname] ?? '';
}

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/alunos': 'Alunos',
  '/professores': 'Professores',
  '/empresas': 'Empresas Parceiras',
  '/instituicoes': 'Instituições',
  '/vantagens': 'Vantagens',
  '/extrato': 'Meu Extrato',
  '/extrato-professor': 'Meu Extrato',
};

export function Header() {
  const { pathname } = useLocation();
  const user = authService.getUser();
  const { saldo } = useSaldo();

  const title = pageTitles[pathname] ?? 'Moeda Estudantil';
  const subtitle = subtitleFor(pathname, user?.tipo);
  const mostraSaldo = (user?.tipo === 'ALUNO' || user?.tipo === 'PROFESSOR') && saldo !== null;

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-20">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {mostraSaldo && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-1.5">
            <span className="text-lg leading-none">🪙</span>
            <div>
              <p className="text-xs text-amber-600 font-medium leading-none">
                {user?.tipo === 'ALUNO' ? 'Seu saldo' : 'Para distribuir'}
              </p>
              <p className="text-sm font-bold text-amber-700 leading-tight">{saldo} moedas</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
          <div className="bg-primary-100 text-primary-700 rounded-full p-1.5">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-slate-800">{user?.nome ?? 'Usuário'}</p>
            <p className="text-xs text-slate-500">{ROLE_LABELS[user?.tipo ?? ''] ?? user?.tipo}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
