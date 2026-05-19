import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, GraduationCap, Coins } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { SearchInput } from '../../components/ui/SearchInput';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { ConfirmDeleteDialog } from '../../components/ui/ConfirmDeleteDialog';
import { Badge } from '../../components/ui/Badge';
import { AlunoForm } from './AlunoForm';
import { DistribuirMoedasModal } from '../professores/DistribuirMoedasModal';
import { alunoService } from '../../services/alunoService';
import { professorService } from '../../services/professorService';
import { authService } from '../../services/authService';
import { Aluno, Professor } from '../../types';

function formatCpf(cpf: string) {
  const n = cpf.replace(/\D/g, '');
  return n.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

export default function AlunosList() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedAluno, setSelectedAluno] = useState<Aluno | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<Aluno | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const [professor, setProfessor] = useState<Professor | null>(null);
  const [distribuirTarget, setDistribuirTarget] = useState<Aluno | null>(null);

  const user = authService.getUser();
  const isProfessor = user?.tipo === 'PROFESSOR';
  const isAdmin = user?.tipo === 'ADMIN';

  // Busca dados do professor logado
  useEffect(() => {
    if (isProfessor && user?.professorId) {
      professorService.findById(user.professorId)
        .then(setProfessor)
        .catch(() => {});
    }
  }, [isProfessor, user?.professorId]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await alunoService.findAll(search || undefined);
      setAlunos(data);
      setError('');
    } catch {
      setError('Erro ao carregar alunos.');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(load, 300);
    return () => clearTimeout(timer);
  }, [load]);

  const handleEdit = (aluno: Aluno) => {
    setSelectedAluno(aluno);
    setFormOpen(true);
  };

  const handleNew = () => {
    setSelectedAluno(undefined);
    setFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await alunoService.delete(deleteTarget.id);
      setDeleteTarget(null);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir aluno');
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  const handleDistribuirSuccess = () => {
    load();
    // Atualiza saldo do professor no estado
    if (user?.professorId) {
      professorService.findById(user.professorId).then(setProfessor).catch(() => {});
    }
  };

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Buscar por nome, e-mail, CPF..."
        />
        {isAdmin && (
          <Button onClick={handleNew}>
            <Plus className="w-4 h-4" />
            Novo aluno
          </Button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {/* Tabela */}
      <div className="card p-0 overflow-hidden">
        {loading ? (
          <Spinner message="Carregando alunos..." />
        ) : alunos.length === 0 ? (
          <EmptyState
            icon={GraduationCap}
            title="Nenhum aluno encontrado"
            description={search ? 'Tente outros termos de busca.' : 'Cadastre o primeiro aluno.'}
            action={isAdmin && !search ? { label: 'Cadastrar aluno', onClick: handleNew } : undefined}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="table-header">Nome</th>
                  <th className="table-header">E-mail</th>
                  <th className="table-header">CPF</th>
                  <th className="table-header">Instituição</th>
                  <th className="table-header">Curso</th>
                  <th className="table-header">Saldo</th>
                  <th className="table-header text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {alunos.map((aluno) => (
                  <tr key={aluno.id} className="table-row">
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-primary-700 text-xs font-bold">
                            {aluno.nome.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium text-slate-800">{aluno.nome}</span>
                      </div>
                    </td>
                    <td className="table-cell text-slate-500">{aluno.email}</td>
                    <td className="table-cell font-mono text-xs">{formatCpf(aluno.cpf)}</td>
                    <td className="table-cell">
                      <Badge label={aluno.instituicao?.nome ?? '—'} variant="info" />
                    </td>
                    <td className="table-cell text-slate-600">{aluno.curso}</td>
                    <td className="table-cell">
                      <span className="inline-flex items-center gap-1 text-amber-600 font-semibold text-sm">
                        🪙 {aluno.saldoMoedas}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center justify-center gap-1">
                        {/* Botão de distribuir moedas — visível para PROFESSOR */}
                        {isProfessor && professor && (
                          <button
                            title="Enviar moedas"
                            onClick={() => setDistribuirTarget(aluno)}
                            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          >
                            <Coins className="w-4 h-4" />
                          </button>
                        )}
                        {isAdmin && (
                          <>
                            <button
                              title="Editar"
                              onClick={() => handleEdit(aluno)}
                              className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              title="Excluir"
                              onClick={() => setDeleteTarget(aluno)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-4 py-3 border-t border-slate-100 text-xs text-slate-500 bg-slate-50">
              {alunos.length} aluno{alunos.length !== 1 ? 's' : ''} encontrado{alunos.length !== 1 ? 's' : ''}
            </div>
          </div>
        )}
      </div>

      <AlunoForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSuccess={load}
        aluno={selectedAluno}
      />

      {professor && distribuirTarget && (
        <DistribuirMoedasModal
          open={!!distribuirTarget}
          professor={professor}
          alunoIdInicial={distribuirTarget.id}
          onClose={() => setDistribuirTarget(null)}
          onSuccess={handleDistribuirSuccess}
        />
      )}

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Excluir aluno"
        description={`Tem certeza que deseja excluir o aluno "${deleteTarget?.nome}"? Esta ação não pode ser desfeita.`}
      />
    </div>
  );
}
