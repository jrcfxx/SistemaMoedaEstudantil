import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color?: 'violet' | 'blue' | 'emerald' | 'gold';
  description?: string;
}

const colorClasses = {
  violet: {
    bg: 'bg-primary-50',
    icon: 'bg-primary-100 text-primary-600',
    value: 'text-primary-700',
  },
  blue: {
    bg: 'bg-blue-50',
    icon: 'bg-blue-100 text-blue-600',
    value: 'text-blue-700',
  },
  emerald: {
    bg: 'bg-emerald-50',
    icon: 'bg-emerald-100 text-emerald-600',
    value: 'text-emerald-700',
  },
  gold: {
    bg: 'bg-amber-50',
    icon: 'bg-amber-100 text-amber-600',
    value: 'text-amber-700',
  },
};

export function StatCard({ title, value, icon: Icon, color = 'violet', description }: StatCardProps) {
  const colors = colorClasses[color];

  return (
    <div className={`card flex items-center gap-4 ${colors.bg}`}>
      <div className={`${colors.icon} p-3 rounded-xl`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-600">{title}</p>
        <p className={`text-2xl font-bold ${colors.value}`}>{value}</p>
        {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
      </div>
    </div>
  );
}
