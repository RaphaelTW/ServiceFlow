import { Bell, Moon, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Topbar() {
  const { user, logout } = useAuth();

  return (
    <header className="topbar">
      <div className="search">
        <Search size={18} />
        <input placeholder="Pesquisar cliente, OS, serviço..." />
      </div>
      <button className="icon-button" title="Alternar tema">
        <Moon size={18} />
      </button>
      <button className="icon-button" title="Notificações">
        <Bell size={18} />
      </button>
      <div className="user-chip">
        <span>{user?.name?.slice(0, 1) ?? 'S'}</span>
        <div>
          <strong>{user?.name ?? 'ServiceFlow'}</strong>
          <button onClick={logout}>Sair</button>
        </div>
      </div>
    </header>
  );
}

