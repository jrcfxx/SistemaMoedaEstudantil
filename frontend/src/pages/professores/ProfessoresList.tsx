import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, Coins, SendHorizonal } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { SearchInput } from '../../components/ui/SearchInput';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { ConfirmDeleteDialog } from '../../components/ui/ConfirmDeleteDialog';
import { Badge } from '../../components/ui/Badge';
import { ProfessorForm } from './ProfessorForm';
import { DistribuirMoedasModal } from './DistribuirMoedasModal';
import { professorService } from '../../services/professorService';
import { Professor } from '../../types';

function formatCpf(cpf: string) {
  const n = cpf.replace(/\D/g, '');
  return n.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

export default function ProfessoresList() {
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | undefined>();
  const [distribuirTarget, setDistribuirTarget] = useState<Professor | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Professor | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await professorService.findAll(search || undefined);
      setProfessores(data);
      setError('');
    } catch {
      setError('Erro ao carregar professores.');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(load, 300);
    return () => clearTimeout(timer);
  }, [load]);

  const handleEdit = (professor: Professor) => {
    setSelectedProfessor(professor);
    setFormOpen(true);
  };

  const handleNew = () => {
    setSelectedProfessor(undefined);
    setFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await professorService.delete(deleteTarget.id);
      setDeleteTarget(null);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir professor');
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
          placeholder="Buscar por nome, CPF, departamento..."
        />
        <Button onClick={handleNew}>
          <Plus className="w-4 h-4" />
          Novo professor
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <div className="card p-0 overflow-hidden">
        {loading ? (
          <Spinner message="Carregando professores..." />
        ) : professores.length === 0 ? (
          <EmptyState
            icon={Coins}
            title="Nenhum professor encontrado"
            description={search ? 'Tente outros termos de busca.' : 'Cadastre o primeiro professor.'}
            action={search ? undefined : { label: 'Cadastrar professor', onClick: handleNew }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="table-header">Professor</th>
                  <th className="table-header">CPF</th>
                  <th className="table-header">Departamento</th>
                  <th className="table-header">Instituição</th>
                  <th className="table-header">Saldo</th>
                  <th className="table-header text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {professores.map((prof) => (
                  <tr key={prof.id} className="table-row">
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-indigo-700 text-xs font-bold">
                            {prof.nome.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium text-slate-800">{prof.nome}</span>
                      </div>
                    </td>
                    <td className="table-cell font-mono text-xs">{formatCpf(prof.cpf)}</td>
                    <td className="table-cell text-slate-600">{prof.departamento}</td>
                    <td className="table-cell">
                      <Badge label={prof.instituicao?.nome ?? '—'} variant="info" />
                    </td>
                    <td className="table-cell">
                      <span className={`inline-flex items-center gap-1 font-semibold text-sm ${prof.saldoMoedas === 0 ? 'text-red-500' : 'text-amber-600'}`}>
                        🪙 {prof.saldoMoedas}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          title="Distribuir moedas"
                          onClick={() => setDistribuirTarget(prof)}
                          className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        >
                          <SendHorizonal className="w-4 h-4" />
                        </button>
                        <button
                          title="Editar"
                          onClick={() => handleEdit(prof)}
                          className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          title="Excluir"
                          onClick={() => setDeleteTarget(prof)}
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
              {professores.length} professor{professores.length !== 1 ? 'es' : ''} encontrado{professores.length !== 1 ? 's' : ''}
            </div>
          </div>
        )}
      </div>

      <ProfessorForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSuccess={load}
        professor={selectedProfessor}
      />

      {distribuirTarget && (
        <DistribuirMoedasModal
          open={!!distribuirTarget}
          professor={distribuirTarget}
          onClose={() => setDistribuirTarget(null)}
          onSuccess={() => { setDistribuirTarget(null); load(); }}
        />
      )}

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Excluir professor"
        description={`Tem certeza que deseja excluir o professor "${deleteTarget?.nome}"? Esta ação não pode ser desfeita.`}
      />
    </div>
  );
}
