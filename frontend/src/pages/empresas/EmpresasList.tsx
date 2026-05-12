import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, Building2, Eye } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { SearchInput } from '../../components/ui/SearchInput';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { ConfirmDeleteDialog } from '../../components/ui/ConfirmDeleteDialog';
import { Badge } from '../../components/ui/Badge';
import { EmpresaForm } from './EmpresaForm';
import { empresaService } from '../../services/empresaService';
import { EmpresaParceira } from '../../types';

function formatCnpj(cnpj: string) {
  const n = cnpj.replace(/\D/g, '');
  return n.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

export default function EmpresasList() {
  const [empresas, setEmpresas] = useState<EmpresaParceira[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedEmpresa, setSelectedEmpresa] = useState<EmpresaParceira | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<EmpresaParceira | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await empresaService.findAll(search || undefined);
      setEmpresas(data);
      setError('');
    } catch {
      setError('Erro ao carregar empresas.');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(load, 300);
    return () => clearTimeout(timer);
  }, [load]);

  const handleEdit = (empresa: EmpresaParceira) => {
    setSelectedEmpresa(empresa);
    setFormOpen(true);
  };

  const handleNew = () => {
    setSelectedEmpresa(undefined);
    setFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await empresaService.delete(deleteTarget.id);
      setDeleteTarget(null);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir empresa');
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
          placeholder="Buscar por nome, e-mail, CNPJ..."
        />
        <Button onClick={handleNew}>
          <Plus className="w-4 h-4" />
          Nova empresa
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <div className="card p-0 overflow-hidden">
        {loading ? (
          <Spinner message="Carregando empresas..." />
        ) : empresas.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="Nenhuma empresa encontrada"
            description={search ? 'Tente outros termos de busca.' : 'Cadastre a primeira empresa parceira.'}
            action={search ? undefined : { label: 'Cadastrar empresa', onClick: handleNew }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="table-header">Empresa</th>
                  <th className="table-header">E-mail</th>
                  <th className="table-header">CNPJ</th>
                  <th className="table-header">Telefone</th>
                  <th className="table-header">Status</th>
                  <th className="table-header text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {empresas.map((empresa) => (
                  <tr key={empresa.id} className="table-row">
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-700 text-xs font-bold">
                            {empresa.nome.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium text-slate-800">{empresa.nome}</span>
                      </div>
                    </td>
                    <td className="table-cell text-slate-500">{empresa.email}</td>
                    <td className="table-cell font-mono text-xs">{formatCnpj(empresa.cnpj)}</td>
                    <td className="table-cell text-slate-500">{empresa.telefone || '—'}</td>
                    <td className="table-cell">
                      <Badge
                        label={empresa.status === 'ATIVA' ? 'Ativa' : 'Inativa'}
                        variant={empresa.status === 'ATIVA' ? 'success' : 'default'}
                      />
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          title="Ver detalhes"
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          title="Editar"
                          onClick={() => handleEdit(empresa)}
                          className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          title="Excluir"
                          onClick={() => setDeleteTarget(empresa)}
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
              {empresas.length} empresa{empresas.length !== 1 ? 's' : ''} encontrada{empresas.length !== 1 ? 's' : ''}
            </div>
          </div>
        )}
      </div>

      <EmpresaForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSuccess={load}
        empresa={selectedEmpresa}
      />

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Excluir empresa"
        description={`Tem certeza que deseja excluir a empresa "${deleteTarget?.nome}"? Esta ação não pode ser desfeita.`}
      />
    </div>
  );
}
