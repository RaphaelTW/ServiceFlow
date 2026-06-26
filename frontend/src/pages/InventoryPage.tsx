import { DataTable } from '../components/DataTable';
import { Skeleton } from '../components/Skeleton';
import { useResource } from '../hooks/useResource';

type Product = {
  id: number;
  name: string;
  sku: string;
  barcode: string;
  quantity: number;
  minimum_quantity: number;
  sale_price: number;
};

export function InventoryPage() {
  const { items, loading, error, create, remove } = useResource<Product>('/inventory');

  if (loading) return <Skeleton rows={6} />;
  if (error) return <div className="empty-state">{error}</div>;

  return (
    <DataTable<Product>
      title="Estoque"
      actionLabel="Novo produto"
      rows={items}
      onCreate={() => create({ name: 'Novo produto', sku: 'SKU-NOVO', barcode: '789000000000', quantity: 0, minimum_quantity: 5, sale_price: 0 })}
      onDelete={remove}
      columns={[
        { key: 'name', label: 'Produto' },
        { key: 'sku', label: 'SKU' },
        { key: 'barcode', label: 'Código de barras' },
        { key: 'quantity', label: 'Qtd.' },
        { key: 'sale_price', label: 'Venda', render: (item) => Number(item.sale_price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }
      ]}
    />
  );
}
