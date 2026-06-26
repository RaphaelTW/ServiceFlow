import { FormEvent, useState } from 'react';
import { ArrowRight, CalendarDays, CheckCircle2, DollarSign, ShieldCheck, Sparkles, Users } from 'lucide-react';
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
      <div className="auth-ambient auth-ambient-one" />
      <div className="auth-ambient auth-ambient-two" />
      <section className="auth-panel">
        <div className="auth-copy">
          <span className="eyebrow">ServiceFlow SaaS</span>
          <h1>Controle clientes, ordens, agenda e financeiro em um fluxo simples.</h1>
          <p>Uma operação completa para prestadores de serviço que precisam sair da planilha sem virar reféns de um ERP pesado.</p>
          <div className="auth-device">
            <div className="device-top">
              <span />
              <strong>Hoje</strong>
            </div>
            <div className="device-metrics">
              <div><Users size={18} /><strong>32</strong><small>Clientes</small></div>
              <div><CalendarDays size={18} /><strong>08</strong><small>OS abertas</small></div>
              <div><DollarSign size={18} /><strong>8,4k</strong><small>Receita</small></div>
            </div>
            <div className="device-task">
              <CheckCircle2 size={18} />
              <span>Próximo atendimento sincronizado</span>
            </div>
          </div>
          <div className="auth-badges">
            <span>JWT</span>
            <span>LGPD</span>
            <span>PDF</span>
            <span>Mobile</span>
          </div>
        </div>
        <form className="auth-card" onSubmit={submit}>
          <div className="auth-card-head">
            <div className="auth-icon"><ShieldCheck size={24} /></div>
            <div>
              <span><Sparkles size={14} /> Acesso seguro</span>
              <h2>{mode === 'login' ? 'Entrar' : 'Criar conta'}</h2>
            </div>
          </div>
          {mode === 'register' && <label className="auth-field"><span>Nome</span><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Seu nome" /></label>}
          <label className="auth-field"><span>E-mail</span><input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="voce@empresa.com" type="email" /></label>
          <label className="auth-field"><span>Senha</span><input value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Sua senha" type="password" /></label>
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
