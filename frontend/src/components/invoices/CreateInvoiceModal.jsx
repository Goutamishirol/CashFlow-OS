import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { api } from '../../api/client';

export function CreateInvoiceModal({ isOpen, onClose, businessId, onCreated }) {
  const [formData, setFormData] = useState({
    customerName: '',
    amount: '',
    dueDate: new Date().toISOString().split('T')[0],
    status: 'PENDING',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customerName.trim() || !formData.amount) return;

    try {
      setSubmitting(true);
      setError(null);
      await api.createInvoice({
        businessId: Number(businessId),
        customerName: formData.customerName.trim(),
        amount: parseFloat(formData.amount),
        dueDate: formData.dueDate,
        status: formData.status,
      });
      setFormData({
        customerName: '',
        amount: '',
        dueDate: new Date().toISOString().split('T')[0],
        status: 'PENDING',
      });
      if (onCreated) onCreated();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create invoice');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Invoice"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" loading={submitting} onClick={handleSubmit}>
            Save Invoice
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        {error && (
          <div
            style={{
              padding: '0.6rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--rose-bg)',
              color: 'var(--rose-400)',
              fontSize: '0.8rem',
              marginBottom: '1rem',
            }}
          >
            {error}
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Customer / Client Name *</label>
          <input
            type="text"
            required
            className="form-input"
            placeholder="e.g. Reliance Retail / TechCorp"
            value={formData.customerName}
            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Invoice Amount (₹) *</label>
          <input
            type="number"
            step="any"
            required
            className="form-input mono"
            placeholder="e.g. 25000"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Due Date *</label>
          <input
            type="date"
            required
            className="form-input mono"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Status *</label>
          <select
            className="form-select"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="PENDING">PENDING (Awaiting Payment)</option>
            <option value="PAID">PAID (Settled)</option>
            <option value="OVERDUE">OVERDUE (Payment Delayed)</option>
          </select>
        </div>
      </form>
    </Modal>
  );
}
