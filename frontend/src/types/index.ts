export type User = {
  id: number;
  tenant_id: number;
  name: string;
  email: string;
  role: string;
};

export type Customer = {
  id: number;
  name: string;
  document?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  city?: string;
  state?: string;
};

export type WorkOrder = {
  id: number;
  code: string;
  title: string;
  status: 'open' | 'in_progress' | 'completed' | 'canceled';
  scheduled_at?: string;
  total: number;
};

export type DashboardData = {
  metrics: {
    customers_count: number;
    open_orders: number;
    completed_orders: number;
    monthly_revenue: number;
    annual_revenue: number;
  };
  financial_chart: Array<{ period: string; income: number; expense: number }>;
  services_chart: Array<{ name: string; total: number }>;
  upcoming: WorkOrder[];
};

