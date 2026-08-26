import React, { useState } from 'react';
import { TrendingUp, AlertTriangle } from 'lucide-react';

export function ForecastChart({ dailyBalances = [], shortageDetected = false, shortageDate = null, shortageAmount = null }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  if (!dailyBalances || dailyBalances.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
        No forecast data available.
      </div>
    );
  }

  // Determine chart scales
  const balances = dailyBalances.map((d) => Number(d.projectedBalance || 0));
  const minVal = Math.min(0, ...balances);
  const maxVal = Math.max(1000, ...balances);
  const range = maxVal - minVal || 1;

  const width = 800;
  const height = 260;
  const paddingX = 40;
  const paddingY = 30;
  const chartW = width - paddingX * 2;
  const chartH = height - paddingY * 2;

  const getX = (index) => paddingX + (index / (dailyBalances.length - 1 || 1)) * chartW;
  const getY = (val) => paddingY + chartH - ((val - minVal) / range) * chartH;

  // Zero-line Y
  const zeroY = getY(0);

  // SVG Points Path
  const points = dailyBalances.map((d, i) => `${getX(i)},${getY(Number(d.projectedBalance || 0))}`).join(' ');

  // Gradient area path
  const areaPath = `M ${getX(0)},${zeroY} L ${points} L ${getX(dailyBalances.length - 1)},${zeroY} Z`;

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      {shortageDetected && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.6rem 1rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--rose-bg)',
            border: '1px solid var(--rose-border)',
            color: 'var(--rose-400)',
            fontSize: '0.825rem',
            fontWeight: 600,
            marginBottom: '1rem',
          }}
        >
          <AlertTriangle size={16} />
          <span>
            Cash Shortage Projected on {shortageDate}: Shortfall of ₹{Number(shortageAmount || 0).toLocaleString('en-IN')}
          </span>
        </div>
      )}

      <div style={{ width: '100%', overflowX: 'auto' }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', height: 'auto', minWidth: '600px', display: 'block' }}
        >
          <defs>
            <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
              <stop offset="70%" stopColor="#6366F1" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#F43F5E" stopOpacity="0.25" />
            </linearGradient>

            <linearGradient id="strokeGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="50%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#818CF8" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line
            x1={paddingX}
            y1={zeroY}
            x2={width - paddingX}
            y2={zeroY}
            stroke="rgba(244, 63, 94, 0.4)"
            strokeDasharray="4 4"
            strokeWidth="1.5"
          />
          <text
            x={paddingX - 10}
            y={zeroY + 4}
            fill="var(--rose-400)"
            fontSize="10"
            textAnchor="end"
            fontFamily="monospace"
          >
            ₹0
          </text>

          {/* Top Max Line */}
          <line
            x1={paddingX}
            y1={paddingY}
            x2={width - paddingX}
            y2={paddingY}
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="1"
          />
          <text
            x={paddingX - 10}
            y={paddingY + 4}
            fill="var(--text-muted)"
            fontSize="10"
            textAnchor="end"
            fontFamily="monospace"
          >
            ₹{Math.round(maxVal).toLocaleString('en-IN')}
          </text>

          {/* Filled Area */}
          <path d={areaPath} fill="url(#balanceGrad)" />

          {/* Smooth Line */}
          <polyline
            fill="none"
            stroke="url(#strokeGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />

          {/* Data Points */}
          {dailyBalances.map((d, i) => {
            const cx = getX(i);
            const cy = getY(Number(d.projectedBalance || 0));
            const isNegative = Number(d.projectedBalance || 0) < 0;
            const isHovered = hoveredPoint === i;

            return (
              <g key={i} onMouseEnter={() => setHoveredPoint(i)} onMouseLeave={() => setHoveredPoint(null)}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 6 : 3.5}
                  fill={isNegative ? '#F43F5E' : '#10B981'}
                  stroke="#0F172A"
                  strokeWidth="2"
                  style={{ cursor: 'pointer', transition: 'r 0.2s' }}
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Hover Info Tooltip Banner */}
      {hoveredPoint !== null && (
        <div
          style={{
            marginTop: '0.75rem',
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-card-solid)',
            border: '1px solid var(--border-highlight)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '1rem',
            fontSize: '0.825rem',
          }}
        >
          <span style={{ color: 'var(--text-muted)' }}>
            Date: <strong>{dailyBalances[hoveredPoint].date}</strong>
          </span>
          <span
            style={{
              color:
                Number(dailyBalances[hoveredPoint].projectedBalance || 0) >= 0
                  ? 'var(--emerald-400)'
                  : 'var(--rose-400)',
              fontWeight: 700,
            }}
          >
            Projected Balance: ₹
            {Number(dailyBalances[hoveredPoint].projectedBalance || 0).toLocaleString('en-IN')}
          </span>
        </div>
      )}
    </div>
  );
}
