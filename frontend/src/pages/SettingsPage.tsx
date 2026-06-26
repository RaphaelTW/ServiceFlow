import { Moon, ShieldCheck, UploadCloud, Users } from 'lucide-react';

export function SettingsPage() {
  return (
    <section className="page">
      <div className="page-header">
        <div>
          <span className="eyebrow">Administração</span>
          <h1>Configurações</h1>
        </div>
        <button className="primary-button">Salvar</button>
      </div>
      <div className="settings-grid">
        <article className="panel">
          <UploadCloud size={22} />
          <h2>Empresa</h2>
          <input placeholder="Nome da empresa" defaultValue="ServiceFlow Demonstração" />
          <input placeholder="Domínio personalizado" />
        </article>
        <article className="panel">
          <Moon size={22} />
          <h2>Aparência</h2>
          <label className="toggle"><input type="checkbox" defaultChecked /> Modo escuro automático</label>
          <select><option>Português Brasil</option><option>English</option></select>
        </article>
        <article className="panel">
          <Users size={22} />
          <h2>Usuários e permissões</h2>
          <p>Perfis: proprietário, administrador, técnico, financeiro e visualizador.</p>
        </article>
        <article className="panel">
          <ShieldCheck size={22} />
          <h2>Segurança</h2>
          <p>2FA opcional, tokens de API, logs de acesso, auditoria e backup automático.</p>
        </article>
      </div>
    </section>
  );
}

