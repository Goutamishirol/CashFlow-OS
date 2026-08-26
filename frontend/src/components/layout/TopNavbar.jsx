import React, { useState } from 'react';
import { Building2, Plus, RefreshCw, AlertCircle } from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';

export function TopNavbar() {
  const { user, logout } = useAuth();
  const { businesses, selectedBusiness, selectedBusinessId, selectBusiness, addBusiness, refreshBusinesses, loading, backendOnline } =
    useBusiness();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', currentBalance: '', monthlyExpenses: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      setSubmitting(true);
      setSubmitError(null);
      await addBusiness({
        name: formData.name.trim(),
        currentBalance: parseFloat(formData.currentBalance) || 0,
        monthlyExpenses: parseFloat(formData.monthlyExpenses) || 0,
      });
      setFormData({ name: '', currentBalance: '', monthlyExpenses: '' });
      setIsCreateModalOpen(false);
    } catch (err) {
      setSubmitError(err.message || 'Failed to create business');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <header className="top-navbar">
        <div className="top-navbar-left">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Building2 size={18} style={{ color: 'var(--indigo-400)' }} />
            <select
              className="form-select"
              style={{ width: 'auto', minWidth: '200px', background: 'rgba(0, 0, 0, 0.4)' }}
              value={selectedBusinessId || ''}
              onChange={(e) => selectBusiness(e.target.value)}
              disabled={businesses.length === 0}
            >
              {businesses.length === 0 ? (
                <option value="">No businesses found</option>
              ) : (
                businesses.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} (₹{Number(b.currentBalance || 0).toLocaleString('en-IN')})
                  </option>
                ))
              )}
            </select>
          </div>

          <Button
            variant="secondary"
            size="sm"
            icon={Plus}
            onClick={() => setIsCreateModalOpen(true)}
          >
            New Business
          </Button>
        </div>

        <div className="top-navbar-right">
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{user?.fullName}</span>
          <Button variant="secondary" size="sm" onClick={logout}>Logout</Button>
          {!backendOnline && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.75rem',
                color: 'var(--rose-400)',
                background: 'var(--rose-bg)',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--rose-border)',
              }}
            >
              <AlertCircle size={14} />
              <span>Backend Disconnected</span>
            </div>
          )}

          <Button
            variant="secondary"
            size="sm"
            icon={RefreshCw}
            loading={loading}
            onClick={() => refreshBusinesses()}
            title="Reload Data from PostgreSQL"
          >
            Sync
          </Button>
        </div>
      </header>

      {/* New Business Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Register New Business"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" loading={submitting} onClick={handleCreateSubmit}>
              Create Profile
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateSubmit}>
          {submitError && (
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
              {submitError}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Business Name *</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. Apex Retailers Pvt Ltd"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Opening Cash Balance (₹) *</label>
            <input
              type="number"
              step="any"
              required
              className="form-input mono"
              placeholder="e.g. 150000"
              value={formData.currentBalance}
              onChange={(e) => setFormData({ ...formData, currentBalance: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Estimated Monthly Expenses (₹) *</label>
            <input
              type="number"
              step="any"
              required
              className="form-input mono"
              placeholder="e.g. 50000"
              value={formData.monthlyExpenses}
              onChange={(e) => setFormData({ ...formData, monthlyExpenses: e.target.value })}
            />
          </div>
        </form>
      </Modal>
    </>
  );
}
