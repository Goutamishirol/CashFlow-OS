import React from 'react';
import { Badge } from '../common/Badge';
import { ArrowDownLeft, ArrowUpRight, Calendar } from 'lucide-react';

export function TransactionTable({ transactions = [] }) {
  if (!transactions || transactions.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
        No transactions recorded yet.
      </div>
    );
  }

  // Sort by date descending
  const sorted = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Txn ID</th>
            <th>Date</th>
            <th>Type</th>
            <th>Description</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((t) => {
            const isIncome = t.type === 'INCOME';
            return (
              <tr key={t.id}>
                <td className="mono" style={{ color: 'var(--text-muted)' }}>
                  #TXN-{t.id}
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                    <Calendar size={14} />
                    {t.date}
                  </div>
                </td>
                <td>
                  <Badge variant={t.type} icon={isIncome ? ArrowDownLeft : ArrowUpRight}>
                    {t.type}
                  </Badge>
                </td>
                <td style={{ fontWeight: 500 }}>{t.description || '—'}</td>
                <td
                  className="mono"
                  style={{
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    color: isIncome ? 'var(--emerald-400)' : 'var(--rose-400)',
                  }}
                >
                  {isIncome ? '+' : '-'}₹{Number(t.amount || 0).toLocaleString('en-IN')}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
