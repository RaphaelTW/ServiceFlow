import { DataTable } from '../components/DataTable';
import { Skeleton } from '../components/Skeleton';
import { useResource } from '../hooks/useResource';
import { confirmAction, toast } from '../services/alerts';

type Transaction = {
  id: number;
  is_active?: number;
  description: string;
  type: string;
  amount: number;
  due_date: string;
  status: string;
};

export function FinancePage() {
  const { items, loading, error, create, update, remove, activate, deactivate } = useResource<Transaction>('/finance');

  if (loading) return <Skeleton rows={6} />;
  if (error) return <div className="empty-state">{error}</div>;

  return (
    <DataTable<Transaction>
      title="Financeiro"
      actionLabel="Novo lançamento"
      rows={items}
      onCreate={async () => {
        if (await confirmAction('Criar lançamento?', 'Um lançamento financeiro será criado.', 'Criar', 'blue')) {
          await create({ description: 'Novo lançamento', type: 'income', amount: 100, due_date: new Date().toISOString().slice(0, 10), status: 'pending', is_active: 1 });
          toast('Lançamento criado.');
        }
      }}
      onDelete={async (id) => {
        if (await confirmAction('Desativar lançamento?', 'Ele continuará disponível no histórico.', 'Desativar', 'red')) {
          await remove(id);
          toast('Lançamento desativado.');
        }
      }}
      onDeactivate={async (id) => {
        if (await confirmAction('Desativar lançamento?', 'Ele sairá dos relatórios ativos.', 'Desativar', 'red')) {
          await deactivate(id);
          toast('Lançamento desativado.');
        }
      }}
      onActivate={async (id) => {
        if (await confirmAction('Ativar lançamento?', 'Ele voltará aos relatórios ativos.', 'Ativar', 'green')) {
          await activate(id);
          toast('Lançamento ativado.');
        }
      }}
      columns={[
        { key: 'description', label: 'Descrição' },
        { key: 'type', label: 'Tipo' },
        { key: 'amount', label: 'Valor', render: (item) => Number(item.amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) },
        { key: 'due_date', label: 'Vencimento' },
        { key: 'status', label: 'Status' }
      ]}
      onUpdate={async (id, payload) => {
        await update(id, payload);
        toast('Lançamento salvo.');
      }}
      editableFields={[
        { key: 'description', label: 'Descrição' },
        { key: 'type', label: 'Tipo', type: 'select', options: [
          { label: 'Entrada', value: 'income' },
          { label: 'Saída', value: 'expense' }
        ] },
        { key: 'amount', label: 'Valor', type: 'number' },
        { key: 'due_date', label: 'Vencimento', type: 'date' },
        { key: 'status', label: 'Status', type: 'select', options: [
          { label: 'Pendente', value: 'pending' },
          { label: 'Pago', value: 'paid' },
          { label: 'Cancelado', value: 'canceled' }
        ] }
      ]}
    />
  );
}
