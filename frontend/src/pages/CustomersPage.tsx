import { DataTable } from '../components/DataTable';
import { Skeleton } from '../components/Skeleton';
import { useResource } from '../hooks/useResource';
import { Customer } from '../types';

export function CustomersPage() {
  const { items, loading, error, create, remove } = useResource<Customer>('/customers');

  if (loading) return <Skeleton rows={6} />;
  if (error) return <div className="empty-state">{error}</div>;

  return (
    <DataTable<Customer>
      title="Clientes"
      actionLabel="Novo cliente"
      rows={items}
      onCreate={() => create({ name: 'Novo cliente', phone: '(00) 00000-0000', email: 'cliente@email.com' })}
      onDelete={remove}
      columns={[
        { key: 'name', label: 'Nome' },
        { key: 'document', label: 'CPF/CNPJ' },
        { key: 'whatsapp', label: 'WhatsApp' },
        { key: 'email', label: 'E-mail' },
        { key: 'city', label: 'Cidade' }
      ]}
    />
  );
}
