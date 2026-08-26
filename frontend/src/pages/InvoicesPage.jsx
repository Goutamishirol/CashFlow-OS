import React, { useState, useEffect, useCallback } from 'react';
import { useBusiness } from '../context/BusinessContext';
import { api } from '../api/client';
import { InvoiceTable } from '../components/invoices/InvoiceTable';
import { CreateInvoiceModal } from '../components/invoices/CreateInvoiceModal';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorAlert } from '../components/common/ErrorAlert';
import { StatCard } from '../components/common/StatCard';
import { Plus, Receipt, AlertCircle, CheckCircle, Clock } from 'lucide-react';

export function InvoicesPage({ setCurrentPage, setReminderTarget }) {
  const { selectedBusinessId } = useBusiness();

  const [invoices, setInvoices] = useState([]);
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, OVERDUE, PENDING, PAID
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const loadInvoices = useCallback(async () => {
    if (!selectedBusinessId) return;

    try {
      setLoading(true);
      setError(null);
      let data = [];
      if (activeTab === 'OVERDUE') {
        data = await api.getOverdueInvoices(selectedBusinessId);
      } else {
        data = await api.getInvoices(selectedBusinessId);
      }
      setInvoices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching invoices:', err);
      setError(err.message || 'Failed to load invoices');
    } finally {
      setLoading(false);
    }
  }, [selectedBusinessId, activeTab]);

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  const handleSendReminder = (invoice) => {
    if (setReminderTarget) {
      setReminderTarget({
        customerName: invoice.customerName,
        amount: invoice.amount,
        dueDate: invoice.dueDate,
      });
    }
    if (setCurrentPage) {
      setCurrentPage('collections');
    }
  };

  // Client-side filtering if user clicked PENDING or PAID tabs
  const filteredInvoices = invoices.filter((inv) => {
    if (activeTab === 'ALL' || activeTab === 'OVERDUE') return true;
    return inv.status === activeTab;
  });

  // Calculate stats
  const totalAmount = invoices.reduce((s, i) => s + Number(i.amount || 0), 0);
  const overdueAmount = invoices
    .filter((i) => i.status === 'OVERDUE')
    .reduce((s, i) => s + Number(i.amount || 0), 0);
  const pendingAmount = invoices
    .filter((i) => i.status === 'PENDING')
    .reduce((s, i) => s + Number(i.amount || 0), 0);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Invoices & Receivables</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Track client payment obligations, overdue invoices, and trigger AI collection reminders.
          </p>
        </div>

        <Button variant="primary" icon={Plus} onClick={() => setIsCreateOpen(true)}>
          New Invoice
        </Button>
      </div>

      {/* Summary KPI Cards */}
      <div className="stat-card-grid">
        <StatCard
          title="Total Invoiced"
          value={`₹${totalAmount.toLocaleString('en-IN')}`}
          subtitle={`${invoices.length} total records`}
          icon={Receipt}
          variant="indigo"
        />

        <StatCard
          title="Overdue Receivables"
          value={`₹${overdueAmount.toLocaleString('en-IN')}`}
          subtitle="Immediate follow-up needed"
          icon={AlertCircle}
          variant="rose"
          highlight={overdueAmount > 0 ? 'rose' : null}
        />

        <StatCard
          title="Pending Receivables"
          value={`₹${pendingAmount.toLocaleString('en-IN')}`}
          subtitle="Awaiting due date"
          icon={Clock}
          variant="amber"
        />
      </div>

      {/* Tabs & Table */}
      <div className="glass-card">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '0.75rem',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {[
              { id: 'ALL', label: 'All Invoices' },
              { id: 'OVERDUE', label: 'Overdue (Delayed)' },
              { id: 'PENDING', label: 'Pending' },
              { id: 'PAID', label: 'Paid / Settled' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '0.45rem 0.9rem',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: activeTab === tab.id ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                  color: activeTab === tab.id ? '#fff' : 'var(--text-secondary)',
                  borderBottom: activeTab === tab.id ? '2px solid var(--indigo-500)' : '2px solid transparent',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Showing {filteredInvoices.length} invoice{filteredInvoices.length === 1 ? '' : 's'}
          </span>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading invoice records..." />
        ) : error ? (
          <ErrorAlert message={error} onRetry={loadInvoices} />
        ) : (
          <InvoiceTable invoices={filteredInvoices} onSendReminder={handleSendReminder} />
        )}
      </div>

      {/* Create Modal */}
      <CreateInvoiceModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        businessId={selectedBusinessId}
        onCreated={loadInvoices}
      />
    </div>
  );
}
