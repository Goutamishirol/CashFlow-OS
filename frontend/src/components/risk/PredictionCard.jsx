import React from 'react';
import { Badge } from '../common/Badge';
import { Clock, HelpCircle } from 'lucide-react';

export function PredictionCard({ prediction }) {
  const { customerName, latePaymentProbability, expectedDelayDays, riskLevel, reason } = prediction;

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <h4 style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{customerName}</h4>
        <Badge variant={riskLevel}>{riskLevel} RISK</Badge>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '0.75rem 0' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.3rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Late Payment Probability</span>
            <span style={{ fontWeight: 700, color: latePaymentProbability >= 70 ? 'var(--rose-400)' : 'var(--emerald-400)' }}>
              {Math.round(latePaymentProbability)}%
            </span>
          </div>
          <div
            style={{
              height: '6px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(255, 255, 255, 0.08)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${Math.min(100, Math.max(0, latePaymentProbability))}%`,
                height: '100%',
                background:
                  latePaymentProbability >= 70
                    ? 'var(--rose-400)'
                    : latePaymentProbability >= 40
                    ? 'var(--amber-400)'
                    : 'var(--emerald-400)',
                borderRadius: 'var(--radius-full)',
                transition: 'width 0.6s ease',
              }}
            />
          </div>
        </div>

        <div
          style={{
            padding: '0.5rem 0.75rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(0, 0, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            flexShrink: 0,
          }}
        >
          <Clock size={14} style={{ color: 'var(--indigo-400)' }} />
          <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>
            +{expectedDelayDays} {expectedDelayDays === 1 ? 'day' : 'days'}
          </span>
        </div>
      </div>

      {reason && (
        <div
          style={{
            fontSize: '0.775rem',
            color: 'var(--text-secondary)',
            background: 'rgba(255, 255, 255, 0.02)',
            padding: '0.5rem 0.75rem',
            borderRadius: 'var(--radius-md)',
            borderLeft: '2px solid var(--indigo-500)',
            marginTop: '0.5rem',
          }}
        >
          {reason}
        </div>
      )}
    </div>
  );
}
