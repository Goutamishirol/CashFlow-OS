import React, { useState } from 'react';
import { useBusiness } from '../context/BusinessContext';
import { api } from '../api/client';
import { ScenarioResultCard } from '../components/scenarios/ScenarioResultCard';
import { Button } from '../components/common/Button';
import { Sparkles, ArrowRight, Play, CheckCircle } from 'lucide-react';

export function ScenarioSimulatorPage() {
  const { selectedBusiness, selectedBusinessId, refreshBusinesses } = useBusiness();

  const [formData, setFormData] = useState({
    type: 'CUSTOMER_PAYMENT',
    amount: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [simulating, setSimulating] = useState(false);
  const [error, setError] = useState(null);
  const [scenarioResult, setScenarioResult] = useState(null);

  const handleSimulate = async (e) => {
    e.preventDefault();
    if (!selectedBusinessId || !formData.amount || !formData.date) return;

    try {
      setSimulating(true);
      setError(null);

      const result = await api.applyScenario(selectedBusinessId, {
        type: formData.type,
        amount: parseFloat(formData.amount),
        date: formData.date,
      });

      setScenarioResult(result);
      // Refresh global context to update business balances
      if (refreshBusinesses) {
        refreshBusinesses();
      }
    } catch (err) {
      console.error('Error running scenario simulation:', err);
      setError(err.message || 'Failed to simulate scenario');
    } finally {
      setSimulating(false);
    }
  };

  const handleApplyPreset = (type, amount) => {
    setFormData({
      type,
      amount: String(amount),
      date: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>"What-If" Financial Scenario Simulator</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Simulate prospective customer collections or sudden expenses to see impact on cash runway before committing.
        </p>
      </div>

      {/* Simulator Form Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {/* Scenario Input Card */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, #10B981, #6366F1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
              }}
            >
              <Sparkles size={16} />
            </div>
            <h3 style={{ fontSize: '1.1rem' }}>Configure Simulation Parameters</h3>
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

          <form onSubmit={handleSimulate}>
            <div className="form-group">
              <label className="form-label">Scenario Event Type *</label>
              <select
                className="form-select"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="CUSTOMER_PAYMENT">Customer Payment / Revenue (Inflow)</option>
                <option value="EXPENSE">Unplanned Expense / Capital Purchase (Outflow)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Simulated Amount (₹) *</label>
              <input
                type="number"
                step="any"
                required
                className="form-input mono"
                placeholder="e.g. 50000"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Simulated Event Date *</label>
              <input
                type="date"
                required
                className="form-input mono"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <Button
                type="submit"
                variant="primary"
                icon={Play}
                loading={simulating}
                className="w-full"
              >
                Simulate & Apply Scenario
              </Button>
            </div>
          </form>
        </div>

        {/* Preset Scenarios Card */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Quick Scenario Presets</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem', marginBottom: '1.25rem' }}>
            Click any common business scenario to auto-populate parameters:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div
              onClick={() => handleApplyPreset('CUSTOMER_PAYMENT', 25000)}
              style={{
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid var(--emerald-border)',
                cursor: 'pointer',
                transition: 'var(--transition)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, color: 'var(--emerald-400)', fontSize: '0.9rem' }}>
                  Early Customer Collection
                </span>
                <span className="mono" style={{ fontWeight: 700, color: '#fff' }}>
                  +₹25,000
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Simulate receiving an overdue invoice collection early
              </span>
            </div>

            <div
              onClick={() => handleApplyPreset('EXPENSE', 15000)}
              style={{
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(244, 63, 94, 0.08)',
                border: '1px solid var(--rose-border)',
                cursor: 'pointer',
                transition: 'var(--transition)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, color: 'var(--rose-400)', fontSize: '0.9rem' }}>
                  Emergency Equipment Maintenance
                </span>
                <span className="mono" style={{ fontWeight: 700, color: '#fff' }}>
                  -₹15,000
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Simulate immediate cash drain for equipment breakdown
              </span>
            </div>

            <div
              onClick={() => handleApplyPreset('EXPENSE', 50000)}
              style={{
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid var(--amber-border)',
                cursor: 'pointer',
                transition: 'var(--transition)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, color: 'var(--amber-400)', fontSize: '0.9rem' }}>
                  Bulk Inventory Purchase
                </span>
                <span className="mono" style={{ fontWeight: 700, color: '#fff' }}>
                  -₹50,000
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Evaluate whether cash reserves can sustain advance stock replenishment
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Simulation Result */}
      <ScenarioResultCard result={scenarioResult} />
    </div>
  );
}
