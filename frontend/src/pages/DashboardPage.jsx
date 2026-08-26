import React, { useState, useEffect, useCallback } from 'react';
import { useBusiness } from '../context/BusinessContext';
import { api } from '../api/client';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorAlert } from '../components/common/ErrorAlert';
import { HealthGauge } from '../components/charts/HealthGauge';
import { ForecastChart } from '../components/charts/ForecastChart';
import {
  Wallet,
  ReceiptText,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  TrendingDown,
  ShieldAlert,
  Users,
  Compass,
} from 'lucide-react';

export function DashboardPage({ setCurrentPage }) {
  const { selectedBusiness, selectedBusinessId } = useBusiness();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [healthData, setHealthData] = useState(null);
  const [aiInsight, setAiInsight] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [invoices, setInvoices] = useState([]);

  const loadDashboardData = useCallback(async () => {
    if (!selectedBusinessId) return;

    try {
      setLoading(true);
      setError(null);

      // Concurrently fetch all dashboard data
      const [healthRes, aiRes, recRes, forecastRes, invRes] = await Promise.allSettled([
        api.getFinancialHealth(selectedBusinessId),
        api.getAIInsight(selectedBusinessId),
        api.getRecommendation(selectedBusinessId),
        api.getForecast(selectedBusinessId, 30),
        api.getInvoices(selectedBusinessId),
      ]);

      if (healthRes.status === 'fulfilled') setHealthData(healthRes.value);
      if (aiRes.status === 'fulfilled') setAiInsight(aiRes.value);
      if (recRes.status === 'fulfilled') setRecommendation(recRes.value);
      if (forecastRes.status === 'fulfilled') setForecast(forecastRes.value);
      if (invRes.status === 'fulfilled') setInvoices(invRes.value);

      // If all failed, trigger error
      if (
        healthRes.status === 'rejected' &&
        aiRes.status === 'rejected' &&
        forecastRes.status === 'rejected'
      ) {
        throw new Error(healthRes.reason?.message || 'Failed to load dashboard data');
      }
    } catch (err) {
      console.error('Error fetching dashboard signals:', err);
      setError(err.message || 'Failed to fetch dashboard metrics');
    } finally {
      setLoading(false);
    }
  }, [selectedBusinessId]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  if (loading) {
    return <LoadingSpinner message="Synthesizing financial intelligence & AI insights..." />;
  }

  if (error && !healthData && !forecast) {
    return <ErrorAlert message={error} onRetry={loadDashboardData} />;
  }

  const currentBalance = Number(selectedBusiness?.currentBalance || 0);
  const monthlyExpenses = Number(selectedBusiness?.monthlyExpenses || 0);

  const totalOutstanding = Array.isArray(invoices)
    ? invoices
        .filter((i) => i.status !== 'PAID')
        .reduce((sum, i) => sum + Number(i.amount || 0), 0)
    : 0;

  const overdueCount = Array.isArray(invoices)
    ? invoices.filter((i) => i.status === 'OVERDUE').length
    : 0;

  return (
    <div>
      {/* Page Title & Subtitle */}
      <div style={{ marginBottom: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Executive Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Real-time cash positioning, health score, and forward-looking AI decision intelligence.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setCurrentPage('scenarios')}
            icon={Sparkles}
          >
            What-If Simulator
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setCurrentPage('invoices')}
            icon={ReceiptText}
          >
            Manage Invoices
          </Button>
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="stat-card-grid">
        <StatCard
          title="Current Cash Balance"
          value={`₹${currentBalance.toLocaleString('en-IN')}`}
          subtitle={`Runway ~${monthlyExpenses > 0 ? (currentBalance / (monthlyExpenses / 30)).toFixed(0) : '∞'} days`}
          icon={Wallet}
          variant="emerald"
        />

        <StatCard
          title="Monthly Operating Burn"
          value={`₹${monthlyExpenses.toLocaleString('en-IN')}`}
          subtitle="Estimated operational expenses"
          icon={TrendingDown}
          variant="indigo"
        />

        <StatCard
          title="Uncollected Invoices"
          value={`₹${totalOutstanding.toLocaleString('en-IN')}`}
          subtitle={`${overdueCount} overdue invoice${overdueCount === 1 ? '' : 's'}`}
          icon={ReceiptText}
          variant={overdueCount > 0 ? 'rose' : 'amber'}
        />

        <StatCard
          title="30-Day Cash Forecast"
          value={
            forecast?.shortageDetected
              ? `₹${Number(forecast.shortageAmount || 0).toLocaleString('en-IN')}`
              : 'Safe Runway'
          }
          subtitle={
            forecast?.shortageDetected
              ? `Shortfall on ${forecast.shortageDate}`
              : 'No shortage projected'
          }
          icon={AlertTriangle}
          variant={forecast?.shortageDetected ? 'rose' : 'emerald'}
          highlight={forecast?.shortageDetected ? 'rose' : 'emerald'}
        />
      </div>

      {/* AI Intelligence Hero Banner */}
      {aiInsight && (
        <div
          className="glass-card highlight-indigo"
          style={{
            marginBottom: '1.75rem',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(15, 23, 42, 0.85))',
            border: '1px solid rgba(99, 102, 241, 0.35)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-md)',
                  background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  boxShadow: '0 0 12px rgba(99, 102, 241, 0.5)',
                }}
              >
                <Sparkles size={18} />
              </div>
              <h3 style={{ fontSize: '1.15rem' }}>AI Co-Pilot Financial Summary</h3>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Badge variant={aiInsight.cashFlowStatus}>{aiInsight.cashFlowStatus}</Badge>
              <Badge variant={aiInsight.riskLevel}>{aiInsight.riskLevel} Risk</Badge>
            </div>
          </div>

          <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1rem' }}>
            {aiInsight.summary}
          </p>

          <div
            style={{
              padding: '0.85rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(0, 0, 0, 0.35)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  color: 'var(--indigo-400)',
                  display: 'block',
                }}
              >
                Recommended Action
              </span>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>
                {aiInsight.recommendedAction}
              </span>
            </div>

            <Button
              variant="indigo"
              size="sm"
              icon={ArrowRight}
              onClick={() => setCurrentPage('collections')}
            >
              Follow Up Debtors
            </Button>
          </div>
        </div>
      )}

      {/* Two Column Layout: Health Gauge & Decision Engine */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '1.75rem' }}>
        {/* Financial Health Card */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem' }}>Financial Health & Borrowing Safety</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Heuristic Model</span>
          </div>

          {healthData ? (
            <HealthGauge
              score={healthData.score}
              status={healthData.status}
              borrowingSafe={healthData.borrowingSafe}
              explanation={healthData.explanation}
            />
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Health data unavailable.</p>
          )}
        </div>

        {/* Actionable Decision Card */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Compass size={18} style={{ color: 'var(--cyan-400)' }} />
              <h3 style={{ fontSize: '1.1rem' }}>Next Action Directive</h3>
            </div>
            {recommendation && <Badge variant={recommendation.action}>{recommendation.action}</Badge>}
          </div>

          {recommendation ? (
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                {recommendation.message}
              </p>

              {recommendation.priorityCustomers && recommendation.priorityCustomers.length > 0 && (
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                    Priority Customers to Chase First:
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {recommendation.priorityCustomers.map((cust, idx) => (
                      <span
                        key={idx}
                        style={{
                          padding: '0.35rem 0.75rem',
                          borderRadius: 'var(--radius-full)',
                          background: 'var(--rose-bg)',
                          border: '1px solid var(--rose-border)',
                          color: 'var(--rose-400)',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                        }}
                      >
                        <Users size={12} />
                        {cust}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No recommendation generated.</p>
          )}
        </div>
      </div>

      {/* Mini 30-Day Forecast Section */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem' }}>30-Day Projected Cash Flow</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Computed from transaction burn rate and scheduled invoice receipts.
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={() => setCurrentPage('forecast')}>
            Full Forecast Details
          </Button>
        </div>

        {forecast ? (
          <ForecastChart
            dailyBalances={forecast.dailyBalances}
            shortageDetected={forecast.shortageDetected}
            shortageDate={forecast.shortageDate}
            shortageAmount={forecast.shortageAmount}
          />
        ) : (
          <p style={{ color: 'var(--text-muted)' }}>Forecast data unavailable.</p>
        )}
      </div>
    </div>
  );
}
