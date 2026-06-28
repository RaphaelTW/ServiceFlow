import { FormEvent, useState } from 'react';
import { ArrowRight, Gauge, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BrandLogo } from '../components/BrandLogo';

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
      <div className="auth-light auth-light--one" />
      <div className="auth-light auth-light--two" />
      <section className="auth-shell">
        <form className="auth-card" onSubmit={submit}>
          <div className="auth-brand">
            <BrandLogo compact />
            <strong>ServiceFlow</strong>
          </div>
          <div className="auth-card-head">
            <div className="auth-icon"><ShieldCheck size={20} /></div>
            <div>
              <span><ShieldCheck size={14} /> Acesso seguro</span>
              <h2>{mode === 'login' ? 'Entrar' : 'Criar conta'}</h2>
            </div>
          </div>
          {mode === 'register' && (
            <label className="auth-field">
              <span>Nome</span>
              <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Seu nome" />
            </label>
          )}
          <label className="auth-field">
            <span>E-mail</span>
            <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="voce@empresa.com" type="email" />
          </label>
          <label className="auth-field">
            <span>Senha</span>
            <input value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Sua senha" type="password" />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button className="primary-button" disabled={loading}>
            {loading ? 'Aguarde...' : mode === 'login' ? 'Entrar agora' : 'Cadastrar'}
            <ArrowRight size={18} />
          </button>
          <button className="link-button" type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
            {mode === 'login' ? 'Criar nova conta' : 'Já tenho conta'}
          </button>
          <p className="auth-hint">Use o acesso demo preenchido para entrar rapidamente.</p>
        </form>
        <aside className="auth-orbit" aria-label="Resumo do sistema">
          <div className="auth-orbit-head">
            <BrandLogo />
            <div>
              <span>ServiceFlow OS</span>
              <strong>Fluxo ao vivo</strong>
            </div>
          </div>
          <div className="orbit-metrics">
            <div>
              <Gauge size={18} />
              <strong>98%</strong>
              <span>operação</span>
            </div>
            <div>
              <Sparkles size={18} />
              <strong>24</strong>
              <span>tarefas</span>
            </div>
            <div>
              <ShieldCheck size={18} />
              <strong>OK</strong>
              <span>segurança</span>
            </div>
          </div>
          <div className="orbit-line">
            <span />
            <p>Clientes, ordens e financeiro em uma interface leve e sincronizada.</p>
          </div>
        </aside>
      </section>
    </main>
  );
}
