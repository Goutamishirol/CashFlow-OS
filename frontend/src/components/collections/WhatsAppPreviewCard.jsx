import React, { useState } from 'react';
import { Copy, Check, ExternalLink, MessageSquare } from 'lucide-react';
import { Button } from '../common/Button';

export function WhatsAppPreviewCard({ message, customerName, amount, dueDate }) {
  const [copied, setCopied] = useState(false);

  if (!message) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenWhatsApp = () => {
    const encoded = encodeURIComponent(message);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="glass-card highlight-indigo" style={{ marginTop: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(37, 211, 102, 0.15)',
              color: '#25D366',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MessageSquare size={16} />
          </div>
          <div>
            <h4 style={{ fontSize: '1rem' }}>AI Generated WhatsApp Reminder</h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Tailored for {customerName || 'Customer'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="secondary" size="sm" icon={copied ? Check : Copy} onClick={handleCopy}>
            {copied ? 'Copied!' : 'Copy Text'}
          </Button>
          <Button variant="primary" size="sm" icon={ExternalLink} onClick={handleOpenWhatsApp}>
            Open WhatsApp
          </Button>
        </div>
      </div>

      {/* WhatsApp Chat Preview Bubble */}
      <div
        style={{
          background: '#0B141A',
          backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
          backgroundSize: '16px 16px',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        <div
          style={{
            background: '#005C4B',
            color: '#E9EDEF',
            borderRadius: '12px 12px 2px 12px',
            padding: '1rem 1.25rem',
            maxWidth: '520px',
            marginLeft: 'auto',
            fontSize: '0.9rem',
            lineHeight: 1.6,
            whiteSpace: 'pre-wrap',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
          }}
        >
          {message}
          <div
            style={{
              fontSize: '0.65rem',
              color: 'rgba(233, 237, 239, 0.6)',
              textAlign: 'right',
              marginTop: '0.5rem',
            }}
          >
            Delivered • Just now
          </div>
        </div>
      </div>
    </div>
  );
}
