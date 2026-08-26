import React, { useState, useEffect, useCallback } from 'react';
import { useBusiness } from '../context/BusinessContext';
import { api } from '../api/client';
import { TransactionTable } from '../components/transactions/TransactionTable';
import { CreateTransactionModal } from '../components/transactions/CreateTransactionModal';
import { CsvUploadModal } from '../components/transactions/CsvUploadModal';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorAlert } from '../components/common/ErrorAlert';
import { StatCard } from '../components/common/StatCard';
import { Plus, UploadCloud, ArrowDownLeft, ArrowUpRight, ArrowLeftRight } from 'lucide-react';

export function TransactionsPage() {
  const { selectedBusinessId } = useBusiness();

  const [transactions, setTransactions] = useState([]);
  const [filterType, setFilterType] = useState('ALL'); // ALL, INCOME, EXPENSE
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCsvOpen, setIsCsvOpen] = useState(false);

  const loadTransactions = useCallback(async () => {
    if (!selectedBusinessId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await api.getTransactions(selectedBusinessId);
      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err.message || 'Failed to load transaction history');
    } finally {
      setLoading(false);
    }
  }, [selectedBusinessId]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const filteredTransactions = transactions.filter((t) => {
    if (filterType === 'ALL') return true;
    return t.type === filterType;
  });

  const totalIncome = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Transactions Ledger</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Historical income and expense records driving average daily burn rate calculations.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <Button variant="secondary" icon={UploadCloud} onClick={() => setIsCsvOpen(true)}>
            Import CSV
          </Button>
          <Button variant="primary" icon={Plus} onClick={() => setIsCreateOpen(true)}>
            Record Transaction
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="stat-card-grid">
        <StatCard
          title="Total Inflow (Income)"
          value={`+₹${totalIncome.toLocaleString('en-IN')}`}
          subtitle="Cumulative revenues and receipts"
          icon={ArrowDownLeft}
          variant="emerald"
        />

        <StatCard
          title="Total Outflow (Expenses)"
          value={`-₹${totalExpenses.toLocaleString('en-IN')}`}
          subtitle="Cumulative operational expenses"
          icon={ArrowUpRight}
          variant="rose"
        />

        <StatCard
          title="Net Cash Movement"
          value={`${totalIncome - totalExpenses >= 0 ? '+' : ''}₹${(totalIncome - totalExpenses).toLocaleString('en-IN')}`}
          subtitle={`${transactions.length} recorded transactions`}
          icon={ArrowLeftRight}
          variant={totalIncome - totalExpenses >= 0 ? 'emerald' : 'rose'}
        />
      </div>

      {/* Table Section */}
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
            {['ALL', 'INCOME', 'EXPENSE'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                style={{
                  padding: '0.45rem 0.9rem',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: filterType === type ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                  color: filterType === type ? '#fff' : 'var(--text-secondary)',
                  borderBottom: filterType === type ? '2px solid var(--indigo-500)' : '2px solid transparent',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                }}
              >
                {type === 'ALL' ? 'All Records' : type}
              </button>
            ))}
          </div>

          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Showing {filteredTransactions.length} transaction{filteredTransactions.length === 1 ? '' : 's'}
          </span>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading transaction ledger..." />
        ) : error ? (
          <ErrorAlert message={error} onRetry={loadTransactions} />
        ) : (
          <TransactionTable transactions={filteredTransactions} />
        )}
      </div>

      {/* Modals */}
      <CreateTransactionModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        businessId={selectedBusinessId}
        onCreated={loadTransactions}
      />

      <CsvUploadModal
        isOpen={isCsvOpen}
        onClose={() => setIsCsvOpen(false)}
        businessId={selectedBusinessId}
        onUploaded={loadTransactions}
      />
    </div>
  );
}
