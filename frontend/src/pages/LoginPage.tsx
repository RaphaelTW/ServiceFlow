import { FormEvent, useState } from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('Administrador');
  const [email, setEmail] = useState('admin@serviceflow.local');
  const [password, setPassword] = useState('ServiceFlow@123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível autenticar.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div className="auth-copy">
          <span className="eyebrow">ServiceFlow SaaS</span>
          <h1>Controle clientes, ordens, agenda e financeiro em um fluxo simples.</h1>
          <p>Uma operação completa para prestadores de serviço que precisam sair da planilha sem virar reféns de um ERP pesado.</p>
          <div className="auth-badges">
            <span>JWT</span>
            <span>LGPD</span>
            <span>PDF</span>
            <span>Mobile</span>
          </div>
        </div>
        <form className="auth-card" onSubmit={submit}>
          <ShieldCheck size={30} />
          <h2>{mode === 'login' ? 'Entrar' : 'Criar conta'}</h2>
          {mode === 'register' && <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Nome" />}
          <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="E-mail" type="email" />
          <input value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Senha" type="password" />
          {error && <p className="form-error">{error}</p>}
          <button className="primary-button" disabled={loading}>
            {loading ? 'Aguarde...' : mode === 'login' ? 'Entrar agora' : 'Cadastrar'}
            <ArrowRight size={18} />
          </button>
          <button className="link-button" type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
            {mode === 'login' ? 'Criar nova conta' : 'Já tenho conta'}
          </button>
        </form>
      </section>
    </main>
  );
}

