import React from 'react';

export function Badge({ children, variant = 'muted', icon: Icon, className = '' }) {
  const getVariantClass = () => {
    switch (variant?.toLowerCase()) {
      case 'paid':
      case 'healthy':
      case 'low':
      case 'income':
      case 'safe':
      case 'emerald':
        return 'badge-emerald';

      case 'overdue':
      case 'high':
      case 'expense':
      case 'at_risk':
      case 'danger':
      case 'rose':
        return 'badge-rose';

      case 'pending':
      case 'moderate':
      case 'medium':
      case 'amber':
        return 'badge-amber';

      case 'collect':
      case 'ai':
      case 'indigo':
        return 'badge-indigo';

      default:
        return 'badge-muted';
    }
  };

  return (
    <span className={`badge ${getVariantClass()} ${className}`}>
      {Icon && <Icon size={12} />}
      {children}
    </span>
  );
}
