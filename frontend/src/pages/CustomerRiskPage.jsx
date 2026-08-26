import React, { useState, useEffect, useCallback } from 'react';
import { useBusiness } from '../context/BusinessContext';
import { api } from '../api/client';
import { RiskScoreCard } from '../components/risk/RiskScoreCard';
import { PredictionCard } from '../components/risk/PredictionCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorAlert } from '../components/common/ErrorAlert';
import { StatCard } from '../components/common/StatCard';
import { ShieldAlert, Users, AlertTriangle, Clock } from 'lucide-react';

export function CustomerRiskPage() {
  const { selectedBusinessId } = useBusiness();

  const [riskScores, setRiskScores] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('RISK'); // RISK, PREDICTIONS

  const loadRiskData = useCallback(async () => {
    if (!selectedBusinessId) return;

    try {
      setLoading(true);
      setError(null);

      const [riskRes, predRes] = await Promise.allSettled([
        api.getCustomerRisk(selectedBusinessId),
        api.getPaymentPredictions(selectedBusinessId),
      ]);

      if (riskRes.status === 'fulfilled') setRiskScores(Array.isArray(riskRes.value) ? riskRes.value : []);
      if (predRes.status === 'fulfilled') setPredictions(Array.isArray(predRes.value) ? predRes.value : []);

      if (riskRes.status === 'rejected' && predRes.status === 'rejected') {
        throw new Error(riskRes.reason?.message || 'Failed to load risk analysis data');
      }
    } catch (err) {
      console.error('Error fetching risk analysis:', err);
      setError(err.message || 'Failed to load risk analysis');
    } finally {
      setLoading(false);
    }
  }, [selectedBusinessId]);

  useEffect(() => {
    loadRiskData();
  }, [loadRiskData]);

  // Aggregate stats
  const highRiskCount = riskScores.filter((r) => r.riskLevel === 'HIGH').length;
  const mediumRiskCount = riskScores.filter((r) => r.riskLevel === 'MEDIUM').length;
  const totalAtRiskAmount = riskScores
    .filter((r) => r.riskLevel === 'HIGH' || r.riskLevel === 'MEDIUM')
    .reduce((sum, r) => sum + Number(r.totalOutstanding || 0), 0);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Customer Risk & Payment Predictions</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Historical overdue behavior analytics and AI-predicted payment delay probabilities.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="stat-card-grid">
        <StatCard
          title="High Risk Debtors"
          value={`${highRiskCount}`}
          subtitle={`${mediumRiskCount} medium risk customers`}
          icon={ShieldAlert}
          variant="rose"
          highlight={highRiskCount > 0 ? 'rose' : null}
        />

        <StatCard
          title="Debt at Significant Risk"
          value={`₹${totalAtRiskAmount.toLocaleString('en-IN')}`}
          subtitle="Uncollected high & medium risk balance"
          icon={AlertTriangle}
          variant="amber"
        />

        <StatCard
          title="Customer Profiles Analyzed"
          value={`${riskScores.length}`}
          subtitle="Evaluated across all historical invoices"
          icon={Users}
          variant="indigo"
        />
      </div>

      {/* View Switcher Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '0.5rem',
        }}
      >
        <button
          onClick={() => setActiveTab('RISK')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            background: activeTab === 'RISK' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
            color: activeTab === 'RISK' ? '#fff' : 'var(--text-secondary)',
            borderBottom: activeTab === 'RISK' ? '2px solid var(--indigo-500)' : '2px solid transparent',
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <ShieldAlert size={16} />
          Customer Risk Scorecards ({riskScores.length})
        </button>

        <button
          onClick={() => setActiveTab('PREDICTIONS')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            background: activeTab === 'PREDICTIONS' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
            color: activeTab === 'PREDICTIONS' ? '#fff' : 'var(--text-secondary)',
            borderBottom: activeTab === 'PREDICTIONS' ? '2px solid var(--indigo-500)' : '2px solid transparent',
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <Clock size={16} />
          Payment Delay Predictions ({predictions.length})
        </button>
      </div>

      {loading ? (
        <LoadingSpinner message="Calculating customer default risk & delay probabilities..." />
      ) : error ? (
        <ErrorAlert message={error} onRetry={loadRiskData} />
      ) : activeTab === 'RISK' ? (
        riskScores.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            No customer invoice history found to calculate risk. Add invoices to evaluate debtor risks.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {riskScores.map((score, idx) => (
              <RiskScoreCard key={idx} score={score} />
            ))}
          </div>
        )
      ) : predictions.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          No payment predictions available.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {predictions.map((pred, idx) => (
            <PredictionCard key={idx} prediction={pred} />
          ))}
        </div>
      )}
    </div>
  );
}
