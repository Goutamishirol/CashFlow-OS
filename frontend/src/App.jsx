import React, { useEffect, useState } from 'react';
import { BusinessProvider } from './context/BusinessContext';
import { useAuth } from './context/AuthContext';
import { AppLayout } from './components/layout/AppLayout';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';

import { DashboardPage } from './pages/DashboardPage';
import { ForecastPage } from './pages/ForecastPage';
import { InvoicesPage } from './pages/InvoicesPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { CustomerRiskPage } from './pages/CustomerRiskPage';
import { ScenarioSimulatorPage } from './pages/ScenarioSimulatorPage';
import { CollectionAssistantPage } from './pages/CollectionAssistantPage';
import { BusinessSettingsPage } from './pages/BusinessSettingsPage';

export default function App() {
  const { user, loading } = useAuth();
  const [path, setPath] = useState(window.location.pathname);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [reminderTarget, setReminderTarget] = useState(null);

  useEffect(() => {
    const handleNavigation = () => setPath(window.location.pathname);
    window.addEventListener('popstate', handleNavigation);
    return () => window.removeEventListener('popstate', handleNavigation);
  }, []);

  if (loading) return <div className="auth-page">Loading CashFlow OS...</div>;
  if (!user) return path === '/signup' ? <SignupPage /> : <LoginPage />;

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage setCurrentPage={setCurrentPage} />;
      case 'forecast':
        return <ForecastPage />;
      case 'invoices':
        return (
          <InvoicesPage
            setCurrentPage={setCurrentPage}
            setReminderTarget={setReminderTarget}
          />
        );
      case 'transactions':
        return <TransactionsPage />;
      case 'risk':
        return <CustomerRiskPage />;
      case 'scenarios':
        return <ScenarioSimulatorPage />;
      case 'collections':
        return <CollectionAssistantPage initialTarget={reminderTarget} />;
      case 'settings':
        return <BusinessSettingsPage />;
      default:
        return <DashboardPage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <BusinessProvider>
      <AppLayout currentPage={currentPage} setCurrentPage={setCurrentPage}>
        {renderPage()}
      </AppLayout>
    </BusinessProvider>
  );
}
