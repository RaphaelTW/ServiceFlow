import { Bell, LogOut, Moon, Sun } from 'lucide-react';
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
    <div className="topbar">
      <button className="icon-button" title="Alternar tema" onClick={toggleTheme}>
        {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
      </button>
      <button className="icon-button" title="Notificações">
        <Bell size={17} />
      </button>
      <button className="user-chip" title="Sair" onClick={confirmLogout}>
        <span>{user?.name?.slice(0, 1) ?? 'S'}</span>
        <strong>{user?.name ?? 'ServiceFlow'}</strong>
        <LogOut size={14} />
      </button>
    </div>
  );
}
