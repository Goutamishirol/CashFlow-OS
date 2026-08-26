import React from 'react';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { useBusiness } from '../../context/BusinessContext';
import { EmptyState } from '../common/EmptyState';
import { Building2 } from 'lucide-react';

export function AppLayout({ currentPage, setCurrentPage, children }) {
  const { businesses, loading, error, refreshBusinesses } = useBusiness();

  return (
    <div className="app-container">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="main-wrapper">
        <TopNavbar />
        <main className="page-content">
          {error && !businesses.length ? (
            <div className="glass-card highlight-rose" style={{ margin: '2rem 0', textAlign: 'center' }}>
              <h3 style={{ color: 'var(--rose-400)', marginBottom: '0.5rem' }}>
                Spring Boot Backend Offline or Unreachable
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                Unable to connect to <code>http://localhost:8080</code>. Please ensure your backend is running.
              </p>
              <button className="btn btn-secondary" onClick={() => refreshBusinesses()}>
                Try Reconnecting
              </button>
            </div>
          ) : !loading && businesses.length === 0 ? (
            <div style={{ marginTop: '3rem' }}>
              <EmptyState
                title="No Business Profiles Found"
                description="To view cash flow analytics, forecasts, and AI recommendations, create your first business profile."
                icon={Building2}
                actionText="Create Business Profile"
                onAction={() => setCurrentPage('settings')}
              />
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
