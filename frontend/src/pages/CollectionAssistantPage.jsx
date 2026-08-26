import React, { useState, useEffect } from 'react';
import { useBusiness } from '../context/BusinessContext';
import { api } from '../api/client';
import { WhatsAppPreviewCard } from '../components/collections/WhatsAppPreviewCard';
import { Button } from '../components/common/Button';
import { MessageSquare, Sparkles, Send, CheckCircle } from 'lucide-react';

export function CollectionAssistantPage({ initialTarget = null }) {
  const { selectedBusinessId } = useBusiness();

  const [overdueInvoices, setOverdueInvoices] = useState([]);
  const [formData, setFormData] = useState({
    customerName: initialTarget?.customerName || '',
    amount: initialTarget?.amount ? String(initialTarget.amount) : '',
    dueDate: initialTarget?.dueDate || new Date().toISOString().split('T')[0],
  });

  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [generatedMessage, setGeneratedMessage] = useState(null);

  useEffect(() => {
    if (initialTarget) {
      setFormData({
        customerName: initialTarget.customerName || '',
        amount: initialTarget.amount ? String(initialTarget.amount) : '',
        dueDate: initialTarget.dueDate || new Date().toISOString().split('T')[0],
      });
    }
  }, [initialTarget]);

  useEffect(() => {
    if (!selectedBusinessId) return;
    api
      .getOverdueInvoices(selectedBusinessId)
      .then((data) => setOverdueInvoices(Array.isArray(data) ? data : []))
      .catch((err) => console.error('Failed to load overdue invoices for collection assistant:', err));
  }, [selectedBusinessId]);

  const handleSelectOverdue = (inv) => {
    setFormData({
      customerName: inv.customerName,
      amount: String(inv.amount),
      dueDate: inv.dueDate,
    });
    setGeneratedMessage(null);
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!formData.customerName.trim() || !formData.amount || !formData.dueDate) return;

    try {
      setGenerating(true);
      setError(null);
      const res = await api.generateCollectionMessage({
        customerName: formData.customerName.trim(),
        amount: parseFloat(formData.amount),
        dueDate: formData.dueDate,
      });
      setGeneratedMessage(res);
    } catch (err) {
      console.error('Error generating WhatsApp reminder:', err);
      setError(err.message || 'Failed to generate reminder message with Gemini AI');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>AI Payment Collection Assistant</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Generate polite, firm, and professional WhatsApp collection reminders powered by Gemini AI.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {/* Form Card */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, #10B981, #25D366)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
              }}
            >
              <MessageSquare size={16} />
            </div>
            <h3 style={{ fontSize: '1.1rem' }}>Reminder Details</h3>
          </div>

          {error && (
            <div
              style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--rose-bg)',
                color: 'var(--rose-400)',
                fontSize: '0.825rem',
                marginBottom: '1rem',
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleGenerate}>
            <div className="form-group">
              <label className="form-label">Customer Name *</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. Apex Enterprises"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Outstanding Amount (₹) *</label>
              <input
                type="number"
                step="any"
                required
                className="form-input mono"
                placeholder="e.g. 24000"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Original Due Date *</label>
              <input
                type="date"
                required
                className="form-input mono"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <Button
                type="submit"
                variant="primary"
                icon={Sparkles}
                loading={generating}
                className="w-full"
              >
                Generate WhatsApp Reminder
              </Button>
            </div>
          </form>
        </div>

        {/* Overdue Debtors Quick Select */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Pending & Overdue Invoices</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem', marginBottom: '1rem' }}>
            Click an overdue customer to auto-fill payment reminder details:
          </p>

          {overdueInvoices.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              No overdue invoices detected for this business profile.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '300px', overflowY: 'auto' }}>
              {overdueInvoices.map((inv) => (
                <div
                  key={inv.id}
                  onClick={() => handleSelectOverdue(inv)}
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.025)',
                    border: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'var(--transition)',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{inv.customerName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--rose-400)' }}>
                      Due: {inv.dueDate || 'Overdue'}
                    </div>
                  </div>
                  <span className="mono" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                    ₹{Number(inv.amount || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Generated WhatsApp Output Card */}
      <WhatsAppPreviewCard
        message={generatedMessage}
        customerName={formData.customerName}
        amount={formData.amount}
        dueDate={formData.dueDate}
      />
    </div>
  );
}
