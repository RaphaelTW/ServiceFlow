import { DataTable } from '../components/DataTable';
import { Skeleton } from '../components/Skeleton';
import { useResource } from '../hooks/useResource';
import { confirmAction, showError, toast } from '../services/alerts';
import { Customer } from '../types';

export function CustomersPage() {
  const { items, loading, error, create, update, remove, activate, deactivate } = useResource<Customer>('/customers');

  if (loading) return <Skeleton rows={6} />;
  if (error) return <div className="empty-state">{error}</div>;

  return (
    <DataTable<Customer>
      title="Clientes"
      actionLabel="Novo cliente"
      rows={items}
      onCreate={async () => {
        try {
          if (await confirmAction('Criar cliente?', 'Um cliente de exemplo será adicionado para você editar.', 'Criar', 'blue')) {
            await create({ name: 'Novo cliente', phone: '(00) 00000-0000', email: 'cliente@email.com', is_active: 1 });
            toast('Cliente criado.');
          }
        } catch (err) {
          showError(err instanceof Error ? err.message : 'Erro ao criar cliente.');
        }
      }}
      onDelete={async (id) => {
        if (await confirmAction('Desativar cliente?', 'Ele ficará no histórico e poderá ser reativado.', 'Desativar', 'red')) {
          await remove(id);
          toast('Cliente desativado.');
        }
      }}
      onDeactivate={async (id) => {
        if (await confirmAction('Desativar cliente?', 'Ele ficará oculto dos indicadores ativos.', 'Desativar', 'red')) {
          await deactivate(id);
          toast('Cliente desativado.');
        }
      }}
      onActivate={async (id) => {
        if (await confirmAction('Ativar cliente?', 'O cliente voltará para a operação ativa.', 'Ativar', 'green')) {
          await activate(id);
          toast('Cliente ativado.');
        }
      }}
      columns={[
        { key: 'name', label: 'Nome' },
        { key: 'document', label: 'CPF/CNPJ' },
        { key: 'whatsapp', label: 'WhatsApp' },
        { key: 'email', label: 'E-mail' },
        { key: 'city', label: 'Cidade' }
      ]}
      onUpdate={async (id, payload) => {
        await update(id, payload);
        toast('Cliente salvo.');
      }}
      editableFields={[
        { key: 'name', label: 'Nome' },
        { key: 'document', label: 'CPF/CNPJ' },
        { key: 'phone', label: 'Telefone', type: 'tel' },
        { key: 'whatsapp', label: 'WhatsApp', type: 'tel' },
        { key: 'email', label: 'E-mail', type: 'email' },
        { key: 'city', label: 'Cidade' },
        { key: 'state', label: 'Estado' },
        { key: 'notes', label: 'Observações', type: 'textarea' }
      ]}
    />
  );
}
