import { useState, FormEvent, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

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
    // Placeholder: auth real será implementada na Sprint 03
    await new Promise((r) => setTimeout(r, 800));
    localStorage.setItem('isLoggedIn', 'true');
    navigate('/dashboard');
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Panel esquerdo – modelo 3D */}
      <div className="hidden lg:flex w-1/2 bg-sidebar flex-col relative overflow-hidden">
        {/* Glows de fundo */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-16 left-16 w-72 h-72 bg-gold/20 rounded-full blur-3xl" />
          <div className="absolute bottom-16 right-16 w-56 h-56 bg-primary-400/20 rounded-full blur-3xl" />
        </div>

        {/* Cabeçalho */}
        <div className="relative z-10 px-12 pt-12 text-center">
          <h1 className="text-3xl font-bold text-white">Moeda Estudantil</h1>
          <p className="text-indigo-300 text-sm mt-1 leading-relaxed">
            O banco digital universitário que reconhece e recompensa o mérito acadêmico.
          </p>
        </div>

        {/* Canvas 3D */}
        <div className="flex-1 relative z-10">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 text-indigo-300 animate-spin" />
              </div>
            }
          >
            <ModelViewer />
          </Suspense>
        </div>

        {/* Rodapé com estatísticas */}
        <div className="relative z-10 px-12 pb-10">
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: '500+', label: 'Alunos' },
              { value: '50+', label: 'Empresas' },
              { value: '10+', label: 'Instituições' },
            ].map(({ value, label }) => (
              <div key={label} className="bg-indigo-800/50 rounded-xl p-3 text-center">
                <p className="text-gold font-bold text-xl">{value}</p>
                <p className="text-indigo-300 text-xs">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Panel direito */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-sm">
          <div className="flex lg:hidden justify-center mb-6">
            <div className="bg-primary-100 p-4 rounded-2xl">
              <span className="text-3xl">🪙</span>
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
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-8">
            Sistema de Moeda Estudantil · PUC Minas
          </p>
        </div>
      </div>
    </div>
  );
}
