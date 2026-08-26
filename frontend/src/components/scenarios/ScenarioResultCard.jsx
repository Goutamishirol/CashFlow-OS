import React from 'react';
import { ArrowRight, CheckCircle2, AlertTriangle, Database } from 'lucide-react';
import { Badge } from '../common/Badge';

export function ScenarioResultCard({ result }) {
  if (!result) return null;

  const {
    projectedBalanceBefore,
    projectedBalanceAfter,
    balanceDifference,
    shortageDetectedBefore,
    shortageDetectedAfter,
    message,
  } = result;

  const isPositiveDiff = Number(balanceDifference || 0) >= 0;

  return (
    <div
      className={`glass-card ${
        shortageDetectedBefore && !shortageDetectedAfter
          ? 'highlight-emerald'
          : !shortageDetectedBefore && shortageDetectedAfter
          ? 'highlight-rose'
          : 'highlight-indigo'
      }`}
      style={{ marginTop: '1.5rem' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h4 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>
          Scenario Impact Analysis
        </h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--emerald-400)', fontSize: '0.75rem' }}>
          <Database size={14} />
          <span>Committed to PostgreSQL</span>
        </div>
      </div>

      {message && (
        <div
          style={{
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.85rem',
            color: 'var(--text-primary)',
            marginBottom: '1.25rem',
          }}
        >
          {message}
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
        }}
      >
        <div
          style={{
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
            Projected Balance (Before)
          </span>
          <div className="mono" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
            ₹{Number(projectedBalanceBefore || 0).toLocaleString('en-IN')}
          </div>
          <div style={{ marginTop: '0.4rem' }}>
            <Badge variant={shortageDetectedBefore ? 'danger' : 'healthy'}>
              {shortageDetectedBefore ? 'Shortage Detected' : 'Safe Runway'}
            </Badge>
          </div>
        </div>

        <div
          style={{
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
            Projected Balance (After)
          </span>
          <div className="mono" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            ₹{Number(projectedBalanceAfter || 0).toLocaleString('en-IN')}
          </div>
          <div style={{ marginTop: '0.4rem' }}>
            <Badge variant={shortageDetectedAfter ? 'danger' : 'healthy'}>
              {shortageDetectedAfter ? 'Shortage Detected' : 'Safe Runway'}
            </Badge>
          </div>
        </div>

        <div
          style={{
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            background: isPositiveDiff ? 'var(--emerald-bg)' : 'var(--rose-bg)',
            border: `1px solid ${isPositiveDiff ? 'var(--emerald-border)' : 'var(--rose-border)'}`,
          }}
        >
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
            Net Variance
          </span>
          <div
            className="mono"
            style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              color: isPositiveDiff ? 'var(--emerald-400)' : 'var(--rose-400)',
            }}
          >
            {isPositiveDiff ? '+' : ''}₹{Number(balanceDifference || 0).toLocaleString('en-IN')}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginTop: '0.4rem' }}>
            {isPositiveDiff ? 'Liquidity improved' : 'Liquidity depleted'}
          </span>
        </div>
      </div>
    </div>
  );
}
