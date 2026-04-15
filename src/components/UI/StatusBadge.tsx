'use client';

import { PlaceStatus } from '@/types';

interface StatusBadgeProps {
  status: PlaceStatus;
  size?: 'sm' | 'md' | 'lg';
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2',
  };

  const badgeClasses = {
    want: 'badge-want',
    done: 'badge-done',
  };

  const labels = {
    want: 'Want to Try',
    done: 'Done',
  };

  return (
    <span className={`${badgeClasses[status]} ${sizeClasses[size]} font-medium inline-flex items-center gap-1`}>
      <span>{status === 'want' ? '🔵' : '✅'}</span>
      {labels[status]}
    </span>
  );
}
