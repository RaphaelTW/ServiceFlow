import { DataTable } from '../components/DataTable';
import { Skeleton } from '../components/Skeleton';
import { useResource } from '../hooks/useResource';

type Transaction = {
  id: number;
  description: string;
  type: string;
  amount: number;
  due_date: string;
  status: string;
};

export function FinancePage() {
  const { items, loading, error, create, remove } = useResource<Transaction>('/finance');

  if (loading) return <Skeleton rows={6} />;
  if (error) return <div className="empty-state">{error}</div>;

  return (
    <DataTable<Transaction>
      title="Financeiro"
      actionLabel="Novo lançamento"
      rows={items}
      onCreate={() => create({ description: 'Novo lançamento', type: 'income', amount: 100, due_date: new Date().toISOString().slice(0, 10), status: 'pending' })}
      onDelete={remove}
      columns={[
        { key: 'description', label: 'Descrição' },
        { key: 'type', label: 'Tipo' },
        { key: 'amount', label: 'Valor', render: (item) => Number(item.amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) },
        { key: 'due_date', label: 'Vencimento' },
        { key: 'status', label: 'Status' }
      ]}
    />
  );
}
