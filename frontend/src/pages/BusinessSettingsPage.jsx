import React, { useState } from 'react';
import { useBusiness } from '../context/BusinessContext';
import { api } from '../api/client';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import {
  Building2,
  Plus,
  Server,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Database,
  Cpu,
} from 'lucide-react';

export function BusinessSettingsPage() {
  const {
    businesses,
    selectedBusiness,
    selectedBusinessId,
    selectBusiness,
    addBusiness,
    refreshBusinesses,
    backendOnline,
  } = useBusiness();

  const [formData, setFormData] = useState({
    name: '',
    currentBalance: '',
    monthlyExpenses: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  const [aiTesting, setAiTesting] = useState(false);
  const [aiTestResult, setAiTestResult] = useState(null);
  const [aiTestError, setAiTestError] = useState(null);

  const handleCreateBusiness = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      setSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(null);

      const created = await addBusiness({
        name: formData.name.trim(),
        currentBalance: parseFloat(formData.currentBalance) || 0,
        monthlyExpenses: parseFloat(formData.monthlyExpenses) || 0,
      });

      setSubmitSuccess(`Business "${created.name}" created successfully!`);
      setFormData({ name: '', currentBalance: '', monthlyExpenses: '' });
    } catch (err) {
      console.error('Error creating business profile:', err);
      setSubmitError(err.message || 'Failed to create business');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTestAI = async () => {
    try {
      setAiTesting(true);
      setAiTestResult(null);
      setAiTestError(null);

      const result = await api.testAI();
      setAiTestResult(result);
    } catch (err) {
      console.error('AI Test failed:', err);
      setAiTestError(err.message || 'Gemini API test call failed');
    } finally {
      setAiTesting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Business Settings & Diagnostics</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Manage business entity profiles, review active parameters, and inspect backend/AI connectivity.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', marginBottom: '1.75rem' }}>
        {/* Create New Business Card */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, #10B981, #06B6D4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
              }}
            >
              <Plus size={18} />
            </div>
            <h3 style={{ fontSize: '1.1rem' }}>Register New Business Profile</h3>
          </div>

          {submitError && (
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
              {submitError}
            </div>
          )}

          {submitSuccess && (
            <div
              style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--emerald-bg)',
                color: 'var(--emerald-400)',
                fontSize: '0.825rem',
                marginBottom: '1rem',
              }}
            >
              {submitSuccess}
            </div>
          )}

          <form onSubmit={handleCreateBusiness}>
            <div className="form-group">
              <label className="form-label">Legal Business Name *</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. Acme Tech Solutions"
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
                placeholder="e.g. 100000"
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
                placeholder="e.g. 35000"
                value={formData.monthlyExpenses}
                onChange={(e) => setFormData({ ...formData, monthlyExpenses: e.target.value })}
              />
            </div>

            <div style={{ marginTop: '1.25rem' }}>
              <Button
                type="submit"
                variant="primary"
                icon={Building2}
                loading={submitting}
                className="w-full"
              >
                Save Business Profile
              </Button>
            </div>
          </form>
        </div>

        {/* Registered Businesses List */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem' }}>Registered Businesses ({businesses.length})</h3>
            <Button variant="secondary" size="sm" onClick={() => refreshBusinesses()}>
              Refresh
            </Button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '360px', overflowY: 'auto' }}>
            {businesses.map((b) => {
              const isActive = String(b.id) === String(selectedBusinessId);
              return (
                <div
                  key={b.id}
                  onClick={() => selectBusiness(b.id)}
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                    border: `1px solid ${isActive ? 'var(--indigo-border)' : 'var(--border-subtle)'}`,
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: isActive ? '#fff' : 'var(--text-primary)' }}>
                      {b.name}
                    </div>
                    {isActive && <Badge variant="indigo">Active</Badge>}
                  </div>

                  <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <div>
                      Balance:{' '}
                      <span className="mono" style={{ fontWeight: 600, color: 'var(--emerald-400)' }}>
                        ₹{Number(b.currentBalance || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div>
                      Monthly Burn:{' '}
                      <span className="mono" style={{ fontWeight: 600, color: 'var(--rose-400)' }}>
                        ₹{Number(b.monthlyExpenses || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Backend & AI Connectivity Health Monitor */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>System & Integration Diagnostics</h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {/* Spring Boot Check */}
          <div
            style={{
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(0, 0, 0, 0.25)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <Server size={18} style={{ color: backendOnline ? 'var(--emerald-400)' : 'var(--rose-400)' }} />
              <h4 style={{ fontSize: '0.95rem' }}>Spring Boot Core API</h4>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              Proxy: <code>/api</code> &rarr; <code>http://localhost:8080</code>
            </p>
            <Badge variant={backendOnline ? 'healthy' : 'danger'}>
              {backendOnline ? 'CONNECTED & RUNNING' : 'OFFLINE / UNREACHABLE'}
            </Badge>
          </div>

          {/* Gemini AI Diagnostic */}
          <div
            style={{
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(0, 0, 0, 0.25)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <Sparkles size={18} style={{ color: 'var(--indigo-400)' }} />
              <h4 style={{ fontSize: '0.95rem' }}>Google Gemini AI Model</h4>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              Endpoint: <code>GET /api/ai/test</code> (model <code>gemini-3.6-flash</code>)
            </p>
            <Button
              variant="secondary"
              size="sm"
              icon={Sparkles}
              loading={aiTesting}
              onClick={handleTestAI}
            >
              Test Gemini Connectivity
            </Button>
          </div>
        </div>

        {/* AI Ping Result */}
        {aiTestResult && (
          <div
            style={{
              marginTop: '1rem',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--emerald-bg)',
              border: '1px solid var(--emerald-border)',
              color: 'var(--emerald-400)',
              fontSize: '0.85rem',
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={16} />
              <span>Gemini AI Connection Verified:</span>
            </div>
            <div style={{ color: 'var(--text-primary)', fontStyle: 'italic' }}>
              "{aiTestResult}"
            </div>
          </div>
        )}

        {aiTestError && (
          <div
            style={{
              marginTop: '1rem',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--rose-bg)',
              border: '1px solid var(--rose-border)',
              color: 'var(--rose-400)',
              fontSize: '0.85rem',
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <AlertCircle size={16} />
              <span>Gemini Connection Test Failed:</span>
            </div>
            <div>{aiTestError}</div>
          </div>
        )}
      </div>
    </div>
  );
}
