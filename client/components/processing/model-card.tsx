'use client'

import { cn } from '@/lib/utils'
import { ModelStatus, StageStatus } from '@/types/processing'
import { Badge } from '@/components/ui/badge'
import { Brain, Database, Zap, Search } from 'lucide-react'

interface ModelCardProps {
  model: ModelStatus
  className?: string
}

export function ModelCard({ model, className }: ModelCardProps) {
  const getModelIcon = () => {
    switch (model.type) {
      case 'NER':
        return <Search className='h-4 w-4' />
      case 'Embedding':
        return <Zap className='h-4 w-4' />
      case 'LLM':
        return <Brain className='h-4 w-4' />
      case 'Database':
        return <Database className='h-4 w-4' />
      default:
        return <Zap className='h-4 w-4' />
    }
  }

  const getStatusColor = () => {
    switch (model.status) {
      case StageStatus.COMPLETED:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case StageStatus.IN_PROGRESS:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case StageStatus.FAILED:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    }
  }

  const getProgressColor = () => {
    switch (model.status) {
      case StageStatus.COMPLETED:
        return 'bg-green-500'
      case StageStatus.IN_PROGRESS:
        return 'bg-blue-500'
      case StageStatus.FAILED:
        return 'bg-red-500'
      default:
        return 'bg-gray-300'
    }
  }

  return (
    <div
      className={cn(
        'rounded-lg border border-gray-200 bg-white p-4 transition-all duration-200 dark:border-gray-700 dark:bg-gray-800',
        model.status === StageStatus.IN_PROGRESS && 'ring-2 ring-blue-200 dark:ring-blue-800',
        className,
      )}
    >
      <div className='mb-3 flex flex-wrap items-start justify-between'>
        <div className='flex flex-wrap items-center space-x-2'>
          <div className={cn('rounded-md p-1.5', getStatusColor())}>{getModelIcon()}</div>
          <div className='min-w-0 flex-1'>
            <h4 className='truncate text-sm font-medium text-gray-900 dark:text-white'>
              {model.name}
            </h4>
            <p className='text-xs text-gray-500 dark:text-gray-400'>{model.description}</p>
          </div>
        </div>
        <Badge variant='secondary' className={cn('text-xs', getStatusColor())}>
          {model.type}
        </Badge>
      </div>

      <div className='space-y-2'>
        <div className='flex items-center justify-between text-xs'>
          <span className='text-gray-500 dark:text-gray-400'>Progress</span>
          <span className='font-medium text-gray-900 dark:text-white'>
            {Math.round(model.progress)}%
          </span>
        </div>
        <div className='h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700'>
          <div
            className={cn(
              'h-2 rounded-full transition-all duration-300',
              getProgressColor(),
              model.status === StageStatus.IN_PROGRESS && 'animate-pulse',
            )}
            style={{ width: `${model.progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}
