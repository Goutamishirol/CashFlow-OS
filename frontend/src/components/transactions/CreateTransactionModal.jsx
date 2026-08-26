import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { api } from '../../api/client';

export function CreateTransactionModal({ isOpen, onClose, businessId, onCreated }) {
  const [formData, setFormData] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    type: 'EXPENSE',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.date) return;

    try {
      setSubmitting(true);
      setError(null);
      await api.createTransaction({
        businessId: Number(businessId),
        amount: parseFloat(formData.amount),
        date: formData.date,
        type: formData.type,
        description: formData.description.trim(),
      });
      setFormData({
        amount: '',
        date: new Date().toISOString().split('T')[0],
        type: 'EXPENSE',
        description: '',
      });
      if (onCreated) onCreated();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to record transaction');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record New Transaction"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" loading={submitting} onClick={handleSubmit}>
            Save Transaction
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
          <label className="form-label">Transaction Type *</label>
          <select
            className="form-select"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="INCOME">INCOME (Customer Payment, Revenue, Inflow)</option>
            <option value="EXPENSE">EXPENSE (Supplier, Payroll, Rent, Outflow)</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Amount (₹) *</label>
          <input
            type="number"
            step="any"
            required
            className="form-input mono"
            placeholder="e.g. 15000"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Transaction Date *</label>
          <input
            type="date"
            required
            className="form-input mono"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description / Memo</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Raw Material Procurement / Client Retainer"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
      </form>
    </Modal>
  );
}
