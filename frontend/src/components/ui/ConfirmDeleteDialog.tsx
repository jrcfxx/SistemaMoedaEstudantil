import { Trash2, AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

interface ConfirmDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  loading?: boolean;
}

export function ConfirmDeleteDialog({
  open,
  onClose,
  onConfirm,
  title = 'Confirmar exclusão',
  description = 'Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.',
  loading,
}: ConfirmDeleteDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col items-center gap-4 text-center py-2">
        <div className="bg-red-100 p-4 rounded-full">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
        <div className="flex gap-3 w-full mt-2">
          <Button variant="secondary" onClick={onClose} className="flex-1" disabled={loading}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={onConfirm} className="flex-1" loading={loading}>
            <Trash2 className="w-4 h-4" />
            Excluir
          </Button>
        </div>
      </div>
    </Modal>
  );
}
