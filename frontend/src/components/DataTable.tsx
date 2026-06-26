import { CheckCircle2, Pencil, Plus, Save, Search, Trash2, X } from 'lucide-react';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { CustomDatePicker, CustomDateTimePicker, CustomSelect } from './FormControls';

type Column<T> = {
  key: keyof T;
  label: string;
  render?: (item: T) => string;
};

export type EditableField<T> = {
  key: keyof T;
  label: string;
  type?: 'text' | 'email' | 'tel' | 'number' | 'date' | 'datetime-local' | 'select' | 'textarea';
  options?: Array<{ label: string; value: string | number }>;
};

type DataTableProps<T extends { id: number; is_active?: number | boolean }> = {
  title: string;
  actionLabel: string;
  columns: Column<T>[];
  rows: T[];
  onCreate: () => void;
  onUpdate?: (id: number, payload: Partial<T>) => Promise<void> | void;
  onDelete?: (id: number) => void;
  onActivate?: (id: number) => void;
  onDeactivate?: (id: number) => void;
  editableFields?: EditableField<T>[];
};

export function DataTable<T extends { id: number; is_active?: number | boolean }>({ title, actionLabel, columns, rows, onCreate, onUpdate, onDelete, onActivate, onDeactivate, editableFields = [] }: DataTableProps<T>) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [editing, setEditing] = useState<T | null>(null);
  const [form, setForm] = useState<Partial<T>>({});
  const [saving, setSaving] = useState(false);
  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const active = row.is_active === undefined || row.is_active === true || row.is_active === 1;
      const matchesStatus = status === 'all' || (status === 'active' ? active : !active);
      const matchesQuery = JSON.stringify(row).toLowerCase().includes(query.toLowerCase());
      return matchesStatus && matchesQuery;
    });
  }, [query, rows, status]);

  useEffect(() => {
    if (!editing) {
      return;
    }

    const initial = editableFields.reduce<Partial<T>>((acc, field) => {
      const value = editing[field.key];
      acc[field.key] = normalizeInitialValue(value, field.type) as T[keyof T];
      return acc;
    }, {});
    setForm(initial);
  }, [editableFields, editing]);

  async function submitEdit(event: FormEvent) {
    event.preventDefault();
    if (!editing || !onUpdate) {
      return;
    }

    setSaving(true);
    try {
      await onUpdate(editing.id, form);
      setEditing(null);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <span className="eyebrow">Gestão</span>
          <h1>{title}</h1>
        </div>
        <button className="primary-button" onClick={onCreate}>
          <Plus size={18} />
          {actionLabel}
        </button>
      </div>
      <div className="table-toolbar">
        <Search size={18} />
        <input placeholder="Pesquisa instantânea" value={query} onChange={(event) => setQuery(event.target.value)} />
        <div className="toolbar-control">
          <CustomSelect
            value={status}
            onChange={setStatus}
            options={[
              { label: 'Todos', value: 'all' },
              { label: 'Ativos', value: 'active' },
              { label: 'Inativos', value: 'inactive' }
            ]}
          />
        </div>
      </div>
      <div className="data-table">
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={String(column.key)}>{column.label}</th>
              ))}
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row) => {
              const active = row.is_active === undefined || row.is_active === true || row.is_active === 1;
              return (
              <tr key={row.id}>
                {columns.map((column) => (
                  <td key={String(column.key)}>{column.render ? column.render(row) : String(row[column.key] ?? '-')}</td>
                ))}
                <td>
                  <span className={`status-pill ${active ? 'is-active' : 'is-inactive'}`}>{active ? 'Ativo' : 'Inativo'}</span>
                </td>
                <td className="row-actions">
                  {onUpdate && editableFields.length > 0 && (
                    <button className="icon-button edit" title="Editar" onClick={() => setEditing(row)}>
                      <Pencil size={16} />
                    </button>
                  )}
                  {!active && onActivate && (
                    <button className="icon-button success" title="Ativar" onClick={() => onActivate(row.id)}>
                      <CheckCircle2 size={16} />
                    </button>
                  )}
                  {active && onDelete && (
                    <button className="icon-button danger" title="Desativar" onClick={() => onDelete(row.id)}>
                      <Trash2 size={16} />
                    </button>
                  )}
                  {active && !onDelete && onDeactivate && (
                    <button className="icon-button danger" title="Desativar" onClick={() => onDeactivate(row.id)}>
                      <Trash2 size={16} />
                    </button>
                  )}
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
        {filteredRows.length === 0 && <div className="empty-state">Nenhum registro encontrado.</div>}
      </div>
      {editing && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setEditing(null)}>
          <form className="edit-modal" onSubmit={submitEdit} onMouseDown={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="eyebrow">Edição</span>
                <h2>{title}</h2>
              </div>
              <button className="icon-button" type="button" title="Fechar" onClick={() => setEditing(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-grid">
              {editableFields.map((field) => {
                const value = form[field.key] ?? '';
                return (
                  <label className={`field ${field.type === 'textarea' ? 'field-wide' : ''}`} key={String(field.key)}>
                    <span>{field.label}</span>
                    {field.type === 'textarea' ? (
                      <textarea value={String(value)} onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value } as Partial<T>))} />
                    ) : field.type === 'select' ? (
                      <CustomSelect
                        value={String(value)}
                        onChange={(nextValue) => setForm((current) => ({ ...current, [field.key]: nextValue } as Partial<T>))}
                        options={(field.options ?? []).map((option) => ({ label: option.label, value: String(option.value) }))}
                      />
                    ) : field.type === 'date' ? (
                      <CustomDatePicker
                        value={String(value)}
                        onChange={(nextValue) => setForm((current) => ({ ...current, [field.key]: nextValue } as Partial<T>))}
                      />
                    ) : field.type === 'datetime-local' ? (
                      <CustomDateTimePicker
                        value={String(value)}
                        onChange={(nextValue) => setForm((current) => ({ ...current, [field.key]: nextValue } as Partial<T>))}
                      />
                    ) : (
                      <input
                        type={field.type === 'number' ? 'number' : field.type ?? 'text'}
                        value={String(value)}
                        onChange={(event) => setForm((current) => ({ ...current, [field.key]: castValue(event.target.value, field.type) } as Partial<T>))}
                      />
                    )}
                  </label>
                );
              })}
            </div>
            <div className="modal-actions">
              <button className="secondary-button" type="button" onClick={() => setEditing(null)}>Cancelar</button>
              <button className="success-button" type="submit" disabled={saving}>
                <Save size={18} />
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

function normalizeInitialValue(value: unknown, type?: EditableField<{ id: number }>['type']) {
  if (value === null || value === undefined) {
    return '';
  }

  if (type === 'datetime-local' && typeof value === 'string') {
    return value.replace(' ', 'T').slice(0, 16);
  }

  if (type === 'date' && typeof value === 'string') {
    return value.slice(0, 10);
  }

  return value;
}

function castValue(value: string, type?: EditableField<{ id: number }>['type']) {
  if (type === 'number') {
    return value === '' ? '' : Number(value);
  }

  if (type === 'datetime-local') {
    return value ? value.replace('T', ' ') + ':00' : '';
  }

  return value;
}
