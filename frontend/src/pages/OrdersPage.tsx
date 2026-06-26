import { DataTable } from '../components/DataTable';
import { Skeleton } from '../components/Skeleton';
import { useResource } from '../hooks/useResource';
import { confirmAction, toast } from '../services/alerts';
import { WorkOrder } from '../types';

export function OrdersPage() {
  const { items, loading, error, create, update, remove, activate, deactivate } = useResource<WorkOrder>('/work-orders');

  if (loading) return <Skeleton rows={6} />;
  if (error) return <div className="empty-state">{error}</div>;

  return (
    <DataTable<WorkOrder>
      title="Ordens de serviço"
      actionLabel="Nova OS"
      rows={items}
      onCreate={async () => {
        if (await confirmAction('Criar ordem?', 'Uma nova OS será aberta para edição.', 'Criar', 'blue')) {
          await create({ customer_id: 1, code: `OS-${Date.now().toString().slice(-5)}`, title: 'Nova ordem de serviço', status: 'open', total: 0, is_active: 1 } as Partial<WorkOrder>);
          toast('Ordem criada.');
        }
      }}
      onDelete={async (id) => {
        if (await confirmAction('Desativar ordem?', 'A OS permanecerá no histórico.', 'Desativar', 'red')) {
          await remove(id);
          toast('Ordem desativada.');
        }
      }}
      onDeactivate={async (id) => {
        if (await confirmAction('Desativar ordem?', 'A OS sairá dos fluxos ativos.', 'Desativar', 'red')) {
          await deactivate(id);
          toast('Ordem desativada.');
        }
      }}
      onActivate={async (id) => {
        if (await confirmAction('Ativar ordem?', 'A OS voltará para a operação.', 'Ativar', 'green')) {
          await activate(id);
          toast('Ordem ativada.');
        }
      }}
      columns={[
        { key: 'code', label: 'Código' },
        { key: 'title', label: 'Título' },
        { key: 'status', label: 'Status' },
        { key: 'scheduled_at', label: 'Agenda', render: (order) => (order.scheduled_at ? new Date(order.scheduled_at).toLocaleString('pt-BR') : '-') },
        { key: 'total', label: 'Total', render: (order) => Number(order.total ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }
      ]}
      onUpdate={async (id, payload) => {
        await update(id, payload);
        toast('Ordem salva.');
      }}
      editableFields={[
        { key: 'code', label: 'Código' },
        { key: 'title', label: 'Título' },
        {
          key: 'status',
          label: 'Status',
          type: 'select',
          options: [
            { label: 'Aberta', value: 'open' },
            { label: 'Em andamento', value: 'in_progress' },
            { label: 'Concluída', value: 'completed' },
            { label: 'Cancelada', value: 'canceled' }
          ]
        },
        { key: 'scheduled_at', label: 'Agenda', type: 'datetime-local' },
        { key: 'total', label: 'Total', type: 'number' }
      ]}
    />
  );
}
