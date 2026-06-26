import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { postJson } from '../services/api';

type AuthContextValue = {
  token: string;
  userName: string;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  offline: boolean;
  setOffline: (offline: boolean) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState('');
  const [userName, setUserName] = useState('');
  const [offline, setOffline] = useState(false);

  async function login(email: string, password: string) {
    const payload = await postJson<{ token: string; user: { name: string } }>('/auth/login', { email, password });
    setToken(payload.token);
    setUserName(payload.user.name);
  }

  function logout() {
    setToken('');
    setUserName('');
  }

  const value = useMemo(() => ({ token, userName, login, logout, offline, setOffline }), [token, userName, offline]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  }

  return context;
}
