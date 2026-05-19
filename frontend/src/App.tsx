import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AlunosList from './pages/alunos/AlunosList';
import ProfessoresList from './pages/professores/ProfessoresList';
import VantagensList from './pages/vantagens/VantagensList';
import EmpresasList from './pages/empresas/EmpresasList';
import InstituicoesList from './pages/instituicoes/InstituicoesList';
import { authService } from './services/authService';

function RequireAuth({ children }: { children: React.ReactNode }) {
  return authService.isAuthenticated() ? <>{children}</> : <Navigate to="/login" replace />;
}

function RequireRole({
  roles,
  children,
}: {
  roles: string[];
  children: React.ReactNode;
}) {
  const user = authService.getUser();
  if (!user || !roles.includes(user.tipo)) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}

function ProtectedPage({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles?: string[];
}) {
  return (
    <RequireAuth>
      <Layout>
        {roles ? <RequireRole roles={roles}>{children}</RequireRole> : children}
      </Layout>
    </RequireAuth>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedPage><Navigate to="/dashboard" replace /></ProtectedPage>} />
        <Route path="/dashboard" element={<ProtectedPage><Dashboard /></ProtectedPage>} />
        <Route path="/vantagens" element={<ProtectedPage><VantagensList /></ProtectedPage>} />
        <Route
          path="/alunos"
          element={
            <ProtectedPage roles={['ADMIN', 'PROFESSOR']}>
              <AlunosList />
            </ProtectedPage>
          }
        />
        <Route
          path="/professores"
          element={
            <ProtectedPage roles={['ADMIN']}>
              <ProfessoresList />
            </ProtectedPage>
          }
        />
        <Route
          path="/empresas"
          element={
            <ProtectedPage roles={['ADMIN']}>
              <EmpresasList />
            </ProtectedPage>
          }
        />
        <Route
          path="/instituicoes"
          element={
            <ProtectedPage roles={['ADMIN']}>
              <InstituicoesList />
            </ProtectedPage>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
