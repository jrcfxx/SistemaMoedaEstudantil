import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
      <div className="bg-slate-100 p-5 rounded-2xl">
        <Icon className="w-10 h-10 text-slate-400" />
      </div>
      <div>
        <p className="font-semibold text-slate-700">{title}</p>
        {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
