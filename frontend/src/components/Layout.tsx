import { ReactNode } from 'react';
import { BarChart3, Boxes, CalendarDays, ClipboardList, CreditCard, LayoutDashboard, Settings, Users } from 'lucide-react';
import { Topbar } from './Topbar';
import { BrandLogo } from './BrandLogo';

const nav = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'customers', label: 'Clientes', icon: Users },
  { key: 'orders', label: 'Ordens', icon: ClipboardList },
  { key: 'calendar', label: 'Agenda', icon: CalendarDays },
  { key: 'finance', label: 'Financeiro', icon: CreditCard },
  { key: 'inventory', label: 'Estoque', icon: Boxes },
  { key: 'reports', label: 'Relatórios', icon: BarChart3 },
  { key: 'settings', label: 'Ajustes', icon: Settings }
];

type LayoutProps = {
  active: string;
  onNavigate: (page: string) => void;
  children: ReactNode;
};

export function Layout({ active, onNavigate, children }: LayoutProps) {
  return (
    <div className="app-shell">
      <header className="apple-navbar">
        <div className="brand">
          <BrandLogo compact />
          <strong>ServiceFlow</strong>
        </div>
        <nav className="apple-nav" aria-label="Navegação principal">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <button className={active === item.key ? 'active' : ''} key={item.key} onClick={() => onNavigate(item.key)} title={item.label}>
                <Icon size={15} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <Topbar />
      </header>
      <main className="workspace">
        {children}
      </main>
    </div>
  );
}
