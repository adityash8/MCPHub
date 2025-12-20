'use client'

import { HealthStatus } from '@/lib/types'

interface HealthStatusBadgeProps {
  status: HealthStatus
  size?: 'sm' | 'md'
}

export default function HealthStatusBadge({ status, size = 'md' }: HealthStatusBadgeProps) {
  const config = {
    healthy: {
      color: 'bg-green-500',
      label: 'Healthy',
      emoji: '🟢',
    },
    degraded: {
      color: 'bg-yellow-500',
      label: 'Degraded',
      emoji: '🟡',
    },
    down: {
      color: 'bg-red-500',
      label: 'Down',
      emoji: '🔴',
    },
    unknown: {
      color: 'bg-gray-500',
      label: 'Unknown',
      emoji: '⚪',
    },
  }

  const { color, label, emoji } = config[status]
  const sizeClass = size === 'sm' ? 'w-2 h-2' : 'w-3 h-3'

  return (
    <div className="flex items-center gap-1.5">
      <div className={`${sizeClass} ${color} rounded-full`} title={label} />
      {size === 'md' && (
        <span className="text-xs text-gray-600 dark:text-gray-400">{emoji} {label}</span>
      )}
    </div>
  )
}

