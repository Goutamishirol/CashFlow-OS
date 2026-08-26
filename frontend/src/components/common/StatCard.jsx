import React from 'react';

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendPositive,
  variant = 'default',
  highlight = null,
}) {
  const getHighlightClass = () => {
    if (highlight === 'emerald') return 'highlight-emerald';
    if (highlight === 'rose') return 'highlight-rose';
    if (highlight === 'indigo') return 'highlight-indigo';
    return '';
  };

  const getIconStyles = () => {
    switch (variant) {
      case 'emerald':
        return { background: 'var(--emerald-bg)', color: 'var(--emerald-400)' };
      case 'rose':
        return { background: 'var(--rose-bg)', color: 'var(--rose-400)' };
      case 'indigo':
        return { background: 'var(--indigo-bg)', color: 'var(--indigo-400)' };
      case 'amber':
        return { background: 'var(--amber-bg)', color: 'var(--amber-400)' };
      case 'cyan':
        return { background: 'var(--cyan-bg)', color: 'var(--cyan-400)' };
      default:
        return { background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)' };
    }
  };

  return (
    <div className={`stat-card ${getHighlightClass()}`}>
      <div className="stat-card-header">
        <span>{title}</span>
        {Icon && (
          <div className="stat-icon-wrapper" style={getIconStyles()}>
            <Icon size={18} />
          </div>
        )}
      </div>

      <div className="stat-value">{value}</div>

      {(subtitle || trend) && (
        <div className="stat-subtitle">
          {trend && (
            <span
              style={{
                color: trendPositive ? 'var(--emerald-400)' : 'var(--rose-400)',
                fontWeight: 600,
              }}
            >
              {trend}
            </span>
          )}
          {subtitle && <span>{subtitle}</span>}
        </div>
      )}
    </div>
  );
}
