import { Bell, DatabaseBackup, KeyRound, Moon, Palette, ShieldCheck, UploadCloud, Users } from 'lucide-react';
import { useState } from 'react';
import { CustomDatePicker, CustomSelect } from '../components/FormControls';
import { useTheme } from '../context/ThemeContext';
import { confirmAction, toast } from '../services/alerts';

export function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [language, setLanguage] = useState('pt-BR');
  const [accent, setAccent] = useState('blue');
  const [backupFrequency, setBackupFrequency] = useState('daily');
  const [nextBackup, setNextBackup] = useState(new Date().toISOString().slice(0, 10));

  async function save() {
    if (await confirmAction('Salvar configurações?', 'As preferências da empresa serão atualizadas.', 'Salvar', 'green')) {
      toast('Configurações salvas.');
    }
  }

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <span className="eyebrow">Administração</span>
          <h1>Configurações</h1>
        </div>
        <button className="success-button" onClick={save}>Salvar</button>
      </div>
      <div className="settings-grid">
        <article className="panel settings-panel">
          <div className="settings-panel-head">
            <UploadCloud size={22} />
            <div>
              <h2>Empresa</h2>
              <p>Identidade, domínio e dados públicos da operação.</p>
            </div>
          </div>
          <div className="settings-fields">
            <label className="field">
              <span>Nome da empresa</span>
              <input placeholder="Nome da empresa" defaultValue="ServiceFlow Demonstração" />
            </label>
            <label className="field">
              <span>Domínio personalizado</span>
              <input placeholder="app.suaempresa.com.br" />
            </label>
            <CustomDatePicker label="Próximo backup" value={nextBackup} onChange={setNextBackup} />
          </div>
        </article>
        <article className="panel settings-panel appearance-panel">
          <div className="settings-panel-head">
            <Palette size={22} />
            <div>
              <h2>Aparência</h2>
              <p>Experiência visual compartilhada entre Web e Mobile.</p>
            </div>
          </div>
          <div className="appearance-preview">
            <div className="phone-preview">
              <span />
              <strong>ServiceFlow</strong>
              <small>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</small>
            </div>
            <button className={`theme-toggle ${theme === 'dark' ? 'is-dark' : ''}`} onClick={toggleTheme} type="button">
              <span><Moon size={18} /></span>
              <strong>Modo escuro</strong>
            </button>
          </div>
          <div className="settings-fields">
            <CustomSelect
              label="Idioma"
              value={language}
              onChange={setLanguage}
              options={[
                { label: 'Português Brasil', value: 'pt-BR' },
                { label: 'English', value: 'en' },
                { label: 'Español', value: 'es' }
              ]}
            />
            <CustomSelect
              label="Cor de destaque"
              value={accent}
              onChange={setAccent}
              options={[
                { label: 'Azul iOS', value: 'blue' },
                { label: 'Verde ServiceFlow', value: 'green' },
                { label: 'Grafite', value: 'graphite' }
              ]}
            />
          </div>
        </article>
        <article className="panel settings-panel">
          <div className="settings-panel-head">
            <Users size={22} />
            <div>
              <h2>Usuários e permissões</h2>
              <p>Perfis para times pequenos e equipes em campo.</p>
            </div>
          </div>
          <div className="settings-actions">
            <button><Users size={18} /> Proprietário</button>
            <button><KeyRound size={18} /> Permissões</button>
            <button><Bell size={18} /> Notificações</button>
          </div>
        </article>
        <article className="panel settings-panel">
          <div className="settings-panel-head">
            <ShieldCheck size={22} />
            <div>
              <h2>Segurança</h2>
              <p>2FA, tokens, logs e backup automático.</p>
            </div>
          </div>
          <div className="settings-fields">
            <CustomSelect
              label="Backup automático"
              value={backupFrequency}
              onChange={setBackupFrequency}
              options={[
                { label: 'Diário', value: 'daily' },
                { label: 'Semanal', value: 'weekly' },
                { label: 'Mensal', value: 'monthly' }
              ]}
            />
            <div className="security-pill"><DatabaseBackup size={18} /> Backup local ativo</div>
          </div>
        </article>
      </div>
    </section>
  );
}
