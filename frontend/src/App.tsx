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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <Layout>
                <Navigate to="/dashboard" replace />
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Layout>
                <Dashboard />
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/alunos"
          element={
            <RequireAuth>
              <Layout>
                <AlunosList />
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/professores"
          element={
            <RequireAuth>
              <Layout>
                <ProfessoresList />
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/vantagens"
          element={
            <RequireAuth>
              <Layout>
                <VantagensList />
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/empresas"
          element={
            <RequireAuth>
              <Layout>
                <EmpresasList />
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/instituicoes"
          element={
            <RequireAuth>
              <Layout>
                <InstituicoesList />
              </Layout>
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
