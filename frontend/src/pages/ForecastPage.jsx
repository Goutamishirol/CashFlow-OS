import React, { useState, useEffect, useCallback } from 'react';
import { useBusiness } from '../context/BusinessContext';
import { api } from '../api/client';
import { ForecastChart } from '../components/charts/ForecastChart';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorAlert } from '../components/common/ErrorAlert';
import { Badge } from '../components/common/Badge';
import { Calendar, AlertTriangle, CheckCircle2, TrendingDown } from 'lucide-react';

export function ForecastPage() {
  const { selectedBusinessId } = useBusiness();

  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [forecast, setForecast] = useState(null);

  const loadForecast = useCallback(async () => {
    if (!selectedBusinessId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await api.getForecast(selectedBusinessId, days);
      setForecast(data);
    } catch (err) {
      console.error('Error fetching cash flow forecast:', err);
      setError(err.message || 'Failed to generate cash-flow forecast');
    } finally {
      setLoading(false);
    }
  }, [selectedBusinessId, days]);

  useEffect(() => {
    loadForecast();
  }, [loadForecast]);

  return (
    <div>
      {/* Header & Timeframe Selector */}
      <div style={{ marginBottom: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Cash Flow Forecast</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Daily cash runway projections combining historical daily burn rate and due invoices.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            background: 'rgba(0, 0, 0, 0.4)',
            padding: '0.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            gap: '0.25rem',
          }}
        >
          {[15, 30, 60, 90].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: days === d ? 'var(--indigo-500)' : 'transparent',
                color: days === d ? '#fff' : 'var(--text-secondary)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'var(--transition)',
              }}
            >
              {d} Days
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message={`Simulating ${days}-day cash flow trajectories...`} />
      ) : error ? (
        <ErrorAlert message={error} onRetry={loadForecast} />
      ) : !forecast ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
          No forecast data available.
        </div>
      ) : (
        <>
          {/* Main Chart Card */}
          <div className="glass-card mb-6">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={18} style={{ color: 'var(--indigo-400)' }} />
                <h3 style={{ fontSize: '1.1rem' }}>{days}-Day Projected Balance Trajectory</h3>
              </div>

              <div>
                {forecast.shortageDetected ? (
                  <Badge variant="danger" icon={AlertTriangle}>
                    Deficit Alert
                  </Badge>
                ) : (
                  <Badge variant="healthy" icon={CheckCircle2}>
                    Positive Cash Position
                  </Badge>
                )}
              </div>
            </div>

            <ForecastChart
              dailyBalances={forecast.dailyBalances}
              shortageDetected={forecast.shortageDetected}
              shortageDate={forecast.shortageDate}
              shortageAmount={forecast.shortageAmount}
            />
          </div>

          {/* Daily Breakdown Table */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Day-by-Day Forecast Breakdown</h3>

            <div className="table-container" style={{ maxHeight: '420px', overflowY: 'auto' }}>
              <table className="data-table">
                <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                  <tr>
                    <th>Day</th>
                    <th>Date</th>
                    <th>Projected Balance (₹)</th>
                    <th>Liquidity Status</th>
                  </tr>
                </thead>
                <tbody>
                  {forecast.dailyBalances &&
                    forecast.dailyBalances.map((item, idx) => {
                      const balanceNum = Number(item.projectedBalance || 0);
                      const isNegative = balanceNum < 0;

                      return (
                        <tr key={idx} style={{ background: isNegative ? 'rgba(244, 63, 94, 0.05)' : undefined }}>
                          <td style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Day +{idx + 1}</td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <Calendar size={14} style={{ color: 'var(--text-muted)' }} />
                              {item.date}
                            </div>
                          </td>
                          <td
                            className="mono"
                            style={{
                              fontWeight: 700,
                              color: isNegative ? 'var(--rose-400)' : 'var(--emerald-400)',
                            }}
                          >
                            ₹{balanceNum.toLocaleString('en-IN')}
                          </td>
                          <td>
                            <Badge variant={isNegative ? 'danger' : 'healthy'}>
                              {isNegative ? 'Deficit' : 'Surplus'}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
