import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export function ErrorAlert({
  message = 'An unexpected error occurred while communicating with the backend.',
  onRetry = null,
}) {
  return (
    <div
      style={{
        padding: '1.25rem',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--rose-bg)',
        border: '1px solid var(--rose-border)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '1rem',
        margin: '1rem 0',
      }}
    >
      <div style={{ color: 'var(--rose-400)', marginTop: '2px' }}>
        <AlertCircle size={20} />
      </div>
      <div style={{ flex: 1 }}>
        <h4 style={{ fontSize: '0.9rem', color: 'var(--rose-400)', marginBottom: '0.25rem' }}>
          Connection / Request Error
        </h4>
        <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>{message}</p>
      </div>
      {onRetry && (
        <Button variant="secondary" size="sm" icon={RefreshCw} onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}
