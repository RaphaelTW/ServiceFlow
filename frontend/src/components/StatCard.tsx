import { LucideIcon } from 'lucide-react';

type StatCardProps = {
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
  tone: 'blue' | 'green' | 'amber' | 'rose';
};

export function StatCard({ label, value, hint, icon: Icon, tone }: StatCardProps) {
  return (
    <article className={`stat-card stat-card--${tone}`}>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{hint}</small>
      </div>
      <Icon size={22} />
    </article>
  );
}

