import { useEffect, useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, GraduationCap, Building2 } from 'lucide-react';
import { CoinIcon } from '../components/ui/CoinIcon';
import { authService } from '../services/authService';
import { instituicaoService } from '../services/instituicaoService';
import { Instituicao } from '../types';

type ModoCadastro = 'aluno' | 'empresa';

export default function Register() {
  const navigate = useNavigate();
  const [modo, setModo] = useState<ModoCadastro>('aluno');
  const [instituicoes, setInstituicoes] = useState<Instituicao[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    cpf: '',
    rg: '',
    endereco: '',
    curso: '',
    instituicaoId: '',
    cnpj: '',
    telefone: '',
  });

  useEffect(() => {
    instituicaoService.findAll().then(setInstituicoes).catch(() => {});
  }, []);

  const set = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (modo === 'aluno') {
        await authService.registerAluno({
          nome: form.nome,
          email: form.email,
          senha: form.senha,
          cpf: form.cpf,
          rg: form.rg,
          endereco: form.endereco,
          curso: form.curso,
          instituicaoId: form.instituicaoId,
        });
      } else {
        await authService.registerEmpresa({
          nome: form.nome,
          email: form.email,
          senha: form.senha,
          cnpj: form.cnpj,
          endereco: form.endereco,
          telefone: form.telefone || undefined,
        });
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao cadastrar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex bg-primary-100 p-3 rounded-2xl mb-4">
            <CoinIcon className="text-primary-600" size={36} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Criar conta</h1>
          <p className="text-slate-500 text-sm mt-1">Participe do programa de Moeda Estudantil</p>
        </div>

        <div className="flex gap-2 p-1 bg-slate-200 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => setModo('aluno')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              modo === 'aluno' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            Sou Aluno
          </button>
          <button
            type="button"
            onClick={() => setModo('empresa')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              modo === 'empresa' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Sou Empresa
          </button>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4">
          <div>
            <label className="label">{modo === 'aluno' ? 'Nome completo' : 'Nome da empresa'}</label>
            <input className="input-field" value={form.nome} onChange={(e) => set('nome', e.target.value)} required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="label">E-mail</label>
              <input type="email" className="input-field" value={form.email} onChange={(e) => set('email', e.target.value)} required />
            </div>

            <div className="sm:col-span-2">
              <label className="label">Senha</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  className="input-field pr-10"
                  value={form.senha}
                  onChange={(e) => set('senha', e.target.value)}
                  minLength={6}
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {modo === 'aluno' ? (
              <>
                <div>
                  <label className="label">CPF</label>
                  <input className="input-field" placeholder="123.456.789-01" value={form.cpf} onChange={(e) => set('cpf', e.target.value)} required />
                </div>
                <div>
                  <label className="label">RG</label>
                  <input className="input-field" value={form.rg} onChange={(e) => set('rg', e.target.value)} required />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Curso</label>
                  <input className="input-field" value={form.curso} onChange={(e) => set('curso', e.target.value)} required />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Endereço</label>
                  <input className="input-field" value={form.endereco} onChange={(e) => set('endereco', e.target.value)} required />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Instituição de Ensino</label>
                  <select className="input-field" value={form.instituicaoId} onChange={(e) => set('instituicaoId', e.target.value)} required>
                    <option value="">Selecione...</option>
                    {instituicoes.map((i) => (
                      <option key={i.id} value={i.id}>{i.nome}</option>
                    ))}
                  </select>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="label">CNPJ</label>
                  <input className="input-field" placeholder="12.345.678/0001-95" value={form.cnpj} onChange={(e) => set('cnpj', e.target.value)} required />
                </div>
                <div>
                  <label className="label">Telefone</label>
                  <input className="input-field" value={form.telefone} onChange={(e) => set('telefone', e.target.value)} />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Endereço</label>
                  <input className="input-field" value={form.endereco} onChange={(e) => set('endereco', e.target.value)} required />
                </div>
              </>
            )}
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg border border-red-200">{error}</div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-2.5">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {loading ? 'Cadastrando...' : 'Criar conta'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Já tem conta?{' '}
          <Link to="/login" className="text-indigo-600 font-medium hover:underline">Entrar</Link>
        </p>
      </div>
    </div>
  );
}
