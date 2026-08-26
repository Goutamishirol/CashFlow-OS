import React from 'react';
import { Database, Plus } from 'lucide-react';
import { Button } from './Button';

export function EmptyState({
  title = 'No records found',
  description = 'Get started by creating your first entry.',
  icon: Icon = Database,
  actionText = null,
  onAction = null,
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.015)',
        borderRadius: 'var(--radius-lg)',
        border: '1px dashed var(--border-subtle)',
        gap: '0.75rem',
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: 'var(--radius-lg)',
          background: 'rgba(255, 255, 255, 0.04)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)',
          marginBottom: '0.25rem',
        }}
      >
        <Icon size={24} />
      </div>
      <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{title}</h4>
      <p
        style={{
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          maxWidth: '380px',
        }}
      >
        {description}
      </p>
      {actionText && onAction && (
        <div style={{ marginTop: '0.5rem' }}>
          <Button variant="primary" size="sm" icon={Plus} onClick={onAction}>
            {actionText}
          </Button>
        </div>
      )}
    </div>
  );
}
