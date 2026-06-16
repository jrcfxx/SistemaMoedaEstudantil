import { useState, FormEvent, lazy, Suspense } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { CoinIcon } from '../components/ui/CoinIcon';
import { authService } from '../services/authService';

const ModelViewer = lazy(() => import('../components/ui/ModelViewer'));

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Preencha e-mail e senha.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await authService.login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex overflow-hidden">

      {/* ── Painel esquerdo ─────────────────────────────────── */}
      <div className="hidden lg:block w-1/2 bg-sidebar relative overflow-hidden">

        {/* Glows */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary-500/15 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
        </div>

        {/* Canvas Three.js ocupa o painel inteiro */}
        <Suspense
          fallback={
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-indigo-300 animate-spin" />
            </div>
          }
        >
          <div className="absolute inset-0 z-10">
            <ModelViewer />
          </div>
        </Suspense>

        {/* Título — overlay no topo */}
        <div className="absolute top-0 inset-x-0 z-20 pt-10 pb-6 px-10 text-center bg-gradient-to-b from-sidebar via-sidebar/80 to-transparent">
          <h1 className="text-3xl font-bold text-white tracking-tight">Moeda Estudantil</h1>
          <p className="text-indigo-300 text-sm mt-1 max-w-xs mx-auto leading-relaxed">
            O banco digital universitário que reconhece e recompensa o mérito acadêmico.
          </p>
        </div>

        {/* Cards de estatísticas — overlay na base */}
        <div className="absolute bottom-0 inset-x-0 z-20 pb-8 px-10 pt-6 bg-gradient-to-t from-sidebar via-sidebar/80 to-transparent">
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: '500+', label: 'Alunos' },
              { value: '50+',  label: 'Empresas' },
              { value: '10+',  label: 'Instituições' },
            ].map(({ value, label }) => (
              <div key={label} className="bg-indigo-900/60 backdrop-blur-sm rounded-xl p-3 text-center border border-indigo-700/30">
                <p className="text-gold font-bold text-xl">{value}</p>
                <p className="text-indigo-300 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Painel direito ──────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50 overflow-y-auto">
        <div className="w-full max-w-sm">

          {/* Ícone mobile */}
          <div className="flex lg:hidden justify-center mb-6">
            <div className="bg-primary-100 p-4 rounded-2xl">
              <CoinIcon className="text-primary-600" size={36} />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-1">Bem-vindo de volta</h2>
          <p className="text-slate-500 text-sm mb-8">Entre na sua conta para continuar</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="input-field"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="label">Senha</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-2.5 mt-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Não tem conta?{' '}
            <Link to="/register" className="text-indigo-600 font-medium hover:underline">Cadastre-se</Link>
          </p>

          <p className="text-center text-xs text-slate-500 mt-4">
            Sistema de Moeda Estudantil · PUC Minas
          </p>
        </div>
      </div>
    </div>
  );
}
