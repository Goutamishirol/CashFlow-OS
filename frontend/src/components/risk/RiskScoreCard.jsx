import React from 'react';
import { Badge } from '../common/Badge';
import { User, AlertCircle, Clock } from 'lucide-react';

export function RiskScoreCard({ score }) {
  const { customerName, totalInvoices, overdueInvoices, overdueRate, totalOutstanding, riskLevel } = score;
  const overduePercent = Math.round((overdueRate || 0) * 100);

  return (
    <div className={`glass-card ${riskLevel === 'HIGH' ? 'highlight-rose' : ''}`}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
            }}
          >
            <User size={16} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.95rem' }}>{customerName}</h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {totalInvoices} total {totalInvoices === 1 ? 'invoice' : 'invoices'}
            </span>
          </div>
        </div>

        <Badge variant={riskLevel}>{riskLevel} RISK</Badge>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1rem' }}>
        <div
          style={{
            padding: '0.65rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(0, 0, 0, 0.25)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>
            Overdue Rate
          </span>
          <span
            style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              color: overduePercent >= 50 ? 'var(--rose-400)' : overduePercent >= 20 ? 'var(--amber-400)' : 'var(--emerald-400)',
            }}
          >
            {overduePercent}%
          </span>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>
            ({overdueInvoices} overdue)
          </span>
        </div>

        <div
          style={{
            padding: '0.65rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(0, 0, 0, 0.25)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>
            Total Outstanding
          </span>
          <span className="mono" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            ₹{Number(totalOutstanding || 0).toLocaleString('en-IN')}
          </span>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>
            Uncollected
          </span>
        </div>
      </div>
    </div>
  );
}
