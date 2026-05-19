import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, Gift, ShoppingBag } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { SearchInput } from '../../components/ui/SearchInput';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { ConfirmDeleteDialog } from '../../components/ui/ConfirmDeleteDialog';
import { Badge } from '../../components/ui/Badge';
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
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Buscar por título, descrição ou empresa..."
        />
        {podeGerir && (
          <Button onClick={() => { setSelectedVantagem(undefined); setFormOpen(true); }}>
            <Plus className="w-4 h-4" />
            Nova vantagem
          </Button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <div className="card p-0 overflow-hidden">
        {loading ? (
          <Spinner message="Carregando vantagens..." />
        ) : vantagens.length === 0 ? (
          <EmptyState
            icon={Gift}
            title="Nenhuma vantagem encontrada"
            description={search ? 'Tente outros termos de busca.' : 'Nenhuma vantagem cadastrada ainda.'}
            action={podeGerir && !search ? { label: 'Cadastrar vantagem', onClick: () => { setSelectedVantagem(undefined); setFormOpen(true); } } : undefined}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {vantagens.map((v) => (
              <div key={v.id} className="border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                {v.fotoUrl ? (
                  <img
                    src={v.fotoUrl}
                    alt={v.titulo}
                    className="w-full h-36 object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : (
                  <div className="w-full h-36 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
                    <ShoppingBag className="w-10 h-10 text-indigo-200" />
                  </div>
                )}
                <div className="p-4 flex flex-col flex-1 gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-slate-800 text-sm leading-tight">{v.titulo}</h3>
                    <span className="text-amber-600 font-bold text-sm whitespace-nowrap">🪙 {v.custoMoedas}</span>
                  </div>
                  <p className="text-slate-500 text-xs leading-relaxed flex-1 line-clamp-2">{v.descricao}</p>
                  {v.empresa && (
                    <Badge label={v.empresa.nome} variant="info" />
                  )}
                  <div className="flex gap-2 mt-1">
                    <Button
                      className="flex-1 text-xs py-1.5"
                      onClick={() => setResgateTarget(v)}
                    >
                      <Gift className="w-3.5 h-3.5" />
                      Resgatar
                    </Button>
                    {podeGerir && (
                      <>
                        <button
                          title="Editar"
                          onClick={() => { setSelectedVantagem(v); setFormOpen(true); }}
                          className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          title="Excluir"
                          onClick={() => setDeleteTarget(v)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
          onClose={() => setResgateTarget(null)}
          onSuccess={() => { setResgateTarget(null); load(); }}
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
