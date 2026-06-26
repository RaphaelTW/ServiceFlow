import { Bell, LogOut, Moon, Search, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { confirmAction } from '../services/alerts';

export function Topbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  async function confirmLogout() {
    if (await confirmAction('Sair da conta?', 'Sua sessão será encerrada neste navegador.', 'Sair')) {
      logout();
    }
  }

  return (
    <header className="topbar">
      <div className="search">
        <Search size={18} />
        <input placeholder="Pesquisar cliente, OS, serviço..." />
      </div>
      <button className="icon-button" title="Alternar tema" onClick={toggleTheme}>
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </button>
      <button className="icon-button" title="Notificações">
        <Bell size={18} />
      </button>
      <div className="user-chip">
        <span>{user?.name?.slice(0, 1) ?? 'S'}</span>
        <div>
          <strong>{user?.name ?? 'ServiceFlow'}</strong>
          <button className="logout-button" onClick={confirmLogout}>
            <LogOut size={14} />
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}
