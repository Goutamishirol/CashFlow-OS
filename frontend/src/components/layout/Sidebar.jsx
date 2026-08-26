import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  Receipt,
  ArrowLeftRight,
  ShieldAlert,
  Sparkles,
  MessageSquare,
  Building2,
  Cpu,
} from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';

export function Sidebar({ currentPage, setCurrentPage }) {
  const { selectedBusiness, backendOnline } = useBusiness();

  const navItems = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'forecast', label: 'Cash Flow Forecast', icon: TrendingUp },
    { id: 'invoices', label: 'Invoices & Overdue', icon: Receipt },
    { id: 'transactions', label: 'Transactions Ledger', icon: ArrowLeftRight },
    { id: 'risk', label: 'Customer Risk & Delays', icon: ShieldAlert },
    { id: 'scenarios', label: 'What-If Scenarios', icon: Sparkles },
    { id: 'collections', label: 'AI Collections (WhatsApp)', icon: MessageSquare },
    { id: 'settings', label: 'Business Settings', icon: Building2 },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo-icon">
          <Cpu size={22} />
        </div>
        <div>
          <div className="sidebar-brand-title">CashFlow OS</div>
          <span className="sidebar-brand-badge">Fintech AI</span>
        </div>
      </div>

      <div style={{ padding: '0.75rem 1rem 0', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Active Entity
        </span>
        <div
          style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {selectedBusiness ? selectedBusiness.name : 'No Business Selected'}
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-title">Navigation</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              className={`nav-link-btn ${isActive ? 'active' : ''}`}
              onClick={() => setCurrentPage(item.id)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="backend-status-pill">
          <span className={`status-dot ${backendOnline ? 'online' : 'offline'}`} />
          <span>Spring Boot: {backendOnline ? 'Connected' : 'Offline'}</span>
        </div>
      </div>
    </aside>
  );
}
