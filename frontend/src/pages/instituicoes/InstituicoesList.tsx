import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, School } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../components/ui/Button';
import { SearchInput } from '../../components/ui/SearchInput';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { ConfirmDeleteDialog } from '../../components/ui/ConfirmDeleteDialog';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { instituicaoService } from '../../services/instituicaoService';
import { Instituicao } from '../../types';

const schema = z.object({
  nome: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
});
type FormData = z.infer<typeof schema>;

function InstituicaoForm({
  open,
  onClose,
  onSuccess,
  inst,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  inst?: Instituicao;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isEdit = !!inst;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (open) {
      reset({ nome: inst?.nome ?? '' });
      setError('');
    }
  }, [open, inst, reset]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError('');
    try {
      if (isEdit) {
        await instituicaoService.update(inst.id, data);
      } else {
        await instituicaoService.create(data);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Editar Instituição' : 'Nova Instituição'} size="sm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Nome da instituição"
          placeholder="PUC Minas"
          error={errors.nome?.message}
          required
          {...register('nome')}
        />
        {error && (
          <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg border border-red-200">
            {error}
          </div>
        )}
        <div className="flex gap-3">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1" disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" className="flex-1" loading={loading}>
            {isEdit ? 'Salvar' : 'Cadastrar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default function InstituicoesList() {
  const [instituicoes, setInstituicoes] = useState<Instituicao[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<Instituicao | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<Instituicao | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await instituicaoService.findAll(search || undefined);
      setInstituicoes(data);
      setError('');
    } catch {
      setError('Erro ao carregar instituições.');
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
      await instituicaoService.delete(deleteTarget.id);
      setDeleteTarget(null);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir');
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <SearchInput value={search} onChange={setSearch} placeholder="Buscar por nome..." />
        <Button onClick={() => { setSelected(undefined); setFormOpen(true); }}>
          <Plus className="w-4 h-4" />
          Nova instituição
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <div className="card p-0 overflow-hidden">
        {loading ? (
          <Spinner message="Carregando instituições..." />
        ) : instituicoes.length === 0 ? (
          <EmptyState
            icon={School}
            title="Nenhuma instituição encontrada"
            description={search ? 'Tente outros termos.' : 'Cadastre a primeira instituição.'}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="table-header">Nome</th>
                  <th className="table-header">Criada em</th>
                  <th className="table-header text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {instituicoes.map((inst) => (
                  <tr key={inst.id} className="table-row">
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                          <School className="w-4 h-4 text-emerald-600" />
                        </div>
                        <span className="font-medium text-slate-800">{inst.nome}</span>
                      </div>
                    </td>
                    <td className="table-cell text-slate-500 text-xs">
                      {new Date(inst.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => { setSelected(inst); setFormOpen(true); }}
                          className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(inst)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-4 py-3 border-t border-slate-100 text-xs text-slate-500 bg-slate-50">
              {instituicoes.length} instituição{instituicoes.length !== 1 ? 'ões' : ''} cadastrada{instituicoes.length !== 1 ? 's' : ''}
            </div>
          </div>
        )}
      </div>

      <InstituicaoForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSuccess={load}
        inst={selected}
      />

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Excluir instituição"
        description={`Excluir "${deleteTarget?.nome}"? Certifique-se de que não há alunos vinculados.`}
      />
    </div>
  );
}
