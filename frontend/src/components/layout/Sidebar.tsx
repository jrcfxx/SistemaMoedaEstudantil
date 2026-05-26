import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  Gift,
  Building2,
  School,
  Coins,
  LogOut,
  ReceiptText,
} from 'lucide-react';
import { authService } from '../../services/authService';

interface NavItem {
  to: string;
  label: string;
  icon: React.ElementType;
  roles?: string[];
}

const navItems: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/vantagens', label: 'Vantagens', icon: Gift },
  { to: '/extrato', label: 'Meu Extrato', icon: ReceiptText, roles: ['ALUNO'] },
  { to: '/extrato-professor', label: 'Meu Extrato', icon: ReceiptText, roles: ['PROFESSOR'] },
  { to: '/alunos', label: 'Alunos', icon: GraduationCap, roles: ['ADMIN', 'PROFESSOR'] },
  { to: '/professores', label: 'Professores', icon: BookOpen, roles: ['ADMIN'] },
  { to: '/empresas', label: 'Empresas Parceiras', icon: Building2, roles: ['ADMIN'] },
  { to: '/instituicoes', label: 'Instituições', icon: School, roles: ['ADMIN'] },
];

export function Sidebar() {
  const navigate = useNavigate();
  const user = authService.getUser();

  const visibleItems = navItems.filter(
    ({ roles }) => !roles || (user && roles.includes(user.tipo)),
  );

  const handleLogout = () => {
    authService.logout();
    navigate('/login', { replace: true });
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-sidebar flex flex-col z-30">
      {/* Logo */}
      <div className="px-6 py-4 border-b border-indigo-800">
        <div className="flex items-center gap-3">
          <div className="bg-gold/20 p-2 rounded-xl">
            <Coins className="w-6 h-6 text-gold" />
          </div>
          <div>
            <h1 className="text-white font-bold text-base leading-tight">Moeda</h1>
            <p className="text-indigo-300 text-xs">Estudantil</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-indigo-400 text-xs font-semibold uppercase tracking-wider px-3 mb-3">
          Menu
        </p>
        {visibleItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? 'bg-sidebar-active text-white shadow-sm'
                  : 'text-sidebar-text hover:bg-sidebar-hover hover:text-white'
              }`
            }
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4 border-t border-indigo-800 pt-3">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-sidebar-text hover:bg-sidebar-hover hover:text-white transition-colors w-full"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          Sair
        </button>
        <p className="text-indigo-500 text-xs text-center mt-3">Lab04S01 · PUC Minas</p>
      </div>
    </aside>
  );
}
