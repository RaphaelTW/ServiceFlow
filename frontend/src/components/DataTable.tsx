import { Plus, Search, Trash2 } from 'lucide-react';

type Column<T> = {
  key: keyof T;
  label: string;
  render?: (item: T) => string;
};

type DataTableProps<T extends { id: number }> = {
  title: string;
  actionLabel: string;
  columns: Column<T>[];
  rows: T[];
  onCreate: () => void;
  onDelete?: (id: number) => void;
};

export function DataTable<T extends { id: number }>({ title, actionLabel, columns, rows, onCreate, onDelete }: DataTableProps<T>) {
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
        <input placeholder="Pesquisa instantânea" />
        <select>
          <option>Todos os status</option>
          <option>Ativos</option>
          <option>Pendentes</option>
        </select>
      </div>
      <div className="data-table">
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={String(column.key)}>{column.label}</th>
              ))}
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                {columns.map((column) => (
                  <td key={String(column.key)}>{column.render ? column.render(row) : String(row[column.key] ?? '-')}</td>
                ))}
                <td className="row-actions">
                  {onDelete && (
                    <button className="icon-button danger" title="Excluir" onClick={() => onDelete(row.id)}>
                      <Trash2 size={16} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <div className="empty-state">Nenhum registro encontrado.</div>}
      </div>
    </section>
  );
}

