import { ReactNode, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { CustomersPage } from './pages/CustomersPage';
import { OrdersPage } from './pages/OrdersPage';
import { FinancePage } from './pages/FinancePage';
import { InventoryPage } from './pages/InventoryPage';
import { SettingsPage } from './pages/SettingsPage';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [page, setPage] = useState('dashboard');

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const pages: Record<string, ReactNode> = {
    dashboard: <DashboardPage />,
    customers: <CustomersPage />,
    orders: <OrdersPage />,
    calendar: <OrdersPage />,
    finance: <FinancePage />,
    inventory: <InventoryPage />,
    reports: <DashboardPage />,
    settings: <SettingsPage />
  };

  return (
    <Layout active={page} onNavigate={setPage}>
      {pages[page] ?? <DashboardPage />}
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
