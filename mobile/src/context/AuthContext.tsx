import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

type AuthContextValue = {
  token: string;
  setToken: (token: string) => void;
  offline: boolean;
  setOffline: (offline: boolean) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState('');
  const [offline, setOffline] = useState(false);
  const value = useMemo(() => ({ token, setToken, offline, setOffline }), [token, offline]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  }

  return context;
}

