import { isWarningStatus, statusLabel } from '../lib/tracking';

export type StatusVariant = 'progress' | 'success' | 'warning' | 'danger';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

function variantFor(status: string): StatusVariant {
  if (status === 'delivered') return 'success';
  if (status === 'on_hold') return 'warning';
  if (status === 'delayed') return 'danger';
  return 'progress';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const variant = variantFor(status);
  // The label is always rendered, so status is never conveyed by colour alone.
  const prefix = isWarningStatus(status) ? '! ' : '';

  return (
    <span
      className={`status-badge status-badge--${variant} status-badge--${size}`}
    >
      {prefix}
      {statusLabel(status)}
    </span>
  );
}
