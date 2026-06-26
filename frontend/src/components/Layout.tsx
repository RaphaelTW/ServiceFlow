import { ReactNode } from 'react';
import { BarChart3, Boxes, CalendarDays, ClipboardList, CreditCard, LayoutDashboard, Settings, Users } from 'lucide-react';
import { Topbar } from './Topbar';

const nav = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'customers', label: 'Clientes', icon: Users },
  { key: 'orders', label: 'Ordens', icon: ClipboardList },
  { key: 'calendar', label: 'Agenda', icon: CalendarDays },
  { key: 'finance', label: 'Financeiro', icon: CreditCard },
  { key: 'inventory', label: 'Estoque', icon: Boxes },
  { key: 'reports', label: 'Relatórios', icon: BarChart3 },
  { key: 'settings', label: 'Configurações', icon: Settings }
];

type LayoutProps = {
  active: string;
  onNavigate: (page: string) => void;
  children: ReactNode;
};

export function Layout({ active, onNavigate, children }: LayoutProps) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">SF</div>
          <div>
            <strong>ServiceFlow</strong>
            <span>ERP de serviços</span>
          </div>
        </div>
        <nav>
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <button className={active === item.key ? 'active' : ''} key={item.key} onClick={() => onNavigate(item.key)}>
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>
      <main className="workspace">
        <Topbar />
        {children}
      </main>
    </div>
  );
}

