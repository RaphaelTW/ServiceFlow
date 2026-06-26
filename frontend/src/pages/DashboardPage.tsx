import { useEffect, useState } from 'react';
import { CalendarClock, ClipboardCheck, ClipboardList, DollarSign, Users } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Area, AreaChart } from 'recharts';
import { api } from '../services/api';
import { DashboardData } from '../types';
import { StatCard } from '../components/StatCard';
import { Skeleton } from '../components/Skeleton';

const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api<DashboardData>('/dashboard').then(setData).catch((err) => setError(err.message));
  }, []);

  if (error) {
    return <div className="empty-state">{error}</div>;
  }

  if (!data) {
    return <Skeleton rows={8} />;
  }

  const metrics = data.metrics;

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <span className="eyebrow">Visão geral</span>
          <h1>Dashboard</h1>
        </div>
        <button className="primary-button">Nova ordem</button>
      </div>
      <div className="stat-grid">
        <StatCard label="Clientes" value={String(metrics.customers_count ?? 0)} hint="Base ativa" icon={Users} tone="blue" />
        <StatCard label="OS abertas" value={String(metrics.open_orders ?? 0)} hint="Aguardando ação" icon={ClipboardList} tone="amber" />
        <StatCard label="Concluídas" value={String(metrics.completed_orders ?? 0)} hint="Histórico operacional" icon={ClipboardCheck} tone="green" />
        <StatCard label="Receita mensal" value={money.format(Number(metrics.monthly_revenue ?? 0))} hint="Entradas do mês" icon={DollarSign} tone="rose" />
      </div>
      <div className="dashboard-grid">
        <article className="panel wide">
          <h2>Fluxo financeiro</h2>
          <ResponsiveContainer height={280}>
            <AreaChart data={data.financial_chart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d8dee9" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="income" stroke="#0f766e" fill="#ccfbf1" />
              <Area type="monotone" dataKey="expense" stroke="#dc2626" fill="#fee2e2" />
            </AreaChart>
          </ResponsiveContainer>
        </article>
        <article className="panel">
          <h2>Serviços</h2>
          <ResponsiveContainer height={280}>
            <BarChart data={data.services_chart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d8dee9" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </article>
        <article className="panel">
          <h2>Próximos atendimentos</h2>
          <div className="timeline">
            {data.upcoming.map((order) => (
              <div key={order.id}>
                <CalendarClock size={18} />
                <span>{order.title}</span>
                <small>{order.scheduled_at ? new Date(order.scheduled_at).toLocaleString('pt-BR') : 'Sem data'}</small>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

