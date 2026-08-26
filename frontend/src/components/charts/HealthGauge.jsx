import React from 'react';
import { ShieldCheck, ShieldAlert } from 'lucide-react';
import { Badge } from '../common/Badge';

export function HealthGauge({ score = 100, status = 'HEALTHY', borrowingSafe = true, explanation = '' }) {
  // Score clamped between 0 and 100
  const normalizedScore = Math.max(0, Math.min(100, score));

  // Semicircle gauge calculation
  const radius = 65;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  const getColor = () => {
    if (normalizedScore >= 80) return 'var(--emerald-400)';
    if (normalizedScore >= 60) return 'var(--amber-400)';
    return 'var(--rose-400)';
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '0.5rem',
      }}
    >
      <div style={{ position: 'relative', width: '160px', height: '95px' }}>
        <svg width="160" height="95" viewBox="0 0 160 95" style={{ overflow: 'visible' }}>
          {/* Background arc */}
          <path
            d="M 15 85 A 65 65 0 0 1 145 85"
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Progress arc */}
          <path
            d="M 15 85 A 65 65 0 0 1 145 85"
            fill="none"
            stroke={getColor()}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
          />
        </svg>

        {/* Center Score Text */}
        <div
          style={{
            position: 'absolute',
            bottom: '0px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: '2rem',
              fontWeight: 800,
              color: getColor(),
              lineHeight: 1,
            }}
          >
            {normalizedScore}
          </span>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Health Score
          </span>
        </div>
      </div>

      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <Badge variant={status}>{status}</Badge>

        {borrowingSafe ? (
          <Badge variant="emerald" icon={ShieldCheck}>
            Borrowing Safe
          </Badge>
        ) : (
          <Badge variant="rose" icon={ShieldAlert}>
            Borrowing Unsafe
          </Badge>
        )}
      </div>

      {explanation && (
        <p
          style={{
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            marginTop: '0.75rem',
            lineHeight: 1.4,
            maxWidth: '320px',
          }}
        >
          {explanation}
        </p>
      )}
    </div>
  );
}
