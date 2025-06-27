'use client'

import { cn } from '@/lib/utils'
import { ProcessingStage, StageStatus } from '@/types/processing'
import { Check, X, Loader2 } from 'lucide-react'

interface StageIndicatorProps {
  stage: ProcessingStage
  status: StageStatus
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function StageIndicator({ stage, status, size = 'md', className }: StageIndicatorProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  }

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }

  const getStatusColor = () => {
    switch (status) {
      case StageStatus.COMPLETED:
        return 'bg-green-500 text-white'
      case StageStatus.IN_PROGRESS:
        return 'bg-blue-500 text-white animate-pulse'
      case StageStatus.FAILED:
        return 'bg-red-500 text-white'
      default:
        return 'bg-gray-200 dark:bg-gray-700 text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-600'
    }
  }

  const getIcon = () => {
    switch (status) {
      case StageStatus.COMPLETED:
        return <Check className={iconSizes[size]} />
      case StageStatus.IN_PROGRESS:
        return <Loader2 className={cn(iconSizes[size], 'animate-spin')} />
      case StageStatus.FAILED:
        return <X className={iconSizes[size]} />
      default:
        return <div className={cn(iconSizes[size], 'rounded-full bg-current opacity-30')} />
    }
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full transition-all duration-300',
        sizeClasses[size],
        getStatusColor(),
        className,
      )}
      title={`${stage}: ${status}`}
    >
      {getIcon()}
    </div>
  )
}
