import { DataTable } from '../components/DataTable';
import { Skeleton } from '../components/Skeleton';
import { useResource } from '../hooks/useResource';
import { confirmAction, toast } from '../services/alerts';

type Product = {
  id: number;
  is_active?: number;
  name: string;
  sku: string;
  barcode: string;
  quantity: number;
  minimum_quantity: number;
  sale_price: number;
};

export function InventoryPage() {
  const { items, loading, error, create, update, remove, activate, deactivate } = useResource<Product>('/inventory');

  if (loading) return <Skeleton rows={6} />;
  if (error) return <div className="empty-state">{error}</div>;

  return (
    <DataTable<Product>
      title="Estoque"
      actionLabel="Novo produto"
      rows={items}
      onCreate={async () => {
        if (await confirmAction('Criar produto?', 'Um produto será cadastrado no estoque.', 'Criar', 'blue')) {
          await create({ name: 'Novo produto', sku: 'SKU-NOVO', barcode: '789000000000', quantity: 0, minimum_quantity: 5, sale_price: 0, is_active: 1 });
          toast('Produto criado.');
        }
      }}
      onDelete={async (id) => {
        if (await confirmAction('Desativar produto?', 'Ele ficará no histórico do estoque.', 'Desativar', 'red')) {
          await remove(id);
          toast('Produto desativado.');
        }
      }}
      onDeactivate={async (id) => {
        if (await confirmAction('Desativar produto?', 'Ele sairá dos alertas de estoque ativo.', 'Desativar', 'red')) {
          await deactivate(id);
          toast('Produto desativado.');
        }
      }}
      onActivate={async (id) => {
        if (await confirmAction('Ativar produto?', 'Ele voltará para o estoque ativo.', 'Ativar', 'green')) {
          await activate(id);
          toast('Produto ativado.');
        }
      }}
      columns={[
        { key: 'name', label: 'Produto' },
        { key: 'sku', label: 'SKU' },
        { key: 'barcode', label: 'Código de barras' },
        { key: 'quantity', label: 'Qtd.' },
        { key: 'sale_price', label: 'Venda', render: (item) => Number(item.sale_price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }
      ]}
      onUpdate={async (id, payload) => {
        await update(id, payload);
        toast('Produto salvo.');
      }}
      editableFields={[
        { key: 'name', label: 'Produto' },
        { key: 'sku', label: 'SKU' },
        { key: 'barcode', label: 'Código de barras' },
        { key: 'quantity', label: 'Quantidade', type: 'number' },
        { key: 'minimum_quantity', label: 'Estoque mínimo', type: 'number' },
        { key: 'sale_price', label: 'Valor de venda', type: 'number' }
      ]}
    />
  );
}
