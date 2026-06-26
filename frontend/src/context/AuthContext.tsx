import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { postJson, tokenStore } from '../services/api';
import { User } from '../types';

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('serviceflow.user');
    return stored ? JSON.parse(stored) : null;
  });

  async function persistSession(payload: { token: string; user: User }) {
    tokenStore.set(payload.token);
    localStorage.setItem('serviceflow.user', JSON.stringify(payload.user));
    setUser(payload.user);
  }

  async function login(email: string, password: string) {
    const payload = await postJson<{ token: string; user: User }>('/auth/login', { email, password });
    await persistSession(payload);
  }

  async function register(name: string, email: string, password: string) {
    const payload = await postJson<{ token: string; user: User }>('/auth/register', { name, email, password });
    await persistSession(payload);
  }

  function logout() {
    tokenStore.clear();
    localStorage.removeItem('serviceflow.user');
    setUser(null);
  }

  const value = useMemo(() => ({ user, isAuthenticated: Boolean(user), login, register, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  }

  return context;
}

