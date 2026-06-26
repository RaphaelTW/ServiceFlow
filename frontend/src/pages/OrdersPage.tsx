import { DataTable } from '../components/DataTable';
import { Skeleton } from '../components/Skeleton';
import { useResource } from '../hooks/useResource';
import { WorkOrder } from '../types';

export function OrdersPage() {
  const { items, loading, error, create, remove } = useResource<WorkOrder>('/work-orders');

  if (loading) return <Skeleton rows={6} />;
  if (error) return <div className="empty-state">{error}</div>;

  return (
    <DataTable<WorkOrder>
      title="Ordens de serviço"
      actionLabel="Nova OS"
      rows={items}
      onCreate={() => create({ customer_id: 1, code: `OS-${Date.now().toString().slice(-5)}`, title: 'Nova ordem de serviço', status: 'open', total: 0 } as Partial<WorkOrder>)}
      onDelete={remove}
      columns={[
        { key: 'code', label: 'Código' },
        { key: 'title', label: 'Título' },
        { key: 'status', label: 'Status' },
        { key: 'scheduled_at', label: 'Agenda', render: (order) => (order.scheduled_at ? new Date(order.scheduled_at).toLocaleString('pt-BR') : '-') },
        { key: 'total', label: 'Total', render: (order) => Number(order.total ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }
      ]}
    />
  );
}
