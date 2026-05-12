import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coins, Eye, EyeOff, Loader2 } from 'lucide-react';

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
      {/* Panel esquerdo */}
      <div className="hidden lg:flex w-1/2 bg-sidebar flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-gold rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-primary-400 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 text-center max-w-sm">
          <div className="flex justify-center mb-6">
            <div className="bg-gold/20 p-5 rounded-3xl">
              <Coins className="w-16 h-16 text-gold" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Moeda Estudantil</h1>
          <p className="text-indigo-300 text-lg leading-relaxed">
            O banco digital universitário que reconhece e recompensa o mérito acadêmico.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              { value: '500+', label: 'Alunos' },
              { value: '50+', label: 'Empresas' },
              { value: '10+', label: 'Instituições' },
            ].map(({ value, label }) => (
              <div key={label} className="bg-indigo-800/50 rounded-xl p-3">
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
              <Coins className="w-10 h-10 text-primary-600" />
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
