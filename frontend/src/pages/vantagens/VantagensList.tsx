import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, Gift, ShoppingBag, Search } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { ConfirmDeleteDialog } from '../../components/ui/ConfirmDeleteDialog';
import { VantagemForm } from './VantagemForm';
import { ResgateModal } from './ResgateModal';
import { vantagemService } from '../../services/vantagemService';
import { authService } from '../../services/authService';
import { Vantagem } from '../../types';

const ROLES_GESTAO = ['ADMIN', 'EMPRESA'];

export default function VantagensList() {
  const [vantagens, setVantagens] = useState<Vantagem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedVantagem, setSelectedVantagem] = useState<Vantagem | undefined>();
  const [resgateTarget, setResgateTarget] = useState<Vantagem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Vantagem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const user = authService.getUser();
  const podeGerir = user ? ROLES_GESTAO.includes(user.tipo) : false;
  const podeResgatar = user?.tipo === 'ALUNO';

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await vantagemService.findAll(search || undefined);
      setVantagens(data);
      setError('');
    } catch {
      setError('Erro ao carregar vantagens.');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(load, 300);
    return () => clearTimeout(timer);
  }, [load]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await vantagemService.delete(deleteTarget.id);
      setDeleteTarget(null);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir vantagem');
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Barra de ações */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título, descrição ou empresa..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        {podeGerir && (
          <Button onClick={() => { setSelectedVantagem(undefined); setFormOpen(true); }}>
            <Plus className="w-4 h-4" />
            Nova vantagem
          </Button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl border border-red-200">{error}</div>
      )}

      {loading ? (
        <div className="card">
          <Spinner message="Carregando vantagens..." />
        </div>
      ) : vantagens.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={Gift}
            title="Nenhuma vantagem encontrada"
            description={search ? 'Tente outros termos de busca.' : 'Nenhuma vantagem cadastrada ainda.'}
            action={podeGerir && !search ? { label: 'Cadastrar vantagem', onClick: () => { setSelectedVantagem(undefined); setFormOpen(true); } } : undefined}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {vantagens.map((v) => (
            <VantagemCard
              key={v.id}
              vantagem={v}
              podeResgatar={podeResgatar}
              podeGerir={podeGerir}
              onResgatar={() => setResgateTarget(v)}
              onEditar={() => { setSelectedVantagem(v); setFormOpen(true); }}
              onExcluir={() => setDeleteTarget(v)}
            />
          ))}
        </div>
      )}

      <VantagemForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSuccess={load}
        vantagem={selectedVantagem}
      />

      {resgateTarget && (
        <ResgateModal
          open={!!resgateTarget}
          vantagem={resgateTarget}
          onClose={() => { setResgateTarget(null); load(); }}
        />
      )}

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Excluir vantagem"
        description={`Tem certeza que deseja excluir a vantagem "${deleteTarget?.titulo}"?`}
      />
    </div>
  );
}

interface VantagemCardProps {
  vantagem: Vantagem;
  podeResgatar: boolean;
  podeGerir: boolean;
  onResgatar: () => void;
  onEditar: () => void;
  onExcluir: () => void;
}

function VantagemCard({ vantagem: v, podeResgatar, podeGerir, onResgatar, onEditar, onExcluir }: VantagemCardProps) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-200 flex flex-col">
      {/* Imagem */}
      <div className="relative h-44 bg-gradient-to-br from-indigo-50 via-purple-50 to-slate-100 overflow-hidden flex-shrink-0">
        {v.fotoUrl ? (
          <img
            src={v.fotoUrl}
            alt={v.titulo}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag className="w-14 h-14 text-indigo-200" />
          </div>
        )}
        {/* Badge de preço flutuante */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm border border-amber-200 text-amber-700 font-bold text-sm px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
          🪙 {v.custoMoedas}
        </div>
        {/* Botões de gestão (hover) */}
        {podeGerir && (
          <div className="absolute top-3 left-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <button
              title="Editar"
              onClick={onEditar}
              className="p-1.5 bg-white/90 backdrop-blur-sm text-slate-600 hover:text-indigo-600 rounded-lg shadow-sm transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              title="Excluir"
              onClick={onExcluir}
              className="p-1.5 bg-white/90 backdrop-blur-sm text-slate-600 hover:text-red-600 rounded-lg shadow-sm transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <h3 className="font-semibold text-slate-800 text-sm leading-snug">{v.titulo}</h3>
        <p className="text-slate-500 text-xs leading-relaxed flex-1 line-clamp-2">{v.descricao}</p>

        {v.empresa && (
          <span className="inline-flex items-center self-start text-xs font-medium text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full mt-1">
            {v.empresa.nome}
          </span>
        )}

        {podeResgatar && (
          <button
            onClick={onResgatar}
            className="mt-2 w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-medium py-2.5 rounded-xl transition-colors duration-150"
          >
            <Gift className="w-4 h-4" />
            Resgatar
          </button>
        )}
      </div>
    </div>
  );
}
