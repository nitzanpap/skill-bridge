'use client'

import { cn } from '@/lib/utils'
import { ProcessingStage, StageStatus, PROCESSING_STAGES, STAGE_ORDER } from '@/types/processing'
import { StageIndicator } from './stage-indicator'
import { ChevronRight } from 'lucide-react'

interface ProgressPipelineProps {
  currentStage: ProcessingStage
  stageProgress: Record<ProcessingStage, number>
  className?: string
  isInteractive?: boolean
  onStageClick?: (stage: ProcessingStage) => void
}

export function ProgressPipeline({
  currentStage,
  stageProgress,
  className,
  isInteractive = false,
  onStageClick,
}: ProgressPipelineProps) {
  const getStageStatus = (stage: ProcessingStage): StageStatus => {
    if (stageProgress[stage] === 100) return StageStatus.COMPLETED
    if (stage === currentStage) return StageStatus.IN_PROGRESS
    return StageStatus.PENDING
  }

  const isStageActive = (stage: ProcessingStage) => {
    const currentIndex = STAGE_ORDER.indexOf(currentStage)
    const stageIndex = STAGE_ORDER.indexOf(stage)
    return stageIndex <= currentIndex
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Mobile: Vertical layout */}
      <div className='block md:hidden'>
        <div className='space-y-3'>
          {STAGE_ORDER.map((stage, index) => {
            const isLast = index === STAGE_ORDER.length - 1
            const stageInfo = PROCESSING_STAGES[stage]
            const status = getStageStatus(stage)
            const active = isStageActive(stage)

            return (
              <div key={stage} className='flex items-center space-x-3'>
                <div
                  className={cn(
                    'flex items-center space-x-3',
                    isInteractive &&
                      onStageClick &&
                      'cursor-pointer transition-transform hover:scale-105',
                  )}
                  onClick={() => isInteractive && onStageClick?.(stage)}
                >
                  <StageIndicator stage={stage} status={status} size='sm' />
                  <div className='min-w-0 flex-1'>
                    <div
                      className={cn(
                        'truncate text-sm font-medium',
                        active
                          ? 'text-gray-900 dark:text-white'
                          : 'text-gray-400 dark:text-gray-600',
                        isInteractive && 'hover:text-blue-600 dark:hover:text-blue-400',
                      )}
                    >
                      {stageInfo.name}
                    </div>
                    {status === StageStatus.IN_PROGRESS && (
                      <div className='text-xs text-blue-600 dark:text-blue-400'>
                        {Math.round(stageProgress[stage])}%
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Desktop: Horizontal layout */}
      <div className='hidden md:block'>
        <div className='flex w-full items-center justify-between pb-4'>
          {STAGE_ORDER.map((stage, index) => {
            const isLast = index === STAGE_ORDER.length - 1
            const stageInfo = PROCESSING_STAGES[stage]
            const status = getStageStatus(stage)
            const active = isStageActive(stage)

            return (
              <div key={stage} className='flex min-w-0 items-center'>
                {/* Stage */}
                <div
                  className={cn(
                    'flex min-w-0 flex-col items-center overflow-x-hidden',
                    isInteractive &&
                      onStageClick &&
                      'cursor-pointer transition-transform hover:scale-105',
                  )}
                  onClick={() => isInteractive && onStageClick?.(stage)}
                >
                  <StageIndicator stage={stage} status={status} size='md' className='mb-2' />
                  <div className='min-w-0 text-center'>
                    <div
                      className={cn(
                        'max-w-20 truncate text-xs font-medium',
                        active
                          ? 'text-gray-900 dark:text-white'
                          : 'text-gray-400 dark:text-gray-600',
                        isInteractive && 'hover:text-blue-600 dark:hover:text-blue-400',
                      )}
                    >
                      {stageInfo.name}
                    </div>
                    {status === StageStatus.IN_PROGRESS && (
                      <div className='mt-1 text-xs text-blue-600 dark:text-blue-400'>
                        {Math.round(stageProgress[stage])}%
                      </div>
                    )}
                  </div>
                </div>

                {/* Arrow */}
                {!isLast && (
                  <div className='mx-3 flex items-center'>
                    <ChevronRight
                      className={cn(
                        'h-4 w-4',
                        active
                          ? 'text-gray-400 dark:text-gray-500'
                          : 'text-gray-300 dark:text-gray-700',
                      )}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className='mt-4'>
        <div className='mb-2 flex items-center justify-between'>
          <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
            Overall Progress
          </span>
        </div>
        <div className='h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700'>
          <div
            className='h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-out'
            style={{
              width: `${((STAGE_ORDER.indexOf(currentStage) + stageProgress[currentStage] / 100) / STAGE_ORDER.length) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  )
}
