'use client'

import { X, Play, Pause, Square, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  ProcessingState,
  ProcessingStage,
  StageStatus,
  PROCESSING_STAGES,
  ProcessingMode,
  PlaybackState,
} from '@/types/processing'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { StageIndicator } from '@/components/processing/stage-indicator'
import { ModelCard } from '@/components/processing/model-card'
import { ProgressPipeline } from '@/components/processing/progress-pipeline'
import { StageVisualization } from '@/components/processing/stage-visualization'

interface ProcessingModalProps {
  isOpen: boolean
  onClose: () => void
  processingState: ProcessingState
  onPause?: () => void
  onResume?: () => void
  onStop?: () => void
  onNextStage?: () => void
  onPreviousStage?: () => void
  onGoToStage?: (stage: ProcessingStage) => void
}

export function ProcessingModal({
  isOpen,
  onClose,
  processingState,
  onPause,
  onResume,
  onStop,
  onNextStage,
  onPreviousStage,
  onGoToStage,
}: ProcessingModalProps) {
  const {
    currentStage,
    timeElapsed,
    estimatedTimeRemaining,
    modelsInUse,
    totalProgress,
    extractedSkills,
    mode,
    playbackState,
    isInteractive,
  } = processingState

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`
  }

  const currentStageInfo = PROCESSING_STAGES[currentStage]
  const isCompleted = currentStage === ProcessingStage.COMPLETED

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className='max-h-[95vh] w-[95vw] max-w-6xl overflow-y-auto p-4 md:p-6'>
        {/* Header */}
        <DialogHeader className='flex flex-col space-y-2 pb-2 md:flex-row md:items-center md:justify-between md:space-y-0'>
          <div className='flex items-center space-x-3'>
            <div className='flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 md:h-8 md:w-8'>
              <span className='text-xs font-bold text-white md:text-sm'>SB</span>
            </div>
            <div>
              <DialogTitle className='text-lg font-semibold md:text-xl'>
                Skill Bridge AI Analysis
              </DialogTitle>
              <DialogDescription
                id='processing-modal-description'
                className='text-xs text-muted-foreground md:text-sm'
              >
                Processing your resume and job requirements
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Progress Pipeline */}
        <div className='mb-6 md:mb-8'>
          <ProgressPipeline
            currentStage={currentStage}
            stageProgress={processingState.stageProgress}
            isInteractive={isInteractive}
            onStageClick={onGoToStage}
          />
        </div>

        {/* Current Stage Info */}
        <div className='mb-4 md:mb-6'>
          <div className='mb-2 flex items-center space-x-2 md:space-x-3'>
            <StageIndicator
              stage={currentStage}
              status={isCompleted ? StageStatus.COMPLETED : StageStatus.IN_PROGRESS}
              size='sm'
            />
            <div className='min-w-0 flex-1'>
              <h3 className='text-base font-medium md:text-lg'>{currentStageInfo.name}</h3>
              <p className='text-xs text-muted-foreground md:text-sm'>
                {currentStageInfo.description}
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Controls - Only show in demo mode */}
        {mode === ProcessingMode.DEMO && isInteractive && (
          <div className='mb-4 md:mb-6'>
            <div className='flex flex-col space-y-3 rounded-lg bg-secondary p-3 md:flex-row md:items-center md:justify-between md:space-y-0 md:p-4'>
              <div className='flex flex-wrap items-center gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={onPreviousStage}
                  disabled={currentStage === ProcessingStage.DATA_RECEPTION}
                  className='text-xs'
                >
                  <ChevronLeft className='h-3 w-3 md:h-4 md:w-4' />
                  <span className='hidden sm:inline'>Previous</span>
                </Button>

                {playbackState === PlaybackState.PLAYING ? (
                  <Button variant='outline' size='sm' onClick={onPause} className='text-xs'>
                    <Pause className='h-3 w-3 md:h-4 md:w-4' />
                    <span className='hidden sm:inline'>Pause</span>
                  </Button>
                ) : (
                  <Button variant='outline' size='sm' onClick={onResume} className='text-xs'>
                    <Play className='h-3 w-3 md:h-4 md:w-4' />
                    <span className='hidden sm:inline'>Resume</span>
                  </Button>
                )}

                <Button variant='outline' size='sm' onClick={onStop} className='text-xs'>
                  <Square className='h-3 w-3 md:h-4 md:w-4' />
                  <span className='hidden sm:inline'>Stop</span>
                </Button>

                <Button
                  variant='outline'
                  size='sm'
                  onClick={onNextStage}
                  disabled={currentStage === ProcessingStage.COMPLETED}
                  className='text-xs'
                >
                  <span className='hidden sm:inline'>Next</span>
                  <ChevronRight className='h-3 w-3 md:h-4 md:w-4' />
                </Button>
              </div>

              <div className='text-xs text-muted-foreground md:text-sm'>
                <span className='rounded bg-blue-100 px-2 py-1 text-blue-800 dark:bg-blue-900 dark:text-blue-200'>
                  Demo Mode
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Progress Stats */}
        <div className='rounded-lg bg-secondary p-3 md:p-4'>
          <div className='grid grid-cols-2 gap-3 text-center md:grid-cols-4 md:gap-4'>
            <div>
              <div className='text-xl font-bold text-blue-600 dark:text-blue-400 md:text-2xl'>
                {Math.round(totalProgress)}%
              </div>
              <div className='text-xs text-muted-foreground'>Complete</div>
            </div>
            <div>
              <div className='text-xl font-bold text-green-600 dark:text-green-400 md:text-2xl'>
                {formatTime(timeElapsed)}
              </div>
              <div className='text-xs text-muted-foreground'>Elapsed</div>
            </div>
            <div>
              <div className='text-xl font-bold text-orange-600 dark:text-orange-400 md:text-2xl'>
                {formatTime(estimatedTimeRemaining)}
              </div>
              <div className='text-xs text-muted-foreground'>Remaining</div>
            </div>
            <div>
              <div className='text-xl font-bold text-purple-600 dark:text-purple-400 md:text-2xl'>
                {extractedSkills.resume.length + extractedSkills.job.length}
              </div>
              <div className='text-xs text-muted-foreground'>Skills Found</div>
            </div>
          </div>
        </div>

        {/* Completion Message */}
        {isCompleted && (
          <div className='mt-4 text-center md:mt-6'>
            <div className='inline-flex items-center space-x-2 rounded-full bg-green-100 px-3 py-2 text-green-800 dark:bg-green-900 dark:text-green-200 md:px-4'>
              <div className='h-2 w-2 animate-pulse rounded-full bg-green-500' />
              <span className='text-xs font-medium md:text-sm'>
                Analysis completed successfully!
              </span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
